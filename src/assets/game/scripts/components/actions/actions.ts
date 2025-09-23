import Observer from "observer";

import { _decorator, Button } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameBetHandler,
    SingleGameChipHandlers,
    SingleGameChipStore, SingleGameRoundTimeHandlers,
    SingleGameRoundTimeStore
} from "db://shared-single-player-game/scripts/core";
import gc from "@sg/game-client-base";
import { TunnelsStore } from "db://assets/game/scripts";
import inversify from "inversify";
const { ccclass, property } = _decorator;

const { render, handle } = Observer;
const { inject } = inversify;


@ccclass("actions")
export class Actions extends ObserverComponent {
    @property(Button)
    startButton: Button | null = null;

    private _tunnelsPosition: any = null;

    onLoad(): void {
        super.onLoad();
        
        this.disableStartButton()
    }

    @render(TunnelsStore, (store) => store.position, { fireImmediately: true })
    renderTunnelsPosition(position: any) {
        this._tunnelsPosition = position;
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
    
    @handle(SingleGameBetHandler, (handler, payload) => handler.handleStartBet(payload))
    handleStart() {
        this.handleLockingBet();
        this.playSoundClick();
        
        const { redTunnel, blueTunnel } = this._tunnelsPosition;
        
        return { redTunnel, blueTunnel };
    }

    @handle(SingleGameRoundTimeHandlers, (handler, payload) => handler.handle(payload as string))
    handleLockingBet() {
        return SINGLE_GAME_ROUND_STATE.LOCKING_BET;
    }

    @handle(SingleGameChipHandlers, (handler) => handler.handleClearAllChips())
    handleClear() {
        this.playSoundClick();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
