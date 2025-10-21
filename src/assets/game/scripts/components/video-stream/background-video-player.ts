import { _decorator, CCInteger, Component } from "cc";
import Hls from "hls.js";
import { DOMBackgroundVideo } from "./dom-background-video";
import { SYNC_VIDEO_DIMENSION_EVENT, VideoOffSetContainer } from "./video-offset-container";

const { ccclass, property } = _decorator;

export const VIDEO_ENDED_EVENT = "videoEnded";

@ccclass("BackgroundVideoPlayer")
export class BackgroundVideoPlayer extends Component {
    @property(VideoOffSetContainer)
    videoOffSetContainer: VideoOffSetContainer = null;

    @property(CCInteger)
    maxHeight = 0;

    private hls: Hls = null;
    private native: HTMLVideoElement = null;

    private _videoSource = "";
    private _videoName = "";
    private liveStreamServer = "";
    private _muted = true;
    private _videoDimension = {
        width: 0,
        height: 0,
        top: 0,
    };

    private _onPlayStateChanged: (isPlay: boolean) => void = null;

    private onTimeUpdateRef: () => void = null;
    private onEndedRef: () => void = null;

    private get initialized() {
        return !!this.native && !!this.hls;
    }

    currentTime = 0;

    init(liveStreamServer: string, callbackAfterPlay: (isPlay: boolean) => void) {
        this.liveStreamServer = liveStreamServer;
        this._onPlayStateChanged = callbackAfterPlay;
    }

    loadVideoByName(videoName: string): boolean {
        if (!videoName?.trim() || !this.liveStreamServer) {
            return false;
        }

        if (this._videoName !== videoName || !this.initialized) {
            this._videoName = videoName;
            this._videoSource = new URL(videoName, this.liveStreamServer).toString();
            this.loadSource();
            this._onPlayStateChanged(false);
        }

        return true;
    }

    playVideoByName(videoName: string, callback: (isPlay: boolean) => void) {
        if (this.loadVideoByName(videoName)) {
            this.currentTime = 0; // fix problem of playing more than second time
            this.play();
            callback(true);
        } else {
            callback(false);
        }
    }

    resetAllSettings() {
        this._videoSource = "";
        this._videoName = "";
    }

    get bandwidthEstimate() {
        return this.hls?.bandwidthEstimate ?? 0;
    }

    setNativeMuted() {
        if (this.native) {
            this.native.muted = this._muted;
        }
    }

    loadSource() {
        if (!this.initialized) {
            this.initialize();
        }
        this.hls.loadSource(this._videoSource);
        this.pause();
    }

    play(retry = 0, maxRetry = 3) {
        // Fix for iOS 17, video element is not playing immediately
        this.native
            .play()
            .then(() => {
                this._onPlayStateChanged(true);
            })
            .catch(() => {
                if (retry < maxRetry) {
                    this.play(retry + 1, maxRetry);
                }
            });
    }

    pause() {
        if (this.initialized) {
            this.native.pause();
        }
    }

    set muted(value: boolean) {
        this._muted = value;
    }

    get level() {
        return this.hls?.currentLevel ?? 0;
    }

    protected lateUpdate(dt: number): void {
        this.currentTime += dt;
    }

    onLoad() {
        this.videoOffSetContainer.node.on(SYNC_VIDEO_DIMENSION_EVENT, this.updateVideoDimension, this);

        this.initialize();
    }

    protected onDestroy(): void {
        this.stop();
    }

    stop() {
        if (this.initialized) {
            if (this.onTimeUpdateRef) {
                this.native.removeEventListener("timeupdate", this.onTimeUpdateRef);
                this.onTimeUpdateRef = null;
            }
            if (this.onEndedRef) {
                this.native.removeEventListener("ended", this.onEndedRef);
                this.onEndedRef = null;
            }

            this.hls.off(Hls.Events.ERROR);
            this.hls.detachMedia();
            this.hls.destroy();
        }
    }

    private updateVideoDimension(value: { width: number; height: number; top: number }) {
        this._videoDimension = value;
        value?.top >= 0 && DOMBackgroundVideo.updateVideoDimension(value);
    }

    private syncCurrentTime() {
        this.node.emit("syncNativeCurrentTime", this.native.currentTime);

        const needSync = this.currentTime >= 0 && Math.abs(this.currentTime - this.native.currentTime) > 1;

        if (this.initialized && needSync) {
            this.native.currentTime = this.currentTime;
        }
    }

    skipToTime(time: number) {
        if (this.native && this.native.duration) {
            this.currentTime = this.native.duration - time;
            this.native.currentTime = this.native.duration - time;
        }
    }

    private initialize() {
        DOMBackgroundVideo.setMaxHeight(this.maxHeight);
        const video = DOMBackgroundVideo.createOrLoadVideoElement();

        if (!Hls.isSupported()) {
            this.node.emit("hlsNotSupported");
            throw new Error("Hls.js is not supported.");
        }

        const hls = new Hls({
            startLevel: -1,
            capLevelToPlayerSize: true,
            lowLatencyMode: true,
            liveSyncDuration: 0.9,
            liveMaxLatencyDuration: 1,
            // maxBufferSize: 2 * 1000_000, // MB
            // maxBufferLength: 1, // in seconds
            // maxMaxBufferLength: 3, // in seconds
        });

        this.onTimeUpdateRef = this.syncCurrentTime.bind(this);
        video.addEventListener("timeupdate", this.onTimeUpdateRef);
        this.onEndedRef = this.handleVideoEnded.bind(this);
        video.addEventListener("ended", this.onEndedRef);
        hls.attachMedia(video);

        hls.on(Hls.Events.LEVEL_SWITCHED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.MANIFEST_LOADING, this.node.emit.bind(this.node));
        hls.on(Hls.Events.MANIFEST_PARSED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.FRAG_BUFFERED, this.node.emit.bind(this.node));
        hls.on(Hls.Events.FRAG_CHANGED, this.node.emit.bind(this.node));

        hls.on(Hls.Events.ERROR, (event, data) => {
            this.node.emit(event, {
                ...data,
                video: this._videoName,
                server: this.liveStreamServer,
                bandwidth: this.bandwidthEstimate,
            });
            this.syncCurrentTime();
        });

        this.hls = hls;
        this.native = video;

        this._videoDimension?.top >= 0 && DOMBackgroundVideo.updateVideoDimension(this._videoDimension);
    }

    private handleVideoEnded() {
        this.node.emit(VIDEO_ENDED_EVENT);
    }
}
