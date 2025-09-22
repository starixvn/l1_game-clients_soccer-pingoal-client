import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;

export type StreamingVideo = {
    videoName: string;
    time: number;
};

export class VideoStream {
    video: string;

    static eventName = "videoResult";
}

@injectable()
export class VideoStreamStore {
    private _videoResult: VideoStream = {} as any;
    private _isPlayVideo = false;
    private _isEndVideo = false;

    liveStreamServer = "";

    constructor() {
        mobx.makeAutoObservable(this);
    }

    set videoResult(source: any) {
        this._videoResult = {
            ...this._videoResult,
            ...source,
        };
    }

    get videoResult(): any {
        return this._videoResult;
    }

    get isPlayVideo(): boolean {
        return this._isPlayVideo;
    }

    set isPlayVideo(value: boolean) {
        this._isPlayVideo = value;
    }

    get isEndVideo(): boolean {
        return this._isEndVideo;
    }

    set isEndVideo(value: boolean) {
        this._isEndVideo = value;
    }

    resetForNewRound() {
        this._videoResult = {} as any;
    }

    updateIsPlayVideo(isPlayVideo: boolean) {
        this._isPlayVideo = isPlayVideo;
        this._isEndVideo = !isPlayVideo;
    }

    updateIsEndVideo(isEndVideo: boolean) {
        this._isEndVideo = isEndVideo;
        this._isPlayVideo = !isEndVideo;
    }
}
