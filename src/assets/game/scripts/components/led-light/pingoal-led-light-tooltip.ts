import { _decorator } from 'cc';
import { LedLightTooltip } from 'db://shared-components/game/led-light/scripts/components/led-light-tooltip';
import gc from '@sg/game-client-base';
const { ccclass } = _decorator;

const SETTLEMENT_RESULT_TEXT = {
    RED: "RED",
    BLUE: "BLUE", 
    DRAW: "DRAW"
} as const;

@ccclass('PingoalLedLightTooltip')
export class PingoalLedLightTooltip extends LedLightTooltip {
    public override setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        if (!ledLightInfo) {
            return;
        }

        if (this.roundId) {
            this.roundId.string = `#${ledLightInfo.roundId}`;
        }

        if (this.result && ledLightInfo.settlementResult) {
            const settlementResult = ledLightInfo.settlementResult;
            const resultText = this.getResultText(settlementResult);
            this.result.string = resultText;
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
