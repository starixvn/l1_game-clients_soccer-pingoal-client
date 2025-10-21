import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "db://shared-components/game/balance-effect/scripts/stores/balance-effect-store";
import { PingoalPlayerBalanceEffectBase } from "./pingoal-player-balance-effect-base";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class PingoalPlayerDecreaseBalanceEffect extends PingoalPlayerBalanceEffectBase {
    isIncrease = false;

    @render(BalanceEffectStore, (store) => store.decreaseBalanceMainPlayer, { fireImmediately: false })
    decreaseBalanceMainPlayer(balanceWhenMainPlayerBet: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerBet?.balanceEffect);
    }
}
