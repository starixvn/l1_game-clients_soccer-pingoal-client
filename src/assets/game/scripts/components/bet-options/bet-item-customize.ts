import { _decorator, log, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { 
    SingleGameBetHandler, 
    SingleGameChipStore, 
    SINGLE_GAME_ROUND_STATE, 
    SingleGameRoundTimeStore 
} from "db://shared-single-player-game/scripts/core";
import { SingleGameOwnChip as SingleGameOwnChipType} from "db://shared-single-player-game/scripts/core/chips/single-game-chip-store";
import Observer from "observer";
import gc from "@sg/game-client-base";

const { property, ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class BetItemCustomize extends BetItem {
    @property(Node)
    disabledNode: Node = null;

    private _currentRoundState: string = SINGLE_GAME_ROUND_STATE.NONE;
    // TODO: Temporary: allow betting during stop state for testing
    private _allowedBettingStates: string[] = [
        SINGLE_GAME_ROUND_STATE.STOP_GAME_LOOP,
        SINGLE_GAME_ROUND_STATE.PLACING_BET,
    ];

    private isBettingAllowed(): boolean {
        return this._allowedBettingStates.includes(this._currentRoundState);
    }

    override callBet() {
        if (this.isBettingAllowed()) {
            this.handleBet();
        }
    }

    // Override parent class renderOwnBet method to prevent external interference
    override renderOwnBet() {
    }

    @handle(SingleGameBetHandler, (handler, payload: string) => handler.handle(payload))
    handleBet() {
        log("handle bet choice: ", this.node.name);
        return this.node.name;
    }

    setDisabledVisibility(status: boolean) {
        this.disabledNode && (this.disabledNode.active = status);
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    renderOwnChip(ownChip: gc.GameServiceMessage.OwnChip & { totalAmount?: number } | null) {
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
    updateDisabledState(ownChip: SingleGameOwnChipType | null) {
        this.updateBetItemState(ownChip);
    }

    private updateBetItemState(ownChip?: SingleGameOwnChipType | null) {
        if (!this.isBettingAllowed()) {
            this.setDisabledVisibility(true);
            return;
        }

        if (!ownChip) {
            this.setDisabledVisibility(false);
            return;
        }

        const currentBetChoice = ownChip.betChoice;
        
        if (currentBetChoice === this.node.name) {
            this.setDisabledVisibility(false);
            return;
        }
        
        if (currentBetChoice && currentBetChoice !== this.node.name) {
            this.setDisabledVisibility(true);
            return;
        }

        this.setDisabledVisibility(false);
    }
}
