import gc from "@sg/game-client-base";
import Observer from "observer";

import { _decorator, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
import { AnimationUtils } from "db://shared-components/shared/utils";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameRoundTimeHandlers,
    SingleGameRoundTimeStore
} from "db://shared-single-player-game/scripts/core";
import inversify from "inversify";
import { ResultScore } from "./result-score";
import Hls from "hls.js";

const { inject } = inversify;

const { render, handle } = Observer;

@ccclass("game-result")
export class GameResult extends ObserverComponent {
    @inject(SingleGameRoundTimeStore) private readonly singleGameRoundTimeStore: SingleGameRoundTimeStore;
    @inject(gc.RoundHistories.RoundHistoryStore) protected readonly roundHistoryStore: gc.RoundHistories.RoundHistoryStore;

    @property(Node)
    blueBallNode: ResultScore = null;

    @property(Node)
    redBallNode: ResultScore = null;

    @property(Node)
    winText: Node = null;

    @property(Node)
    loseText: Node = null;

    @property(Node)
    deviceWarning: Node = null;

    @property(Node)
    bgVideoLoading: Node = null;

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    async handleShowResult(roundState: string) {
        if (roundState === SINGLE_GAME_ROUND_STATE.SHOW_RESULT) {
            await this.showResult();

            this.handleBackToMain()
        }
    }
    
    @handle(SingleGameRoundTimeHandlers, (handler, payload) => handler.handle(payload as string))
    handleBackToMain() {
        return SINGLE_GAME_ROUND_STATE.PLACING_BET
    }

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.getLastRound())
    handleUpdateResult(lastRoundHistory) {
        const blueScore = lastRoundHistory?.result?.blue;
        const redScore = lastRoundHistory?.result?.red;
        const blueResult = lastRoundHistory?.settlementResult?.blue;
        const redResult = lastRoundHistory?.settlementResult?.red;

        if (this.blueBallNode && !!blueScore) {
            const blueBall = this.blueBallNode.getComponent('result-score') as ResultScore;
            blueBall?.setScore(blueScore);
            blueBall?.setShowTrophy(blueResult);
        }
        if (this.redBallNode && !!redScore) {
            const redBall = this.redBallNode.getComponent('result-score') as ResultScore;
            redBall?.setScore(redScore);
            redBall?.setShowTrophy(redResult);
        }
    }

    @render(gc.Settlements.SettlementStatusStore, (store) => store.win)
    handleSettlement(win: boolean) {
        if (this.winText && this.loseText) {
            this.winText.active = win;
            this.loseText.active = !win;
        }
    }

    async showResult() {
        if(!Hls.isSupported()) {
            this.deviceWarning.active = true;
            this.bgVideoLoading.active = true;
        } else {
            this.deviceWarning.active = false;
            this.bgVideoLoading.active = false;
        }
        await AnimationUtils.fadeIn(this.node, 0.5);
        await AnimationUtils.delayTime(3);
        await AnimationUtils.fadeOut(this.node, 0.5);
    }
}
