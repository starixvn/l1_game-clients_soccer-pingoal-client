import Observer from "observer";

import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
const { ccclass } = _decorator;
import { AnimationUtils } from "db://shared-components/shared/utils";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
import inversify from "inversify";

const { inject } = inversify;

const { render, handle } = Observer;

@ccclass("game-result")
export class GameResult extends ObserverComponent {
    @inject(SingleGameRoundTimeStore) private readonly singleGameRoundTimeStore: SingleGameRoundTimeStore;

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    async handleShowResult(roundState: string) {
        if (roundState === SINGLE_GAME_ROUND_STATE.SHOW_RESULT) {
            await this.showResult();

            // this.singleGameRoundTimeStore.roundState = SINGLE_GAME_ROUND_STATE.PLACING_BET;
        }
    }

    async showResult() {
        await AnimationUtils.fadeIn(this.node, 0.5);
        await AnimationUtils.delayTime(3);
        await AnimationUtils.fadeOut(this.node, 0.5);
    }
}
