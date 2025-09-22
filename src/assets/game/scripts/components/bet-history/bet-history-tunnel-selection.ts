import gc from "@sg/game-client-base";
import { _decorator, Label } from 'cc';
import { BaseResultBodyItem } from 'db://shared-components/game/bet-history/scripts/components/bet-history-body-item';
const { ccclass, property } = _decorator;

@ccclass('BetHistoryTunnelSelection')
export class BetHistoryTunnelSelection extends BaseResultBodyItem {
    @property(Label)
    lblTunnelSelectionRed: Label = null;
 
    @property(Label)
    lblTunnelSelectionBlue: Label = null;
 
    setData(result: gc.BetHistory.DynamicObject<any>, settlementResult: gc.BetHistory.DynamicObject<any>) {
        if (this.lblTunnelSelectionRed && result.redTunnel !== undefined) {
            this.lblTunnelSelectionRed.string = result.redTunnel.toString();
        }
        
        if (this.lblTunnelSelectionBlue && result.blueTunnel !== undefined) {
            this.lblTunnelSelectionBlue.string = result.blueTunnel.toString();
        }
    }
}

