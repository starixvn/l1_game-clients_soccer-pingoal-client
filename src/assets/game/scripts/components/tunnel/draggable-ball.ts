import { _decorator, Enum, tween, v3 } from "cc";
import SafeDraggableItem from "db://shared-components/shared/common-components/draggable/safe-draggable-item";
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


const DEFAULT_TUNNEL_NUMBER: Record<BallType, TunnelNumber> = {
    [BallType.BLUE]: TunnelNumber.FIRST,
    [BallType.RED]: TunnelNumber.SIXTH,
}

Enum(BallType);
Enum(TunnelNumber);

@ccclass
export default class DraggableBall extends SafeDraggableItem {
    @property({ type: BallType })
    ballType: BallType = BallType.BLUE;

    private tunnelNumber: TunnelNumber = TunnelNumber.FIRST;

    onLoad(): void {
        super.onLoad();

    }

    start(): void {
        this.setDefaultPosition();
    }

    setDefaultPosition(): void {
        this.tunnelNumber = DEFAULT_TUNNEL_NUMBER[this.ballType];
        this.node.setPosition(TUNNEL_X_POSITIONS[this.tunnelNumber], this.node.y);
    }


    moveToEdge() {
        super.moveToEdge();
        const transform = ComponentUtils.getTransform(this.node.parent);
        const height = transform.height;
        const size = this.getCurrentSize();
        const maxY = height / 2 - size.y / 2;

        let posY: number;
        posY = this.node.y < 0 ? -maxY : maxY;
        posY = Math.min(maxY - this.fixTopPadding, posY);

        const { xPosition, tunnelNumber } = this.getNearestTunnel();
        this.tunnelNumber = tunnelNumber;

        tween(this.node)
            .to(0.3, { position: v3(xPosition, posY) }, { easing: "sineOut" })
            .start();

        console.log(`${this.ballType} is dropped in tunnel: ${tunnelNumber}`);
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

}
