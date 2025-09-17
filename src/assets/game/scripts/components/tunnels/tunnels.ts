import Observer from "observer";

import { _decorator, Event, log } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { TunnelsHandlers } from "../../handlers/tunnels-handlers";
import { TunnelsStore } from "../../stores/tunnels-store";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass("tunnels")
export class Tunnels extends ObserverComponent {
    @handle(TunnelsHandlers, (handler, payload: string) => handler.handle(payload))
    handleClick(event: Event, position: string) {
        log("handleClick", position);
        return position;
    }

    @render(TunnelsStore, (store) => store.position)
    renderTunnels(position: string) {
        log("Tunnel position: ", position);
        return position;
    }
}
