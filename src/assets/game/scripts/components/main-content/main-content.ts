import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";
import { VideoStreamHandlers } from "../../handlers/video-stream/video-stream-handlers";

const { ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass("MainContent")
export default class MainContent extends ObserverComponent {
    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    renderRoundState(roundState: any) {
        if (roundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO) {
            this.fadeOutAnimation();
        } else if (roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET) {
            this.resetVideoStream();
            this.fadeInAnimation();
        }
    }

    fadeOutAnimation() {
        AnimationUtils.fadeOut(this.node, 0.5);
    }

    fadeInAnimation() {
        AnimationUtils.fadeIn(this.node, 0.5);
    }

    @handle(VideoStreamHandlers, (handler) => handler.resetForNewRound())
    private resetVideoStream() {}
}
