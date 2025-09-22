import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { VideoStreamStore } from "./video-stream-store";

const { injectable, inject } = inversify;

@injectable()
export class VideoStreamSoundStore {
    @inject(gc.UserSettings.UserSettingStore) private readonly userSettingStore: gc.UserSettings.UserSettingStore;
    @inject(VideoStreamStore) private readonly videoStreamStore: VideoStreamStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get isPlayBackgroundMusic() {
        return this.userSettingStore.musicEnable && !this.videoStreamStore?.isPlayVideo;
    }
}
