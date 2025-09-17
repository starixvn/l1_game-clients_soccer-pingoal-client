import { _decorator, log } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { SingleGameBetHandler } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";

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
}
