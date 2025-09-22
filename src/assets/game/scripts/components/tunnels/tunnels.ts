import Observer from "observer";

import { _decorator, UIOpacity, tween, v3 } from "cc";
import gc from "@sg/game-client-base";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TunnelsBallsStoreType, TunnelsHandlers } from "../../handlers";
import { TunnelsStore } from "../../stores";
import DraggableRoundBall, { BallType, DEFAULT_TUNNEL_NUMBER } from "./draggable-round-ball";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass("tunnels")
export class Tunnels extends ObserverComponent {
    uiOpacity: UIOpacity;
    
    private redBall: DraggableRoundBall = null;
    private blueBall: DraggableRoundBall = null;
    private currentPosition: TunnelsBallsStoreType = {
        redTunnel: DEFAULT_TUNNEL_NUMBER[BallType.RED],
        blueTunnel: DEFAULT_TUNNEL_NUMBER[BallType.BLUE],
    };

    onLoad() {
        super.onLoad();

        this.uiOpacity = this.node.getComponent(UIOpacity);
    }

    start() {
        this.findBalls();
        this.setupBallsCallbacks();
    }

    private findBalls() {
        this.node.getComponentsInChildren(DraggableRoundBall).forEach((ballComponent) => {
            if (ballComponent.ballType === BallType.RED) {
                this.redBall = ballComponent;
            } else if (ballComponent.ballType === BallType.BLUE) {
                this.blueBall = ballComponent;
            }
        });
    }

    private setupBallsCallbacks() {
        this.setupBallCallback(this.redBall, BallType.RED);
        this.setupBallCallback(this.blueBall, BallType.BLUE);
    }

    private setupBallCallback(ball: DraggableRoundBall, ballType: BallType) {
        if (!ball) {
            return;
        }

        ball.touchCallback = {
            start: () => { },
            move: () => { },
            end: () => this.updateBallsTunnel(ballType)
        };
    }

    @handle(TunnelsHandlers, (handler, payload: TunnelsBallsStoreType) => handler.handle(payload))
    private updateBallsTunnel(ballType: BallType) {
        const ball = this.getBallNode(ballType);
        const tunnelName = this.getTunnelName(ballType);
        const anotherTunnelName = this.getTunnelName(ballType === BallType.RED ? BallType.BLUE : BallType.RED)

        const positionUpdate = ball.moveToEdge();
        const storeData: TunnelsBallsStoreType = {
            [tunnelName]: positionUpdate
        }

        // handle ball in same tunnel
        if (positionUpdate === this.currentPosition[anotherTunnelName]) {
            const anotherBall = this.getBallNode(ballType === BallType.RED ? BallType.BLUE : BallType.RED);
            const anotherBallNewTunnel = this.currentPosition[this.getTunnelName(ballType)];
            anotherBall.moveToTargetTunnel(anotherBallNewTunnel);
            storeData[anotherTunnelName] = anotherBallNewTunnel;
            this.currentPosition = { ...this.currentPosition, [anotherTunnelName]: anotherBallNewTunnel };
        }

        this.currentPosition = { ...this.currentPosition, [tunnelName]: positionUpdate };
        return storeData
    }

    @render(TunnelsStore, (store) => store.position)
    renderBallsPosition(position: TunnelsBallsStoreType) {
        return position;
    }


    private getBallNode(ballType: BallType) {
        return ballType === BallType.RED ? this.redBall : this.blueBall;
    }

    private getTunnelName(ballType: BallType) {
        return ballType === BallType.RED ? "redTunnel" : "blueTunnel";
    }

    @render(gc.Bet.BetStore, (store) => store.lastReceivedBet, { fireImmediately: false })
    handleReceivedBet(bet: any) {
        this.scaleInAnimation();
    }

    scaleInAnimation() {
        this.uiOpacity.opacity = 255;
        tween(this.uiOpacity).to(1.2, { opacity: 0 }, { easing: 'quadInOut' }).start();
        tween(this.node).to(0.7, { scale: v3(0.7, 0.7), position: v3(18, 425.587) },  { easing: 'quadInOut' }).start();
    }

    resetAnimation() {
        this.uiOpacity.opacity = 255;
        this.node.setScale(v3(1, 1));
        this.node.setPosition(v3(0, 230.202));
    }
}
