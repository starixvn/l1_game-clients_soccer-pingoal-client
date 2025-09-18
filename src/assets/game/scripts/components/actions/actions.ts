import Observer from "observer";

import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeHandlers, SingleGameChipHandlers, SingleGameChipStore } from "db://shared-single-player-game/scripts/core";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass("actions")
export class Actions extends ObserverComponent {
    @handle(SingleGameRoundTimeHandlers, (handler, payload: string) => handler.handle(payload))
    handleStart() {
        return SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO;
    }

    @handle(SingleGameRoundTimeHandlers, (handler, payload: string) => handler.handle(payload))
    handleClear() {
        return SINGLE_GAME_ROUND_STATE.WAITING;
    }
}
