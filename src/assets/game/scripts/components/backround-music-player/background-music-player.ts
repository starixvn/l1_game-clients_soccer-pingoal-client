import gc from "@sg/game-client-base";
import { _decorator, AudioSource, tween } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { VideoStreamSoundStore } from "../../stores";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;
const { Audios } = gc;

@ccclass("BackgroundMusicPlayer")
export class BackgroundMusicPlayer extends ObserverComponent {
    @property(AudioSource)
    musicSource: AudioSource = null;

    @render(VideoStreamSoundStore, (store) => store.isPlayBackgroundMusic)
    changeMusic(playBackgroundMusic: boolean) {
        const videoName = playBackgroundMusic ? "game-music" : "video-music";
        const duration = 1;

        tween(this.musicSource)
            .to(duration, { volume: 0 })
            .call(() => {
                this.musicSource.stop();
                this.playMusic(videoName);
            })
            .to(duration, { volume: 1 })
            .start();
    }

    @handle(Audios.AudioHandler, (handler, id: string) => handler.playMusic(id))
    playMusic(id: string) {
        return id;
    }
}
