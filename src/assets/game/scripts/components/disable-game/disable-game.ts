import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";

const { ccclass } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class DisableGame extends ObserverComponent {
    roundState = "none";

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    protected renderRoundState(roundState: string) {
        this.roundState = roundState;
    }

    @render(gc.DisabledGame.DisabledGameStore, (store) => store.disabled, { fireImmediately: false })
    protected onGameDisabled(disabled: boolean) {
        if (this.roundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO) {
            // Keep playing video
            return;
        }

        if (disabled) {
            this.showGameDisabledPopup();
        }
    }

    @handle(gc.DisabledGame.DisableGameHandlers, (handler) => handler.showPopupHandle())
    protected showGameDisabledPopup() {}
}
