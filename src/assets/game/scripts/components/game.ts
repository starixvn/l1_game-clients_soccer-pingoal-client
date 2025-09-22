import Observer from "observer";

import { _decorator, Label, Node } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions } from "../container-options";
import { settings } from "../game-settings";
import "./../../../resources/i18n";
import { BackgroundVideoPlayer } from "./video-stream/background-video-player";
import { DOMBackgroundImage } from "./video-stream/dom-background-image";
import { SystemIndicator } from "./video-stream/system-indicator";

startGame(settings.name, containerOptions, siteConfigs, settings.tolgeeNamespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, visible: false, override: true })
    lblRoundId: Label = null;

    @property({ type: Label, visible: false, override: true })
    lblMinBet: Label = null;

    @property({ type: Label, visible: false, override: true })
    lblMaxBet: Label = null;

    @property(Node)
    private readonly nodeSystemIndicator: Node = null;

    @property(BackgroundVideoPlayer)
    private readonly backgroundVideoPlayer: BackgroundVideoPlayer = null;

    namespace = settings.name;

    private _systemIndicator: SystemIndicator = null;

    get systemIndicator() {
        if (!this._systemIndicator) {
            this._systemIndicator = this.nodeSystemIndicator.getComponentInChildren(SystemIndicator);
        }
        return this._systemIndicator;
    }

    override onHideGame() {
        this.backgroundVideoPlayer.stop();
    }

    protected onEnable(): void {
        DOMBackgroundImage.createBackgroundImageElement();
    }
}
