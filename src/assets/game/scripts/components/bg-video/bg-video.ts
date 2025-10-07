import { _decorator, Node, UIOpacity, VideoPlayer } from 'cc';
import { ObserverComponent } from 'db://shared-components/shared/common-components/observer-component/scripts/observer-component';
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from 'db://shared-single-player-game/scripts/core';
import Observer from "observer";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass('BgVideo')
export class BgVideo extends ObserverComponent {
    static readonly VIDEO_ID = 'bg-video';
    private _videoElement: HTMLVideoElement = null;

    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null;

    @property(Node)
    bgVideoLoading: Node = null;

    @property(Node)
    bgMainTop: Node = null;

    start() {
        const uiOpacity = this.node.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = 255;
        }

        this.bgVideoLoading.active = false;
        this.scheduleOnce(() => {
            this.updateVideoElement();
        }, 0.1)
    }

    updateVideoElement() {
        const videoElement = document.getElementsByClassName("cocosVideo")[0] as HTMLVideoElement;
        if (videoElement) {
            videoElement.id = BgVideo.VIDEO_ID;
            videoElement.className = BgVideo.VIDEO_ID;
            this._videoElement = videoElement;
        }
    }

    fadeAnimation(direction: 'in' | 'out'): Promise<void> {
        return new Promise((resolve) => {
            if (!this._videoElement) {
                resolve();
                return;
            }

            this._videoElement.style.transition = `opacity 0.5s ease-${direction}-out`;
            this._videoElement.style.opacity = direction === 'in' ? '1' : '0';

            setTimeout(() => {
                resolve();
            }, 0.5 * 1000);
        })
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    async renderRoundState(roundState: string) {
        if (this.bgVideoLoading && this._videoElement && this.videoPlayer) {
            if (roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET) {
                this.bgMainTop.getComponent(UIOpacity).opacity = 255;
                this._videoElement.style.zIndex = '10';
                this.bgVideoLoading.active = false;
                this.videoPlayer.play();
                await this.fadeAnimation('in');
            } else {
                this.bgMainTop.getComponent(UIOpacity).opacity = 0;
                await this.fadeAnimation('out');
                this.bgVideoLoading.active = true;
                this._videoElement.style.zIndex = '0';
                this.videoPlayer.pause();
            }
        }
    }
}

