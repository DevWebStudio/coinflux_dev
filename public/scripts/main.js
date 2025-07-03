import { devLog } from './utils/index.js';

devLog(`hallo Flux`, `info`);

const paramElement = document.getElementById("dataset-parameters");
const dataPage = {
    idPage: "index",
    pathDepth: 0
};

if (!paramElement) {
    console.warn("⚠️ Kein `#dataset-parameters` gefunden! Setze Standardwerte...");
} else {
    ({ id: dataPage.idPage, dataLevel: dataPage.pathDepth } = JSON.parse(paramElement.dataset?.parameterSeite || "{}"));
    if (dataPage.idPage === "unknown") {
        console.warn("⚠️ Kein idPage gefunden! Standardwert gesetzt.")
        dataPage.idPage = "index";
    };
    
    if (dataPage.pathDepth === undefined) {
        dataPage.pathDepth = 0;
    }

    devLog(`Seiten ID: ${dataPage.idPage}, data-level: ${dataPage.pathDepth},`, `info`);
    devLog({dataPage}, `info`);
}
