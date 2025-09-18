import { _decorator, log } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { SingleGameBetHandler, SingleGameChipStore } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";
import gc from "@sg/game-client-base";

const { property, ccclass } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class BetItemCustomize extends BetItem {
    override callBet() {
        this.handleBet();
    }

    @handle(SingleGameBetHandler, (handler, payload: string) => handler.handle(payload))
    handleBet() {
        log("handle bet choice: ", this.node.name);
        return this.node.name;
    }

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    renderOwnChip(ownChip: gc.GameServiceMessage.OwnChip & { totalAmount?: number } | null) {
        if (!this.lblOwnBet) return;
        
        const isOwnBet = ownChip?.betChoice === this.node.name;
        const hasAmount = (ownChip?.totalAmount || 0) > 0;
        
        if (isOwnBet && hasAmount) {
            const amount = ownChip.totalAmount || 0;
            this.lblOwnBet.string = gc.FormatUtils.numberWithCommas(amount);
        } else {
            this.lblOwnBet.string = "";
        }
    }
}
