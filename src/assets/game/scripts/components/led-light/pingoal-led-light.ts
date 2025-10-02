import { _decorator } from 'cc';
import gc from "@sg/game-client-base";
import Observer from "observer";
import { LedLight } from 'db://shared-components/game/led-light/scripts/components/led-light';
import { SingleGameRoundTimeStore, SINGLE_GAME_ROUND_STATE } from 'db://shared-single-player-game/scripts/core/rounds/single-game-round-time-store';

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass('PingoalLedLight')
export class PingoalLedLight extends LedLight {    
    protected pendingRounds: gc.RoundHistories.RoundHistory[] = null;
    protected isPlayingVideo = false;

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    public setLedLightInfo(rounds: gc.RoundHistories.RoundHistory[]) {
        this.pendingRounds = [...rounds];
        
        // Update immediately if not playing video
        if (!this.isPlayingVideo) {
            this.applyUpdate();
        }
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    public handleRoundStateChange(roundState: string) {
        this.isPlayingVideo = (roundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO);
        
        // Apply pending update when leaving PLAYING_VIDEO state
        if (!this.isPlayingVideo && this.pendingRounds) {
            this.applyUpdate();
        }
    }

    private applyUpdate() {
        if (this.pendingRounds) {
            this.rounds = this.pendingRounds;
            this.updateLedLightItemInfo(this.rounds, this.stepStart);
        }
    }
}

