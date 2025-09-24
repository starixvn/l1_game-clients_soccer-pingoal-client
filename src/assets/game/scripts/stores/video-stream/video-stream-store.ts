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

    resetForNewRound() {
        this._videoResult = {} as any;
    }
}
