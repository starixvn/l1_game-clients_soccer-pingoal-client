import Observer from "observer";

import { _decorator, Button } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TunnelsBallsStoreType, TunnelsHandlers } from "../../handlers";
import { TUNNEL_COUNT } from "./draggable-round-ball";
const { ccclass, property } = _decorator;

const { render, handle } = Observer;

@ccclass("RandomBallsButton")
export class RandomBallsButton extends ObserverComponent {
    @property(Button)
    button: Button = null;

    private isEnable = true;

    @handle(TunnelsHandlers, (handler, payload: TunnelsBallsStoreType) => handler.handle(payload))
    handleRandomBalls() {
        if (!this.isEnable) {
            return null;
        }
        this.button.interactable = false;
        setTimeout(() => {
            this.button.interactable = true;
        }, 800);

        const redBallRandomTunnel = this.getRenderTunnel();
        let blueBallRandomTunnel = this.getRenderTunnel();
        while (redBallRandomTunnel === blueBallRandomTunnel) {
            blueBallRandomTunnel = this.getRenderTunnel();
        }

        return {
            redTunnel: redBallRandomTunnel,
            blueTunnel: blueBallRandomTunnel,
        };
    }

    setEnable(enable: boolean) {
        this.isEnable = enable;
    }
    
    // temporary fix for random number generation
    private getRenderTunnel() {
        return Math.floor(Math.random() * TUNNEL_COUNT) + 1; // NOSONAR
    }
}
