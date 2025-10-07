import gc from "@sg/game-client-base";
import inversify from "inversify";
import { TunnelsStore } from "../stores/tunnels-store";
import { TunnelNumber } from "../components/tunnels/draggable-round-ball";

const { injectable, inject } = inversify;

export interface TunnelsBallsStoreType {
    redTunnel?: TunnelNumber;
    blueTunnel?: TunnelNumber;
}

@injectable()
export class TunnelsHandlers implements gc.Shared.IHandler<TunnelsBallsStoreType> {
    constructor() {}
    @inject(TunnelsStore) protected readonly store: TunnelsStore;

    handle(state: TunnelsBallsStoreType) {
        this.store.position = { ...this.store.position, ...state};
    }
}
