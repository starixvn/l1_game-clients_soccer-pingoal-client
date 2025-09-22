import Observer from "observer";

import { _decorator, Button } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameBetHandler,
    SingleGameChipHandlers,
    SingleGameChipStore, SingleGameRoundTimeStore
} from "db://shared-single-player-game/scripts/core";
import gc from "@sg/game-client-base";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass("actions")
export class Actions extends ObserverComponent {
    @property(Button)
    startButton: Button | null = null;

    onLoad(): void {
        super.onLoad();
        
        this.disableStartButton()
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    renderRoundState(roundState: any) {
        if (roundState === SINGLE_GAME_ROUND_STATE.LOCKING_BET) {
            this.disableStartButton()
        }
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    handleStartButtonStateChange(ownChip: gc.GameServiceMessage.OwnChip) {
        const amount = ownChip.amount;
        if (amount > 0) {
            this.enableStartButton()
        } else {
            this.disableStartButton()
        }
    }

    disableStartButton() {
        this.startButton.interactable = false;
    }

    enableStartButton() {
        this.startButton.interactable = true;
    }
    
    @handle(SingleGameBetHandler, (handler) => handler.handleStartBet())
    handleStart() {
        this.playSoundClick()
    }

    @handle(SingleGameChipHandlers, (handler) => handler.handleClearAllChips())
    handleClear() {
        this.playSoundClick()
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
