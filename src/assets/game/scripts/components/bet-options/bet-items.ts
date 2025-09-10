import { _decorator } from "cc";
import { BetItemsPolygon as BetItemsPolygonBase } from "db://shared-components/game/bets/scripts/components/bet-items-polygon";
import observer from "observer";

const { ccclass, property } = _decorator;
const { render } = observer;

@ccclass
export class BetItems extends BetItemsPolygonBase {}
