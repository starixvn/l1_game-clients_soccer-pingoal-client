import Observer from "observer";

import { _decorator, Button } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import {
    SingleGameBetHandler,
    SingleGameChipHandlers, 
    SingleGameChipStore
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

    @render(gc.Bet.BetStore, (store) => store.isProcessingBet)
    handleProcessingBet(isProcessingBet: boolean) {
        if (isProcessingBet) {
            this.disableStartButton()
        }
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    handleReceivedBet(bet: any) {
        this.disableStartButton()
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
