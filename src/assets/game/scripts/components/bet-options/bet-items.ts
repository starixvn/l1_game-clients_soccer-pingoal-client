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

    private getPositionOddsKey(choice: string): string | null {
        if (!this.currentTunnelPosition) {
            return null;
        }
        const { redTunnel, blueTunnel } = this.currentTunnelPosition;
        return `R${redTunnel}B${blueTunnel}_${choice}`;
    }

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

        Object.keys(odds).forEach((choice) => {
            if (choice.includes("_")) {
                return;
            }

            const betItem = this.filterBetItem(choice);
            if (!betItem) {
                return;
            }

            const positionKey = this.getPositionOddsKey(choice);
            const oddsValue = positionKey && odds[positionKey] !== undefined ? odds[positionKey] : odds[choice];

            betItem.renderOdd(oddsValue, fractional);
        });
    }
}
