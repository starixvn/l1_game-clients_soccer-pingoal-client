import gc from "@sg/game-client-base";
import inversify from "inversify";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";

const { injectable, inject } = inversify;

class SoccerPingoal {
    static eventName = "SoccerPingoal";
}

@injectable()
export class GameResponseHandlers implements gc.Shared.IMultipleHandlers {
    @inject(SingleGameRoundTimeStore) protected readonly roundTimeStore: SingleGameRoundTimeStore;
    @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore;

    handleGameResponse(response: any) {
        if (response && !response.pnlError) {
            if (this.roundTimeStore.roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET) {
                this.roundTimeStore.roundState = SINGLE_GAME_ROUND_STATE.LOCKING_BET;
            }
        } else if (response?.pnlError) {
            this.betStore.isProcessingBet = false;
            if (this.roundTimeStore.roundState === SINGLE_GAME_ROUND_STATE.LOCKING_BET) {
                this.roundTimeStore.roundState = SINGLE_GAME_ROUND_STATE.PLACING_BET;
            }
        }
    }

    eventHandleList = [
        {
            name: SoccerPingoal.eventName,
            handle: this.handleGameResponse,
        },
    ];
}

