import Observer from "observer";

import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import {
    SINGLE_GAME_ROUND_STATE, 
    SingleGameBetHandler,
    SingleGameChipHandlers,
} from "db://shared-single-player-game/scripts/core";
const { ccclass, property } = _decorator;

const { observer, render, handle } = Observer;

@ccclass("actions")
export class Actions extends ObserverComponent {
    @handle(SingleGameBetHandler, (handler) => handler.handleStartBet())
    handleStart() {}

    @handle(SingleGameChipHandlers, (handler) => handler.handleClearAllChips())
    handleClear() {}
}
