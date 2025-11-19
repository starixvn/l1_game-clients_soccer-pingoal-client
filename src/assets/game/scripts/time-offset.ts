import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TimeOffset")
export class TimeOffset extends Component {
   @property(Label)
   label: Label = null;

   start() {
        const offset = -new Date().getTimezoneOffset() / 60;

        // Add +/- sign
        const sign = offset >= 0 ? "+" : "";

        // Display format: GMT+8 / GMT+7
        this.label.string = `(GMT ${sign}${offset})`;
   }
}