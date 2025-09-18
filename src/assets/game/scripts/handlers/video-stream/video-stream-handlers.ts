import inversify from "inversify";
import { VideoStreamStore } from "../../stores/video-stream/video-stream-store";

const { injectable, inject } = inversify;

class VideoStream {
    video: string;

    static eventName = "videoResult";
}

class LiveStreamServer {
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
