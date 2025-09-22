import Observer from "observer";

import { _decorator } from 'cc';
import { ObserverComponent } from 'db://shared-components/shared/common-components/observer-component/scripts/observer-component';
import { TunnelsBallsStoreType, TunnelsHandlers } from '../../handlers';
import { TUNNEL_COUNT } from "./draggable-round-ball";
const { ccclass, property } = _decorator;

const { render, handle } = Observer;

@ccclass('RandomBallsButton')
export class RandomBallsButton extends ObserverComponent {
    private isColdDown = false;

    @handle(TunnelsHandlers, (handler, payload: TunnelsBallsStoreType) => handler.handle(payload))
    handleRandomBalls() {
        if (this.isColdDown) {
            return null;
        }
        this.isColdDown = true;
        setTimeout(() => {
            this.isColdDown = false;
        }, 800);

        const redBallRandomTunnel = this.getRenderTunnel()
        let blueBallRandomTunnel = this.getRenderTunnel()
        while (redBallRandomTunnel === blueBallRandomTunnel) {
            blueBallRandomTunnel = this.getRenderTunnel()
        }

        return {
            redTunnel: redBallRandomTunnel,
            blueTunnel: blueBallRandomTunnel,
        }
    }

    private getRenderTunnel() {
        return Math.floor(Math.random() * TUNNEL_COUNT) + 1;
    }

}

