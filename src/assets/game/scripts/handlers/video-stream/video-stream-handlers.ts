import gc from "@sg/game-client-base";
import inversify from "inversify";
import { VideoStreamStore } from "../../stores/video-stream/video-stream-store";

const { injectable, inject } = inversify;

class VideoStream {
    video: string;

    static eventName = "finish";
}

class LiveStreamServer {
    static eventName = "liveStreamServer";
}

@injectable()
export class VideoStreamHandlers {
    @inject(VideoStreamStore) private readonly videoStreamStore: VideoStreamStore;

    private isVideoResult(result: unknown): result is { video: string } {
        return !!result && typeof (result as any).video === "string";
    }

    handleVideoStream(finish: gc.GameServiceMessage.Finish | undefined) {
        if (finish?.result && this.isVideoResult(finish.result)) {
            const result = finish.result;
            this.videoStreamStore.videoResult = { video: result?.video };
        }
    }

    handleLiveStreamServer(liveStreamServer: string) {
        this.videoStreamStore.liveStreamServer = liveStreamServer;
    }

    resetForNewRound() {
        this.videoStreamStore.resetForNewRound();
    }

    handlePlayVideo(isPlayVideo: boolean) {
        this.videoStreamStore.updateIsPlayVideo(isPlayVideo);
    }

    handleEndVideo(isEndVideo: boolean) {
        this.videoStreamStore.updateIsEndVideo(isEndVideo);
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
