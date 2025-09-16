import Observer from "observer";

import { _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeHandlers } from "db://shared-single-player-game/scripts/core";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";
import "./../../../resources/i18n";

startGame(settings.name, containerOptions, siteConfigs, settings.tolgeeNamespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    namespace = settings.name;

    // example update round state
    @handle(SingleGameRoundTimeHandlers, (handler, payload: string) => handler.handle(payload))
    handleStart() {
        return SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO;
    }
}
