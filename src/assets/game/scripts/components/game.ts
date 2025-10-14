import "./../../../resources/i18n";

import { _decorator, Label } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";

import { BackgroundVideoPlayer } from "./video-stream/background-video-player";

startGame(settings.name, containerOptions, siteConfigs, settings.tolgeeNamespaces);

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, visible: false, override: true })
    lblRoundId: Label = null;

    @property({ type: Label, visible: false, override: true })
    lblMinBet: Label = null;

    @property({ type: Label, visible: false, override: true })
    lblMaxBet: Label = null;

    @property(BackgroundVideoPlayer)
    private readonly backgroundVideoPlayer: BackgroundVideoPlayer = null;

    namespace = settings.name;

    override onHideGame() {
        this.backgroundVideoPlayer.stop();
    }
}
