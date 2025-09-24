import { _decorator, CCInteger, Component, screen, Size, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameResizeWindow")
export class GameResizeWindow extends Component {
    @property(CCInteger)
    width = 750;

    @property(CCInteger)
    height = 1334;

    private resizeHandler?: () => void;

    protected onLoad(): void {
        this.adjustResolution();
        this.setupResizeListener();
    }

    onDestroy(): void {
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
            this.resizeHandler = undefined;
        }
    }

    adjustResolution() {
        if (!sys.isMobile) {
            const gameContainer = document.getElementById("Cocos3dGameContainer");
            gameContainer.style.position = "relative";

            // For desktop browsers, use the original logic
            const cssHeight = window.innerHeight;
            const ratioScale = cssHeight / this.height;
            const cssWidth = ratioScale * this.width;

            const dpr = screen?.devicePixelRatio || 1;
            screen.windowSize = new Size(Math.round(cssWidth * dpr), Math.round(cssHeight * dpr));
        }
    }

    private setupResizeListener() {
        this.resizeHandler = this.debounce(() => {
            this.adjustResolution();
        }, 150);
        window.addEventListener("resize", this.resizeHandler);
    }

    // prevent multiple calls
    private debounce(fn: (...args: any[]) => void, wait = 150) {
        let t: number | undefined;
        return (...args: any[]) => {
            if (t) {
                clearTimeout(t);
            }
            t = window.setTimeout(() => fn(...args), wait);
        };
    }
}
