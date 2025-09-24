import gc from "@sg/game-client-base";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core";
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
    @inject(SingleGameRoundTimeStore) private readonly singleGameRoundTimeStore: SingleGameRoundTimeStore;

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

    handlePlayVideo() {
        this.singleGameRoundTimeStore.roundState = SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO;
    }

    handleEndVideo() {
        this.singleGameRoundTimeStore.roundState = SINGLE_GAME_ROUND_STATE.SHOW_RESULT;
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
