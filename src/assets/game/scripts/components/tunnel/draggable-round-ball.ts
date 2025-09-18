import { _decorator, Enum, tween, v3, Node, Vec2, v2, EventTouch, UITransform, Vec3, CircleCollider2D } from "cc";
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

const TUNNEL_POSITIONS = {
    FIRST_X: -255,
    LAST_X: 255,
    TUNNEL_COUNT: 6
}

const getTunnelPosition = (): Record<TunnelNumber, number> => {
    const positions: Record<TunnelNumber, number> = {} as Record<TunnelNumber, number>;
    const step = (TUNNEL_POSITIONS.LAST_X - TUNNEL_POSITIONS.FIRST_X) / (TUNNEL_POSITIONS.TUNNEL_COUNT - 1);

    for (let i = 0; i < TUNNEL_POSITIONS.TUNNEL_COUNT; i++) {
        positions[i + 1 as TunnelNumber] = TUNNEL_POSITIONS.FIRST_X + (step * i);
    }

    return positions;
}

const TUNNEL_X_POSITIONS = getTunnelPosition();

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

    private tunnelNumber: TunnelNumber = TunnelNumber.FIRST;
    // TODO: remove hard value
    // private tunnelXPosition: number = this.node.parent

    public touchCallback = {
        start: () => {},
        move: () => {},
        end: () => {},
    };

    start(): void {
        this.setDefaultPosition();
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.moveToEdge, this);
    }

    setDefaultPosition(): void {
        this.tunnelNumber = DEFAULT_TUNNEL_NUMBER[this.ballType];
        this.node.setPosition(TUNNEL_X_POSITIONS[this.tunnelNumber], this.node.y);
    }

    getCurrentSize(): Vec2 {
        const transform = ComponentUtils.getTransform(this.node);
        return v2(transform.width, transform.height);
    }

    onTouchStart(e: EventTouch) {
        const position = e.getUILocation();
        const local = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(position.x, position.y));
        const collider = this.getComponent(CircleCollider2D)
        const circleRadius = collider.radius

        if(local.length() > circleRadius){
           return;
        }
        super.onTouchStart(e);
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
        const transform = ComponentUtils.getTransform(this.node.parent);
        const height = transform.height;
        const size = this.getCurrentSize();
        const maxY = height / 2 - size.y / 2;

        let posY: number;
        posY = this.node.y < 0 ? -maxY : maxY;
        posY = Math.min(maxY, posY);

        const { xPosition, tunnelNumber } = this.getNearestTunnel();
        this.tunnelNumber = tunnelNumber;

        tween(this.node)
            .to(0.3, { position: v3(xPosition, posY) }, { easing: "sineOut" })
            .start();

        return tunnelNumber
    }

    private getNearestTunnel(): { xPosition: number, tunnelNumber: TunnelNumber } {
        const currentX = this.node.position.x;
        let nearestIndex = this.tunnelNumber;
        let minDistance = Math.abs(currentX - TUNNEL_X_POSITIONS[this.tunnelNumber]);

        for (const tunnel of Object.values(TunnelNumber)) {
            const distance = Math.abs(currentX - TUNNEL_X_POSITIONS[tunnel]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = tunnel as TunnelNumber;
            }
        }

        return {
            xPosition: TUNNEL_X_POSITIONS[nearestIndex],
            tunnelNumber: nearestIndex
        }
    }

    moveToTargetTunnel(tunnelNumber: TunnelNumber) {
        this.tunnelNumber = tunnelNumber;
        tween(this.node)
            .to(0.3, { position: v3(TUNNEL_X_POSITIONS[tunnelNumber], this.node.y) }, { easing: "sineOut" })
            .start();
    }
}
