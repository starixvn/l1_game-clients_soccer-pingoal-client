import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import * as SinglePlayerGame from "db://shared-single-player-game/scripts/core";
import { sharedContainer } from "../../scripts/shared-container";
import { settings } from "./game-settings";
import * as SoccerPinGoal from "./index";
export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings as any);
        container.bind(LogStore).to(LogStore);
        container.bind(SinglePlayerGame.SingleGameRoundTimeStore).to(SinglePlayerGame.SingleGameRoundTimeStore);
        container.bind(gc.Rounds.RoundTimeStore).toService(SinglePlayerGame.SingleGameRoundTimeStore as any);
    },
    features: [SoccerPinGoal, SinglePlayerGame, gc.BetDetailsNew, ...gc.defaultFeatures],
};
