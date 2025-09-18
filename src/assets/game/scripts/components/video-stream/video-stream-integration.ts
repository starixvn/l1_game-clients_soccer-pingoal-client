import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { VideoStreamHandlers } from "../../handlers";
import { StreamingVideo, VideoStream, VideoStreamStore } from "../../stores";
import { BackgroundVideoPlayer } from "./background-video-player";
import { IntroOutro } from "./intro-outro";
import { NetworkStatus, SystemIndicator } from "./system-indicator";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { sentryLogger } = gc;

const INTRO_SFX = "intro_video";

@ccclass
export default class VideoStreamIntegration extends ObserverComponent {
    @property(BackgroundVideoPlayer)
    backgroundVideoPlayer: BackgroundVideoPlayer = null;

    @property(Node)
    nodeSystemIndicator: Node = null;

    @property(IntroOutro)
    introOutro: IntroOutro = null;

    @property(Prefab)
    warnPrefab: Prefab = null;

    @property(Node)
    warnContainer: Node = null;

    @property(Node)
    backgroundBlur: Node = null;

    private isLiveVideo = false;

    private blockShowFieldWithSyncNativeCurrentTime = false;
    private _systemIndicator: SystemIndicator = null;

    get systemIndicator() {
        if (!this._systemIndicator) {
            this._systemIndicator = this.nodeSystemIndicator.getComponentInChildren(SystemIndicator);
        }
        return this._systemIndicator;
    }

    onLoad(): void {
        this.backgroundVideoPlayer?.node.on("hlsLevelSwitched", this.updateSystemIndicator, this);
        this.backgroundVideoPlayer?.node.on("hlsError", this.updateSystemIndicator, this);
        this.backgroundVideoPlayer?.node.on("hlsError", this.onHLSError, this);
        this.backgroundVideoPlayer?.node.on("hlsManifestLoading", () => this.backgroundBlur && (this.introOutro.showBackgroundBlur = true));
        this.backgroundVideoPlayer?.node.on("syncNativeCurrentTime", (time: number) => {
            if (this.blockShowFieldWithSyncNativeCurrentTime) {
                return;
            }
        });
        this.backgroundVideoPlayer?.node.on("hlsNotSupported", this.onHSLNotSupported, this);
        this.warnContainer?.removeAllChildren();

        super.onLoad();
    }

    protected updateSystemIndicator(data: any) {
        if (typeof data === "object" && data.level !== undefined) {
            // On level changed
            this.systemIndicator.networkStatus = data.level + 2;
        } else {
            // On error, set to disconnected
            this.systemIndicator.networkStatus = NetworkStatus.DISCONNECTED;

            const segmentTime = 3; // second

            this.scheduleOnce(() => {
                this.systemIndicator.networkStatus = this.backgroundVideoPlayer.level + 2;
            }, segmentTime);
        }
    }

    @render(VideoStreamStore, (store) => store.currentVideo)
    renderVideoSource(currentVideo: StreamingVideo) {
        if (currentVideo?.videoName) {
            this.backgroundVideoPlayer.currentTime = currentVideo.time;
            this.backgroundVideoPlayer.playVideoByName(currentVideo.videoName, this.handlePlayVideo);
        }
    }

    @handle(VideoStreamHandlers, (handler, isPlay: boolean) => handler.handlePlayVideo(isPlay))
    private handlePlayVideo(isPlay: boolean) {
        return isPlay;
    }

    @render(VideoStreamStore, (store) => ({
        videoResult: store.videoResult,
    }))
    bufferVideo({ videoResult }: { videoResult: VideoStream }) {
        if (!videoResult) {
            return;
        }

        if (videoResult.video) {
            this.backgroundVideoPlayer.currentTime = 0;
            this.backgroundVideoPlayer.loadVideoByName(videoResult.video);
            return;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    private onStartingRound(isStartRound: boolean) {
        if (isStartRound) {
            this.resetVideoStream();
        }
    }

    @render(VideoStreamStore, (store) => store.liveStreamServer)
    private onLiveStreamServer(liveStreamServer: string) {
        this.backgroundVideoPlayer.init(liveStreamServer, this.handlePlayVideo);
    }

    @handle(gc.Audios.AudioHandler, (handler, id: string) => handler.playSFX(id))
    playSound() {
        return INTRO_SFX;
    }

    @handle(VideoStreamHandlers, (handler) => handler.resetForNewRound())
    private resetVideoStream() {}

    private onHLSError(data: any) {
        if (data?.type === "mediaError") {
            return;
        }

        sentryLogger?.logError(JSON.stringify(data));
    }

    private onHSLNotSupported() {
        if (this.warnContainer?.children?.length > 0 || !this.isLiveVideo) {
            return;
        }

        this.systemIndicator.networkStatus = NetworkStatus.DISCONNECTED;

        const node = instantiate(this?.warnPrefab);
        node && this.warnContainer?.addChild(node);
    }
}
