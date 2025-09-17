import gc from "@sg/game-client-base";
import { _decorator, log, Node } from "cc";
import { BalanceEffectHandlers } from "db://shared-components/game/balance-effect/scripts/handlers/balance-effect-handlers";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import { SingleGameChipStore } from "db://shared-single-player-game/scripts/core";
import Observer from "observer";

const { Auth, Chips, Settlements, Rounds } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class ChipFlyingCustomize extends ChipFlying {
    @property(Node)
    mainPlayerAvatarNode: Node = null;

    @property({ type: Node, visible: false })
    hiddenPlayersNode: Node = null;

    @property({ type: Node, visible: false })
    dealerChipBox: Node = null;

    @property({ type: Node, visible: false })
    nodeAroundTablePlayers: Node = null;

    @property(Node)
    nodeBetItems: Node = null;

    useFakeChip = false;
    currentChipContainer: Node = null;

    protected enablePlaceChips = true;
    protected payChipsDuration = 1.2;
    protected chipDelayFlyingTime = 1.25;
    protected settlementStatus: gc.GameServiceMessage.Status = null;
    protected aroundTablePlayerChips = [];
    protected isFlyChipSlow = true;
    protected chipStorage = {};
    protected startShowResultAnimation = false;
    protected winningPlayers: gc.GameServiceMessage.TWinningPlayers = {};

    // Chips clear after user switch tab to other tab or reload page
    @render(Chips.ChipStore, (store) => store.chipsByMainPlayerRate)
    override async flyChipsWhenJoinGame(chipsByMainPlayerRate: gc.Chips.TChipsByMainPlayerRate) {}

    @render(SingleGameChipStore, (store) => store.ownChip, { fireImmediately: false })
    flyOwnChip(ownChip: gc.GameServiceMessage.OwnChip) {
        super.flyOwnChip(ownChip);

        log("fly chips to bet item: -------", ownChip);
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSingleChip() {
        return gc.Audios.AudioIds.SINGLE_CHIP;
    }

    // single game not use this function
    @render(Settlements.SettlementStore, (store) => store.settlementResult, { fireImmediately: false })
    override payChipsWhenReceivingSettlementResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {}

    // update balance when receive settlement result status win
    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettleStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
    }

    // need update after show result animation
    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    startNewRound(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetSettlementStatus();
    }

    protected resetSettlementStatus() {
        this.settlementStatus = null;
        this.startShowResultAnimation = false;
    }

    @render(Chips.ChipStore, (store) => store.clearAllChips, { fireImmediately: false })
    clearChipsForAllBetItems() {
        this.chipStorage = {};
        this.currentChipContainer.destroyAllChildren();
    }
}
