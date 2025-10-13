import { _decorator, game, Node, UIOpacity, VideoPlayer } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("BgVideo")
export class BgVideo extends ObserverComponent {
    static readonly VIDEO_ID = "bg-video";
    private _videoElement: HTMLVideoElement = null;

    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null;

    @property(Node)
    bgVideoLoading: Node = null;

    @property(Node)
    bgMainTop: Node = null;

    onLoad(): void {
        super.onLoad();

        game.canvas.addEventListener("touchstart", this.onCanvasTouched.bind(this));
        game.canvas.addEventListener("mousedown", this.onCanvasTouched.bind(this));
    }

    start() {
        const uiOpacity = this.node.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = 255;
        }

        this.bgVideoLoading.active = false;
        this.scheduleOnce(() => {
            this.updateVideoElement();
        }, 0.1);
    }

    lateUpdate() {
        if (this._videoElement && !this._videoElement.style.transform.includes("translateX")) {
            const transform = this._videoElement.style.transform.split(",");

            transform[transform.length - 2] = " 0";

            this._videoElement.style.transform = `${transform.join(",")} translateX(-50%)`;
        }
    }

    updateVideoElement() {
        const videoElement = document.getElementsByClassName("cocosVideo")[0] as HTMLVideoElement;
        if (videoElement) {
            videoElement.id = BgVideo.VIDEO_ID;
            videoElement.className = BgVideo.VIDEO_ID;
            this._videoElement = videoElement;
            this.applyVideoStyles();
        }
    }

    private applyVideoStyles() {
        this._videoElement.style.visibility = "visible";
        this._videoElement.style.position = "absolute";
        this._videoElement.style.left = "50%";
        this._videoElement.style.zIndex = "10";
    }

    fadeAnimation(direction: "in" | "out"): Promise<void> {
        return new Promise((resolve) => {
            if (!this._videoElement) {
                resolve();
                return;
            }

            this._videoElement.style.transition = `opacity 0.5s ease-${direction}-out`;
            this._videoElement.style.opacity = direction === "in" ? "1" : "0";

            setTimeout(() => {
                resolve();
            }, 0.5 * 1000);
        });
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    async renderRoundState(roundState: string) {
        if (this.bgVideoLoading && this._videoElement && this.videoPlayer) {
            if (roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET) {
                this.bgMainTop.getComponent(UIOpacity).opacity = 255;
                this._videoElement.style.zIndex = "10";
                this.bgVideoLoading.active = false;
                this.videoPlayer.play();
                await this.fadeAnimation("in");
            } else {
                this.bgMainTop.getComponent(UIOpacity).opacity = 0;
                await this.fadeAnimation("out");
                this._videoElement.style.zIndex = "0";
                this.videoPlayer.pause();
            }
        }
    }

    onCanvasTouched() {
        if (!this.videoPlayer?.isPlaying) {
            this.videoPlayer?.play();
        }
    }
}
