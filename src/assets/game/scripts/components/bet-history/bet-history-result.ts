import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;

@ccclass("BetHistoryResult")
export class BetHistoryResult extends BaseResultBodyItem {
    @property(Label)
    lblResultRed: Label = null;

    @property(Label)
    lblResultBlue: Label = null;

    setData(result: gc.BetHistory.DynamicObject<any>, settlementResult: gc.BetHistory.DynamicObject<any>) {
        if (this.lblResultRed && result.red !== undefined) {
            this.lblResultRed.string = result.red.toString();
        }
        
        if (this.lblResultBlue && result.blue !== undefined) {
            this.lblResultBlue.string = result.blue.toString();
        }
    }
}
