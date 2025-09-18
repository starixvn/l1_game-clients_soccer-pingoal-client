import inversify from "inversify";
import { VideoStreamStore } from "../../stores/video-stream/video-stream-store";

const { injectable, inject } = inversify;

export class VideoStream {
    firstHalfVideo: string;
    secondHalfVideo: string;
    firstHalfTimeline: number[];
    secondHalfTimeline: number[];
    firstHalf: string;
    secondHalf: string;

    static eventName = "videoResult";
}

export class LiveStreamServer {
    static eventName = "liveStreamServer";
}

@injectable()
export class VideoStreamHandlers {
    @inject(VideoStreamStore) private readonly videoStreamStore: VideoStreamStore;

    handleVideoStream(videoResult: any) {
        this.videoStreamStore.videoResult = videoResult;
    }

    handleLiveStreamServer(liveStreamServer: string) {
        this.videoStreamStore.liveStreamServer = liveStreamServer;
    }

    resetForNewRound() {
        this.videoStreamStore.resetForNewRound();
    }

    handlePlayVideo(isPlayVideo: boolean) {
        this.videoStreamStore.isPlayVideo = isPlayVideo;
    }

    eventHandleList = [
        {
            name: VideoStream.eventName,
            handle: this.handleVideoStream,
        },
        {
            name: LiveStreamServer.eventName,
            handle: this.handleLiveStreamServer,
        },
    ];
}
