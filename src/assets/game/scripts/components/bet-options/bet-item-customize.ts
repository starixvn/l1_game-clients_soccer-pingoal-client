import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameBetHandler,
    SingleGameChipStore,
    SingleGameRoundTimeStore,
} from "db://shared-single-player-game/scripts/core";
import { SingleGameOwnChip as SingleGameOwnChipType } from "db://shared-single-player-game/scripts/core/chips/single-game-chip-store";
import Observer from "observer";

const { property, ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class BetItemCustomize extends BetItem {
    @property(Node)
    disabledNode: Node = null;

    private _currentRoundState: string = SINGLE_GAME_ROUND_STATE.NONE;
    private _lastBetChoice: string = "";

    private isBettingAllowed(): boolean {
        return this._currentRoundState === SINGLE_GAME_ROUND_STATE.PLACING_BET;
    }

    override callBet() {
        if (this.isBettingAllowed()) {
            this.handleBet();
        }
    }

    // Override parent class renderOwnBet method to prevent external interference
    override renderOwnBet() {}

    @handle(SingleGameBetHandler, (handler, payload: string) => handler.handle(payload))
    handleBet() {
        return this.node.name;
    }

    setDisabledVisibility(status: boolean) {
        this.disabledNode && (this.disabledNode.active = status);
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    renderOwnChip(ownChip: (gc.GameServiceMessage.OwnChip & { totalAmount?: number }) | null) {
        if (!this.lblOwnBet) {
            return;
        }

        const isOwnBet = ownChip?.betChoice === this.node.name;
        const hasAmount = (ownChip?.totalAmount || 0) > 0;

        if (isOwnBet && hasAmount) {
            const amount = ownChip.totalAmount || 0;
            this.lblOwnBet.string = gc.FormatUtils.numberWithCommas(amount);
        } else {
            this.lblOwnBet.string = "";
        }
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: true })
    renderRoundState(roundState: string) {
        this._currentRoundState = roundState;
        this.updateBetItemState();
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    updateState(ownChip: SingleGameOwnChipType | null) {
        if (ownChip?.betChoice) {
            this._lastBetChoice = ownChip.betChoice;
        }
        this.updateBetItemState(ownChip);
    }

    @render(SingleGameChipStore, (store) => store.clearAllChips, { fireImmediately: false })
    handleClearAllChips() {
        this._lastBetChoice = "";
        this.updateBetItemState(null);
    }

    private updateBetItemState(ownChip?: SingleGameOwnChipType | null) {
        if (!this.isBettingAllowed()) {
            this.setDisabledVisibility(true);
            return;
        }

        // 新的回合開始時，WebSocket 會傳來空的 betChoice，這時候需要使用上一次的 betChoice
        const effectiveBetChoice = ownChip?.betChoice || this._lastBetChoice;

        if (!effectiveBetChoice) {
            this.setDisabledVisibility(false);
            return;
        }

        if (effectiveBetChoice === this.node.name) {
            this.setDisabledVisibility(false);
            return;
        }

        this.setDisabledVisibility(true);
    }
}
