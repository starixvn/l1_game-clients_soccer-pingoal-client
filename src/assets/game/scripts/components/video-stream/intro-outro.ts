import { _decorator, Component, UIOpacity } from "cc";

const { ccclass, property } = _decorator;

@ccclass("IntroOutro")
export class IntroOutro extends Component {
    @property(UIOpacity)
    backgroundBlur: UIOpacity = null;

    set showBackgroundBlur(value: boolean) {
        this.backgroundBlur.node.active = value;
    }

    playIntroAnimation() {
        // handle before play video
    }

    playOutroAnimation() {
        // handle after play video
    }
}
