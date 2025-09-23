import { _decorator, Color, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('result-score')
export class ResultScore extends Component {

    @property(Label)
    score: Label = null;

    @property(Sprite)
    trophy: Sprite = null;

    setScore(score: number) {
        this.score && (this.score.string = score.toString());
    }

    setShowTrophy(isWin: boolean) {
        this.trophy && (this.trophy.color = isWin ? new Color(255, 255, 255, 255) : new Color(255, 255, 255, 0));
    }
}

