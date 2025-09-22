import Observer from "observer";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { _decorator, tween, UIOpacity } from "cc";

const { ccclass } = _decorator;
const { observer, render } = Observer;

@ccclass("MainContent")
export default class MainContent extends ObserverComponent {
    uiOpacity: UIOpacity;

    onLoad() {
        super.onLoad();
        
        this.uiOpacity = this.node.getComponent(UIOpacity);
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    handleReceivedBet(bet: any) {
        this.hideAnimation();
    }
    
    hideAnimation() {
        this.uiOpacity.opacity = 255;
        tween(this.uiOpacity).to(0.5, { opacity: 0 }).start();
    }
    
    showAnimation() {
        this.uiOpacity.opacity = 0;
        tween(this.uiOpacity).to(0.5, { opacity: 255 }).start();
    }
}
