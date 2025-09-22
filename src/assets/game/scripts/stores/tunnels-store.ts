import inversify from "inversify";
import mobx from "mobx";
import { BallType, DEFAULT_TUNNEL_NUMBER } from "../components/tunnels/draggable-round-ball";
const { injectable } = inversify;
import { TunnelNumber } from "../components/tunnels/draggable-round-ball";

export type tunnelsPosition = {
    redTunnel: TunnelNumber;
    blueTunnel: TunnelNumber;
};

@injectable()
export class TunnelsStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _position: tunnelsPosition = {
        redTunnel: DEFAULT_TUNNEL_NUMBER[BallType.RED],
        blueTunnel: DEFAULT_TUNNEL_NUMBER[BallType.BLUE],
    };

    get position(): tunnelsPosition {
        return this._position;
    }

    set position(value: {}) {
        this._position = {
            ...this._position,
            ...value,
        };
    }
}
