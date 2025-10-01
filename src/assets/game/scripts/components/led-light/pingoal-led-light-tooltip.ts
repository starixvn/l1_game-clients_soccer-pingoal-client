import { _decorator, Label, SpriteFrame, Node, Sprite } from 'cc';
import { LedLightTooltip } from 'db://shared-components/game/led-light/scripts/components/led-light-tooltip';
import gc from '@sg/game-client-base';
const { ccclass, property } = _decorator;

interface PinGoalResult {
    red?: number;
    blue?: number;
    redTunnel?: number;
    blueTunnel?: number;
    video?: string;
}

interface SettlementResult {
    red?: boolean;
    blue?: boolean;
    draw?: boolean;
}

@ccclass('PingoalLedLightTooltip')
export class PingoalLedLightTooltip extends LedLightTooltip {
    @property(Label)
    settlementResultLabel: Label = null;

    @property(Label)
    resultRedLabel: Label = null;

    @property(Label)
    resultBlueLabel: Label = null;

    @property(Node)
    containerNode: Node = null;

    @property(SpriteFrame)
    resultRedSprite: SpriteFrame = null;

    @property(SpriteFrame)
    resultBlueSprite: SpriteFrame = null;

    @property(SpriteFrame)
    resultDrawSprite: SpriteFrame = null;

    public override setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        if (!ledLightInfo) {
            return;
        }

        this.updateSettlementResult(ledLightInfo.settlementResult);
        this.updateGameResult(ledLightInfo.result);
    }

    private updateSettlementResult(settlementResult: SettlementResult) {
        if (!settlementResult || !this.settlementResultLabel) {
            return;
        }

        const resultText = this.getResultText(settlementResult);
        this.settlementResultLabel.string = resultText;

        const spriteFrame = this.getResultSprite(settlementResult);
        if (this.containerNode && spriteFrame) {
            this.containerNode.getComponent(Sprite).spriteFrame = spriteFrame;
        }
    }

    private updateGameResult(result: unknown) {
        if (!result) {
            return;
        }

        const pinGoalResult = result as PinGoalResult;

        if (this.resultRedLabel && pinGoalResult.red !== undefined) {
            this.resultRedLabel.string = pinGoalResult.red.toString();
        }

        if (this.resultBlueLabel && pinGoalResult.blue !== undefined) {
            this.resultBlueLabel.string = pinGoalResult.blue.toString();
        }
    }

    private getResultSprite(settlementResult: SettlementResult): SpriteFrame | null {
        if (settlementResult.red) {
            return this.resultRedSprite;
        }
        if (settlementResult.blue) {
            return this.resultBlueSprite;
        }
        if (settlementResult.draw) {
            return this.resultDrawSprite;
        }
        return null;
    }

    private getResultText(settlementResult: SettlementResult): string {
        if (settlementResult.red) {
            return gc.Translator.gameTranslate('glossary_red');
        }
        if (settlementResult.blue) {
            return gc.Translator.gameTranslate('glossary_blue');
        }
        if (settlementResult.draw) {
            return gc.Translator.gameTranslate('glossary_draw');
        }
        return '';
    }
}
