import { _decorator, Node } from 'cc';
import BetHistoryBodyItem from 'db://shared-components/game/bet-history/scripts/components/bet-history-body-item';
import { BetHistoryTunnelSelection } from './bet-history-tunnel-selection';
const { ccclass, property } = _decorator;

@ccclass
export class CustomizeBetHistoryNewBodyItem extends BetHistoryBodyItem {
    @property(Node)
    selectTunnel: Node = null;

    setData(data: any) {
        super.setData(data);
        
        if (this.selectTunnel) {
            const tunnelSelectionComponent = this.selectTunnel.getComponent(BetHistoryTunnelSelection);
            if (tunnelSelectionComponent && data.betHistoryLog) {
                const { result, settlementResult } = data.betHistoryLog;
                tunnelSelectionComponent.setData(result, settlementResult);
            }
        }
    }
}

