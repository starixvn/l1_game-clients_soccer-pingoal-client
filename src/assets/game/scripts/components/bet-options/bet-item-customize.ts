import { _decorator, log, Node } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { SingleGameBetHandler, SingleGameChipStore } from "db://shared-single-player-game/scripts/core";
import { SingleGameOwnChip as SingleGameOwnChipType} from "db://shared-single-player-game/scripts/core/chips/single-game-chip-store";
import Observer from "observer";
import gc from "@sg/game-client-base";

const { property, ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class BetItemCustomize extends BetItem {
    @property(Node)
    disabledNode: Node = null;

    override callBet() {
        this.handleBet();
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

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    updateDisabledState(ownChip: SingleGameOwnChipType | null) {
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
