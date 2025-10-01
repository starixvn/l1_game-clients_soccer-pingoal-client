import { _decorator, Component, Node, screen, UITransform, Vec3, view } from "cc";
import { EDITOR } from "cc/env";
import { AnimationUtils, ComponentUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

export const SYNC_VIDEO_DIMENSION_EVENT = "syncWidthOffset";
export const TOP_OFFSET_DEFAULT = 0;

interface Dimensions {
    width: number;
    height: number;
}

@ccclass("VideoOffSetContainer")
export class VideoOffSetContainer extends Component {
    @property(Node)
    containerNode: Node = null;

    @property(Node)
    targetNode: Node = null;

    @property
    usingReferenceBoundsNode = false;

    @property({
        visible: function (this: VideoOffSetContainer) {
            return this.usingReferenceBoundsNode;
        },
        type: Node,
    })
    referenceBoundsNode: Node = null;

    private readonly lastContainerPosition = new Vec3();

    private readonly onParentSizeChanged = () => {
        this.updateDisplay();
    };

    private toggleSizeChangedListener(enable: boolean) {
        const method = enable ? "on" : "off";
        if (this.node.parent) {
            this.node.parent[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
        if (this.node) {
            this.node[method](Node.EventType.SIZE_CHANGED, this.onParentSizeChanged, this);
        }
    }

    public async onEnable() {
        this.toggleSizeChangedListener(true);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.toggleSizeChangedListener(false);
    }

    public async update(delta: number) {
        if (this.containerNode && !this.containerNode.position.equals(this.lastContainerPosition)) {
            this.updateDisplay();
            this.lastContainerPosition.set(this.containerNode.position);
        }

        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected async updateDisplay() {
        await AnimationUtils.delayTime(300 / 1000);
        const topOffsetAbs = this.calculateTopOffsetAbs();
        const { width: fieldWidth, height: fieldHeight } = this.getReferenceBoundsWorldSize();
        const { width: widthFinal, height: heightFinal } = this.calculateFinalDimensions(fieldWidth, fieldHeight);

        this.node.emit(SYNC_VIDEO_DIMENSION_EVENT, {
            width: widthFinal,
            height: heightFinal,
            top: topOffsetAbs,
        });
    }

    private calculateTopOffsetAbs(): number {
        const position = ComponentUtils.convertPosition(this.containerNode, this.targetNode);
        const topOffset = position.y ?? 0;
        const dpr = screen.devicePixelRatio;
        const currentScreenWidth = screen.windowSize?.width;
        const designScreenWidth = view.getDesignResolutionSize().width;
        const scaleXCanvas = currentScreenWidth / designScreenWidth;
        return Math.max(0, Math.abs(topOffset) * (scaleXCanvas / dpr));
    }

    private getReferenceBoundsWorldSize(): Dimensions {
        const uiTransform = this.referenceBoundsNode?.getComponent(UITransform);
        const boundingBox = uiTransform?.getBoundingBoxToWorld();
        if (boundingBox?.width && boundingBox?.height) {
            return {
                width: boundingBox.width,
                height: boundingBox.height,
            };
        }

        // Fallback to design resolution when no reference node is set
        const designSize = view.getDesignResolutionSize();
        return {
            width: designSize.width,
            height: designSize.height,
        };
    }

    private calculateFinalDimensions(fieldWidth: number, fieldHeight: number): Dimensions {
        const dpr = screen.devicePixelRatio;
        const currentScreenWidth = screen.windowSize?.width;
        const designScreenWidth = view.getDesignResolutionSize().width;
        const scaleXCanvas = currentScreenWidth / designScreenWidth;
        return {
            width: (fieldWidth * scaleXCanvas) / dpr,
            height: (fieldHeight * scaleXCanvas) / dpr,
        };
    }
}
