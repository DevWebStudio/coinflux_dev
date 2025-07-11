import { logs, devLog } from "../../../utils/index.js";

// 🟢 Initialer Aufruf
function initModul(payload) {
    const { globalSettings } = payload;

    const { apiEndpoints } = globalSettings.modulesData;
    devLog (`Funktion für Page "Coins anlegen"`, `info`);

    devLog(`globale Paramter (coin-create):`, `info`, { globalSettings });
    devLog(`Api Endpoints (coin-create):`, `info`, { apiEndpoints });
}

export { initModul };