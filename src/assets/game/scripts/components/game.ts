import Observer from "observer";

import { _decorator, Label, log, Node } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameRoundTimeHandlers,
    SingleGameRoundTimeStore,
} from "db://shared-single-player-game/scripts/core";
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

    // example update round state
    @handle(SingleGameRoundTimeHandlers, (handler, payload: string) => handler.handle(payload))
    handleStart() {
        return SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO;
    }

    // render some UI based on round state
    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    renderRoundState(state: string) {
        switch (state) {
            case SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO:
                log("Playing video");
                //render video
                break;
            case SINGLE_GAME_ROUND_STATE.SHOW_RESULT:
                log("Showing result");
                //render result
                break;
            case SINGLE_GAME_ROUND_STATE.STOP_GAME_LOOP:
                log("Stopping game loop");
                //render stop game loop
                break;
            case SINGLE_GAME_ROUND_STATE.PLACING_BET:
                log("Placing bet");
                //render placing bet
                break;
            case SINGLE_GAME_ROUND_STATE.LOCKING_BET:
                log("Locking bet");
                //render locking bet
                break;
            case SINGLE_GAME_ROUND_STATE.WAITING:
                log("Waiting");
                //render waiting
                break;
            default:
                log("Other state");
                //render other state
                break;
        }
    }
}
