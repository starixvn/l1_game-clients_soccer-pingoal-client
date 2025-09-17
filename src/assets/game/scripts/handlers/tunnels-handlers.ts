import gc from "@sg/game-client-base";
import inversify from "inversify";
import { TunnelsStore } from "../stores/tunnels-store";

const { injectable, inject } = inversify;

@injectable()
export class TunnelsHandlers implements gc.Shared.IHandler<string> {
    constructor() {}
    @inject(TunnelsStore) protected readonly store: TunnelsStore;

    handle(state: string) {
        this.store.position = state;
    }
}
