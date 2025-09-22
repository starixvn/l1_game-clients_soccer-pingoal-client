import Observer from "observer";

import { _decorator, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TunnelsBallsStoreType, TunnelsHandlers } from "../../handlers";
import { TunnelsStore } from "../../stores";
import DraggableRoundBall, { BallType, DEFAULT_TUNNEL_NUMBER } from "./draggable-round-ball";
const { ccclass } = _decorator;
import { AnimationUtils } from "db://shared-components/shared/utils";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";

const { observer, render, handle } = Observer;

@ccclass("tunnels")
export class Tunnels extends ObserverComponent {
    private redBall: DraggableRoundBall = null;
    private blueBall: DraggableRoundBall = null;
    private currentPosition: TunnelsBallsStoreType = {
        redTunnel: DEFAULT_TUNNEL_NUMBER[BallType.RED],
        blueTunnel: DEFAULT_TUNNEL_NUMBER[BallType.BLUE],
    };

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
            start: () => {},
            move: () => {},
            end: () => this.updateBallsTunnel(ballType),
        };
    }

    @handle(TunnelsHandlers, (handler, payload: TunnelsBallsStoreType) => handler.handle(payload))
    private updateBallsTunnel(ballType: BallType) {
        const ball = this.getBallNode(ballType);
        const tunnelName = this.getTunnelName(ballType);
        const anotherTunnelName = this.getTunnelName(ballType === BallType.RED ? BallType.BLUE : BallType.RED);

        const positionUpdate = ball.moveToEdge();
        const storeData: TunnelsBallsStoreType = {
            [tunnelName]: positionUpdate,
        };

        // handle ball in same tunnel
        if (positionUpdate === this.currentPosition[anotherTunnelName]) {
            const anotherBall = this.getBallNode(ballType === BallType.RED ? BallType.BLUE : BallType.RED);
            const anotherBallNewTunnel = this.currentPosition[this.getTunnelName(ballType)];
            anotherBall.moveToTargetTunnel(anotherBallNewTunnel);
            storeData[anotherTunnelName] = anotherBallNewTunnel;
        }

        return storeData
    }

    @render(TunnelsStore, (store) => store.position)
    renderBallsPosition(position: TunnelsBallsStoreType) {
        if(this.getBallNode(BallType.RED)) {
            this.getBallNode(BallType.RED).moveToTargetTunnel(position.redTunnel);
        }
        if(this.getBallNode(BallType.BLUE)) {
            this.getBallNode(BallType.BLUE).moveToTargetTunnel(position.blueTunnel);
        }

        return position;
    }

    @render(TunnelsStore, (store) => store.position)
    renderCurrentPosition(position: TunnelsBallsStoreType) {
        this.currentPosition = position;
        return position;
    }

    @render(gc.Bet.BetStore, (store) => store.isProcessingBet)
    handleBallsDraggable(isProcessingBet: boolean) {
        if(this.redBall) {
            this.redBall.setDraggable(!isProcessingBet);
        }
        if(this.blueBall) {
            this.blueBall.setDraggable(!isProcessingBet);
        }
    }

    private getBallNode(ballType: BallType) {
        return ballType === BallType.RED ? this.redBall : this.blueBall;
    }

    private getTunnelName(ballType: BallType) {
        return ballType === BallType.RED ? "redTunnel" : "blueTunnel";
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState, { fireImmediately: false })
    renderRoundState(roundState: any) {
        if (roundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO) {
            this.fadeOutAnimation()
        } else if (roundState === SINGLE_GAME_ROUND_STATE.PLACING_BET) {
            this.fadeInAnimation()
        }
    }

    fadeOutAnimation() {
        AnimationUtils.fadeOut(this.node, 1.2);
        AnimationUtils.movingNode(this.node, 0.7, v3(18, 425.587));
        AnimationUtils.scaleTransition(this.node, [{ scale: v3(0.7, 0.7), duration: 0.7, easing: "quadInOut" }]);
    }

    fadeInAnimation() {
        this.node.setScale(v3(1, 1));
        this.node.setPosition(v3(0, 230.202));
        AnimationUtils.fadeIn(this.node, 0.5);
    }
}
