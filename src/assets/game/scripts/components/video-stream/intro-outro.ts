import { _decorator, Component, UIOpacity } from "cc";

const { ccclass, property } = _decorator;

@ccclass("IntroOutro")
export class IntroOutro extends Component {
    @property(UIOpacity)
    gameBackground: UIOpacity = null;

    @property(UIOpacity)
    backgroundBlur: UIOpacity = null;

    private readonly maxOpacity = 255;

    set showBackgroundBlur(value: boolean) {
        this.backgroundBlur.node.active = value;
    }

    set showBackgroundGame(value: boolean) {
        this.gameBackground.node.active = value;
    }

    setMaxBackgroundOpacity() {
        this.gameBackground.opacity = this.maxOpacity;
    }
}
