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

type VideoData = {
    videoName: string;
    videoResult: string;
    videoTimeline: number[];
};

@injectable()
export class VideoStreamStore {
    private _videoResult: VideoStream = {} as any;
    private _currentVideo: StreamingVideo = {} as any;
    private _isPlayVideo = false;

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

    get currentVideo(): StreamingVideo {
        return this._currentVideo;
    }

    get isPlayVideo(): boolean {
        return this._isPlayVideo;
    }

    set isPlayVideo(value: boolean) {
        this._isPlayVideo = value;
    }

    resetForNewRound() {
        this._currentVideo = {} as any;
        this._videoResult = {} as any;
    }
}
