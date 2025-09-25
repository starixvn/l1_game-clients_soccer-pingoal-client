import { _decorator, Enum, tween, v3, Node, Vec2, v2, EventTouch, UITransform, CircleCollider2D, CCInteger } from "cc";
import DraggableItem from "db://shared-components/shared/common-components/draggable/draggable-item";
import { ComponentUtils } from "db://shared-components/shared/utils";

const { ccclass, property } = _decorator;

export enum BallType {
    BLUE = "blue",
    RED = "red",
}

export enum TunnelNumber {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
    FIFTH = 5,
    SIXTH = 6,
}

export const TUNNEL_COUNT = 6;

export const DEFAULT_TUNNEL_NUMBER: Record<BallType, TunnelNumber> = {
    [BallType.RED]: TunnelNumber.FIRST,
    [BallType.BLUE]: TunnelNumber.SIXTH,
}

Enum(BallType);
Enum(TunnelNumber);

@ccclass
export default class DraggableRoundBall extends DraggableItem {
    @property({ type: BallType })
    ballType: BallType = BallType.BLUE;

    @property({ type: CCInteger })
    pickupOffset = 0;

    private tunnelNumber: TunnelNumber = TunnelNumber.FIRST;
    private tunnelFirstX = 0;
    private tunnelLastX = 0;
    private tunnelXPositions: Record<TunnelNumber, number> = null;
    private fixedBallPositionY = 0;
    private isEnableDrag = true;

    public touchCallback = {
        start: () => { },
        move: () => { },
        end: () => { },
    };

    start(): void {
        this.node?.parent?.on(Node.EventType.SIZE_CHANGED, this.moveToEdge, this);
        const containerWidth = this.node?.parent?.getComponent(UITransform).width ?? 0;
        const ballWidth = this.node?.getComponent(UITransform).width ?? 0;
        this.tunnelFirstX = this.node?.parent?.position.x - containerWidth / 2 + ballWidth / 2;
        this.tunnelLastX = this.node?.parent?.position.x + containerWidth / 2 - ballWidth / 2;
        this.tunnelXPositions = this.getTunnelPosition();
        this.setDefaultPosition();
    }

    private setDefaultPosition(): void {
        this.tunnelNumber = DEFAULT_TUNNEL_NUMBER[this.ballType];
        this.node.position = v3(this.tunnelXPositions[this.tunnelNumber], this.node.position.y);
    }

    private getCurrentSize(): Vec2 {
        const transform = ComponentUtils.getTransform(this.node);
        return v2(transform.width, transform.height);
    }

    onTouchStart(e: EventTouch) {
        if (!this.isEnableDrag) {
            return;
        }
        const nodePosition = e.getUILocation();
        const local = this.node?.getComponent(UITransform).convertToNodeSpaceAR(v3(nodePosition.x, nodePosition.y, 0));
        const collider = this.getComponent(CircleCollider2D)
        const circleRadius = collider?.radius ?? 0;

        if (local.length() > circleRadius) {
            return;
        }
        super.onTouchStart(e);
        this.node.position = v3(this.node.position.x - this.pickupOffset, this.node.position.y + this.pickupOffset, 0)
        this.fixedBallPositionY = this.node.position.y;
    }

    onTouchMove(e: EventTouch) {
        if (!this.isEnableDrag) {
            return;
        }
        super.onTouchMove(e);
        const restrictX = Math.max(this.tunnelFirstX, Math.min(this.tunnelLastX + this.pickupOffset, this.node.position.x));
        this.node.position = v3(restrictX - this.pickupOffset, this.fixedBallPositionY + this.pickupOffset, 0);
    }

    onTouchEnd(e) {
        super.onTouchEnd(e);
        this.moveToEdge();
    }

    onTouchCancel() {
        super.onTouchCancel();
        this.moveToEdge();
    }

    moveToEdge() {
        const transform = ComponentUtils.getTransform(this.node?.parent);
        const height = transform.height ?? 0;
        const size = this.getCurrentSize();
        const maxY = height / 2 - size.y / 2;

        let posY: number;
        posY = this.node.position.y < 0 ? -maxY : maxY;
        posY = Math.min(maxY, posY);

        const { xPosition, tunnelNumber } = this.getNearestTunnel();
        this.tunnelNumber = tunnelNumber;

        tween(this.node)
            .to(0.3, { position: v3(xPosition, posY) }, { easing: "sineOut" })
            .start();

        return tunnelNumber
    }

    private getNearestTunnel(): { xPosition: number, tunnelNumber: TunnelNumber } {
        const currentX = this.node?.position.x ?? 0;
        let nearestIndex = this.tunnelNumber;
        let minDistance = Math.abs(currentX - this.tunnelXPositions[this.tunnelNumber]);

        for (const tunnel of Object.values(TunnelNumber)) {
            const distance = Math.abs(currentX - this.tunnelXPositions[tunnel]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = tunnel as TunnelNumber;
            }
        }

        return {
            xPosition: this.tunnelXPositions[nearestIndex],
            tunnelNumber: nearestIndex
        }
    }

    private getTunnelPosition() {
        const positions: Record<TunnelNumber, number> = {} as Record<TunnelNumber, number>;
        const step = (this.tunnelLastX - this.tunnelFirstX) / (TUNNEL_COUNT - 1);

        for (let i = 0; i < TUNNEL_COUNT; i++) {
            positions[i + 1 as TunnelNumber] = this.tunnelFirstX + (step * i);
        }

        return positions;
    }

    moveToTargetTunnel(tunnelNumber: TunnelNumber) {
        this.tunnelNumber = tunnelNumber;
        tween(this.node)
            .to(0.3, { position: v3(this.tunnelXPositions[tunnelNumber], this.node.position.y) }, { easing: "sineOut" })
            .start();
    }

    setDraggable(draggable: boolean) {
        this.isEnableDrag = draggable;
    }
}
