import Observer from "observer";
import { _decorator, Button, Node } from 'cc';
import { ObserverComponent } from 'db://shared-components/shared/common-components/observer-component/scripts/observer-component';
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
import { BackgroundVideoPlayer } from "../video-stream/background-video-player";
const { ccclass, property } = _decorator;

const { render, handle } = Observer;

@ccclass('SkipVideoButton')
export class SkipVideoButton extends ObserverComponent {
    @property(Button)
    skipVideoButton: Button = null;

    @property(Node)
    skipVideoBgNode: Node = null;

    @property(BackgroundVideoPlayer)
    backgroundVideoPlayer: BackgroundVideoPlayer = null;

    start(): void {
        this.skipVideoBgNode.active = false;
    }
    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    renderSkipVideoBg(roundState: any) {
        this.skipVideoButton.node.active = roundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO;
        if(roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET){
            this.skipVideoBgNode.active = false;
        }
    }

    handleSkipVideo() {
        this.backgroundVideoPlayer.skipToTime(1);
        this.skipVideoButton.node.active = false;
    }
}

