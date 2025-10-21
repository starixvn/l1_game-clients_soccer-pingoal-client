import Observer from "observer";
import { _decorator, Button, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameBetHandler,
    SingleGameChipHandlers,
    SingleGameChipStore,
    SingleGameRoundTimeStore
} from "db://shared-single-player-game/scripts/core";
import gc from "@sg/game-client-base";
import { TunnelsStore } from "db://assets/game/scripts";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("actions")
export class Actions extends ObserverComponent {
    @property(Button) clearButton: Button | null = null;
    @property(Button) startButton: Button | null = null;

    private _tunnelsPosition: any = null;
    private _clearDisableNode: Node | null = null;
    private _startDisableNode: Node | null = null;
    private _currentRoundState: any = null;
    private _hasChips = false;

    start() {
        this._clearDisableNode = this.clearButton?.node.getChildByName('disable');
        this._startDisableNode = this.startButton?.node.getChildByName('disable');
        this.updateButtonStates();
    }

    @render(TunnelsStore, (store) => store.position, { fireImmediately: true })
    renderTunnelsPosition(position: any) {
        this._tunnelsPosition = position;
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    renderRoundState(roundState: any) {
        this._currentRoundState = roundState;
        this.updateButtonStates();
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: true })
    renderChipChange(ownChip: gc.GameServiceMessage.OwnChip & { totalAmount?: number }) {
        this._hasChips = (ownChip?.totalAmount ?? 0) > 0;
        this.updateButtonStates();
    }

    private updateButtonStates() {
        this.ensureDisableNodes();
        
        const canEnableClear = this._hasChips;
        const canEnableStart = this._hasChips && this._currentRoundState === SINGLE_GAME_ROUND_STATE.PLACING_BET;
        
        this.setButtonState(this.clearButton, this._clearDisableNode, canEnableClear);
        this.setButtonState(this.startButton, this._startDisableNode, canEnableStart);
    }

    private ensureDisableNodes() {
        if (!this._clearDisableNode && this.clearButton) {
            this._clearDisableNode = this.clearButton.node.getChildByName('disable');
        }
        if (!this._startDisableNode && this.startButton) {
            this._startDisableNode = this.startButton.node.getChildByName('disable');
        }
    }

    private setButtonState(button: Button | null, disableNode: Node | null, enabled: boolean) {
        if (button) {
            button.interactable = enabled;
        }
        if (disableNode) {
            disableNode.active = !enabled;
        }
    }

    @handle(SingleGameBetHandler, (handler, payload) => handler.handleStartBet(payload))
    handleStart() {
        this.playSoundClick();
        // Immediately disable buttons to prevent double-click before server response
        this.setButtonState(this.startButton, this._startDisableNode, false);
        this.setButtonState(this.clearButton, this._clearDisableNode, false);
        return this._tunnelsPosition;
    }

    @handle(SingleGameChipHandlers, (handler) => handler.handleClearAllChips())
    handleClear() {
        this.playSoundClick();
        this.setButtonState(this.clearButton, this._clearDisableNode, false);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
