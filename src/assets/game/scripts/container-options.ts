import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import * as SinglePlayerGame from "db://shared-single-player-game/scripts/core";
import { sharedContainer } from "../../scripts/shared-container";
import { settings } from "./game-settings";
export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);
    },
    features: [SinglePlayerGame, gc.BetDetailsNew, ...gc.defaultFeatures],
};
