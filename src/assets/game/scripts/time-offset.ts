import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TimeOffset")
export class TimeOffset extends Component {
   @property(Label)
   label: Label = null;

   start() {
        const offset = -new Date().getTimezoneOffset() / 60;

        // 加上 +/- 號
        const sign = offset >= 0 ? "+" : "";

        // 顯示格式：GMT+8 / GMT+7
        this.label.string = `(GMT ${sign}${offset})`;
   }
}