import { _decorator, Label } from 'cc';
import { LedLightTooltip } from 'db://shared-components/game/led-light/scripts/components/led-light-tooltip';
import gc from '@sg/game-client-base';
const { ccclass, property } = _decorator;

const SETTLEMENT_RESULT_TEXT = {
    RED: "RED",
    BLUE: "BLUE", 
    DRAW: "DRAW"
} as const;

interface PinGoalResult {
    red?: number;
    blue?: number;
    redTunnel?: number;
    blueTunnel?: number;
    video?: string;
}

@ccclass('PingoalLedLightTooltip')
export class PingoalLedLightTooltip extends LedLightTooltip {
    @property(Label)
    settlementResultLabel: Label = null;

    @property(Label)
    resultRedLabel: Label = null;

    @property(Label)
    resultBlueLabel: Label = null;
    
    public override setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        if (!ledLightInfo) {
            return;
        }

        if (this.settlementResultLabel && ledLightInfo.settlementResult) {
            const settlementResult = ledLightInfo.settlementResult;
            const resultText = this.getResultText(settlementResult);
            this.settlementResultLabel.string = resultText;
        }

        if (ledLightInfo.result) {
            const result = ledLightInfo.result as PinGoalResult;
            
            if (this.resultRedLabel && result?.red) {
                this.resultRedLabel.string = result?.red.toString();
            }
            if (this.resultBlueLabel && result?.blue) {
                this.resultBlueLabel.string = result?.blue.toString();
            }
        }

    }

    private getResultText(settlementResult: any): string {
        if (settlementResult?.red) {
            return SETTLEMENT_RESULT_TEXT.RED;
        }
        if (settlementResult?.blue) {
            return SETTLEMENT_RESULT_TEXT.BLUE;
        }
        if (settlementResult?.draw) {
            return SETTLEMENT_RESULT_TEXT.DRAW;
        }
        return "";
    }
}
