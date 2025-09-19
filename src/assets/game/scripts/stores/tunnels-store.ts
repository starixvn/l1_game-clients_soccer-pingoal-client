import inversify from "inversify";
import mobx from "mobx";
import { BallType, DEFAULT_TUNNEL_NUMBER } from "../components/tunnels/draggable-round-ball";
const { injectable, inject } = inversify;

@injectable()
export class TunnelsStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _position = {
        redTunnel: DEFAULT_TUNNEL_NUMBER[BallType.RED],
        blueTunnel: DEFAULT_TUNNEL_NUMBER[BallType.BLUE],
    };

    get position() {
        return this._position;
    }

    set position(value: {}) {
        this._position = {
            ...this._position,
            ...value,
        };
    }
}
