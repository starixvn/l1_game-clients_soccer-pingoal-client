import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { _decorator, tween, UIOpacity } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";

const { ccclass } = _decorator;
const { observer, render } = Observer;

@ccclass("MainContent")
export default class MainContent extends ObserverComponent {
    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    handleReceivedBet(bet: any) {
        this.hideAnimation();
    }
    
    hideAnimation() {
        AnimationUtils.fadeOut(this.node, 0.5)
    }
    
    showAnimation() {
        AnimationUtils.fadeIn(this.node, 0.5)
    }
}
