import { devLog, logs } from '../../utils/index.js';
import { getConfigData } from "../../data/utils/index.js";

async function loadApiEndpoints(payload) {
    const { globalSettings, dataPage } = payload;
    devLog(`Übergebene Parameter:`, `info`, { globalSettings, dataPage });

    const { configFileApiEndpoints = globalSettings?.configFiles?.apiEndpoints } = globalSettings;
    const apiEndpoints = await getConfigData({ relativePath: configFileApiEndpoints, dataPage });

    globalSettings.modulesData.apiEndpoints = apiEndpoints;

    devLog(`Endpunkte:`, `info`, { apiEndpoints, globalSettings });
}

// 🟢 Initialer Aufruf
function initModul(payload) {
    const parameters = payload;
    loadApiEndpoints(parameters);

    logs(`neues Modul get endpoints abgeschlossen`, `info`);
}
export { initModul };