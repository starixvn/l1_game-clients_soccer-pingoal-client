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

    shouldSoftStart = true;

    @render(VideoStreamSoundStore, (store) => store.audioName)
    change(name: string) {
        if (!name) {
            this.shouldSoftStart = false;
            return;
        }

        const duration = 1;
        const volume = name === "game-music" ? 1 : 0.7;

        if (this.shouldSoftStart) {
            tween(this.musicSource)
                .to(duration, { volume: 0 })
                .call(() => {
                    this.musicSource.stop();
                    this.playMusic(name);
                })
                .to(duration, { volume })
                .start();
        } else {
            this.musicSource.stop();
            this.playMusic(name);
            this.musicSource.volume = volume;
            this.shouldSoftStart = true;
        }
    }

    @handle(Audios.AudioHandler, (handler, id: string) => handler.playMusic(id))
    playMusic(id: string) {
        return id;
    }
}
