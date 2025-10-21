import { _decorator } from "cc";
import Observer from "observer";
import { BalanceEffectStore, TUpdateBalance } from "db://shared-components/game/balance-effect/scripts/stores/balance-effect-store";
import { PingoalPlayerBalanceEffectBase } from "./pingoal-player-balance-effect-base";

const { ccclass } = _decorator;
const { render } = Observer;

@ccclass()
export class PingoalPlayerIncreaseBalanceEffect extends PingoalPlayerBalanceEffectBase {

    @render(BalanceEffectStore, (store) => store.increaseBalanceMainPlayer, { fireImmediately: false })
    increaseBalanceMainPlayer(balanceWhenMainPlayerPayout: TUpdateBalance) {
        this.updateBalanceWhenPlayerBet(balanceWhenMainPlayerPayout?.balanceEffect);
    }
}
