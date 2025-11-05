import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BetItemsPolygon as BetItemsPolygonBase } from "db://shared-components/game/bets/scripts/components/bet-items-polygon";
import observer from "observer";
import { TunnelsStore, tunnelsPosition } from "../../stores/tunnels-store";

const { ccclass } = _decorator;
const { render } = observer;

@ccclass
export class BetItems extends BetItemsPolygonBase {
    private currentTunnelPosition: tunnelsPosition = null;
    private currentRoundOdds: gc.Rounds.RoundOdds = null;

    @render(TunnelsStore, (store) => store.position)
    updateTunnelPosition(position: tunnelsPosition) {
        this.currentTunnelPosition = position;

        if (this.currentRoundOdds) {
            this.renderOdds(this.currentRoundOdds);
        }
    }

    @render(gc.Rounds.RoundStore, (store) => store.roundOdds)
    renderOdds(roundOdds: gc.Rounds.RoundOdds) {
        this.currentRoundOdds = roundOdds;
        const { odds, fractional } = roundOdds;

        if (!this.currentTunnelPosition || !odds || Object.keys(odds).length === 0) {
            return;
        }

        const { redTunnel, blueTunnel } = this.currentTunnelPosition;
        const oddsKey = `r${redTunnel}b${blueTunnel}`;
        const betTypes: Array<'red' | 'blue' | 'draw'> = ['red', 'blue', 'draw'];

        const allOddsExist = betTypes.every((type) => odds[`${oddsKey}_${type}`] !== undefined);
        if (!allOddsExist) {
            return;
        }

        betTypes.forEach((type) => {
            const betItem = this.filterBetItem(type);
            betItem.renderOdd(odds[`${oddsKey}_${type}`], fractional);
        });
    }
}
