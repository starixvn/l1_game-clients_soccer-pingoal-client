import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
const { ccclass, property } = _decorator;

@ccclass("BetHistoryResult")
export class BetHistoryResult extends BaseResultBodyItem {
    setData(result: gc.BetHistory.DynamicObject<any>, settlementResult: gc.BetHistory.DynamicObject<any>) {
        // handle here
    }
}
