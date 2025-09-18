import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class VideoStreamSoundStore {
    @inject(gc.UserSettings.UserSettingStore) private readonly userSettingStore: gc.UserSettings.UserSettingStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get isPlayBackgroundMusic() {
        return this.userSettingStore.musicEnable;
    }
}
