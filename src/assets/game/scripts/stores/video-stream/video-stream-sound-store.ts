import gc from "@sg/game-client-base";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameRoundTimeStore,
} from "db://shared-single-player-game/scripts/core/rounds/single-game-round-time-store";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class VideoStreamSoundStore {
    @inject(gc.UserSettings.UserSettingStore) private readonly userSettingStore: gc.UserSettings.UserSettingStore;
    @inject(SingleGameRoundTimeStore) private readonly singleGameRoundTimeStore: SingleGameRoundTimeStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get audioName(): string {
        if (!this.userSettingStore.musicEnable) {
            return "";
        }

        return this.singleGameRoundTimeStore.roundState !== SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO ? "game-music" : "video-music";
    }
}
