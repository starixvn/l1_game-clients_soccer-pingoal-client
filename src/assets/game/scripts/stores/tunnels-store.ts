import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class TunnelsStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    //save color,position,...

    private _position = {};

    get position() {
        return this._position;
    }

    set position(value: {}) {
        this._position = value;
    }
}
