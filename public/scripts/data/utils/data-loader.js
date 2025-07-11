import { devLog } from '../../utils/index.js';
import {getDataJson } from '../../utils/fetch/index.js';

/**
 * 🔧 Lädt eine JSON-Konfigurationsdatei relativ zum data-Verzeichnis.
 *
 * Diese Funktion nutzt die zentrale `getDataJson()`-Methode und kombiniert
 * den `pathPrefix` aus `dataPage` mit einem optionalen Unterpfad (`linkPrefixPath`)
 * und dem konkreten Dateinamen (`relativePath`). Sie eignet sich zum Einlesen
 * aller Konfigurationsdateien wie z. B. `config-global-settings.json`, `config-navigation.json` usw.
 *
 * ⚠️ Hinweis: Beim Laden der globalen Konfiguration (`globalSettings`) muss
 * der Dateiname explizit übergeben werden, da dieser Parameter nicht
 * aus der Konfiguration selbst extrahiert werden kann („Henne-Ei-Problem“).
 *
 * @async
 * @function getConfigData
 * @param {Object} payload - Parameterobjekt
 * @param {Object} payload.dataPage - Objekt mit Pfadprefix (z. B. `{ pathPrefix: "../" }`)
 * @param {string} [payload.linkPrefixPath="scripts/data/json/"] - Standardpfad zum Datenverzeichnis
 * @param {string} [payload.relativePath=""] - Dateiname der zu ladenden JSON-Datei (z. B. `"config-navigation.json"`)
 * @param {boolean} [payload.isObj=true] - Gibt an, ob ein Objekt erwartet wird
 * @param {boolean} [payload.isArray=false] - Gibt an, ob ein Array erwartet wird
 * @param {string} [payload.context="single"] - Optionaler Kontext zur Verarbeitung oder Logging-Zwecken
 * @returns {Promise<Object|Array|null>} - Gibt den geladenen Datensatz oder `null` bei Fehler zurück
 */
async function getConfigData(payload) {
    try {
        const {
            dataPage,
            linkPrefixPath = `scripts/data/json/`,
            relativePath = "",
            isObj = true,
            isArray = false,
            context = "single"
        } = payload;

        if (!relativePath) {
            devLog("❌ getConfigData: Kein relativePath übergeben.", `warn`);
            return null;
        }

        const url = `${dataPage.pathPrefix}${linkPrefixPath}${relativePath}`;
        return await getDataJson({ url, isObj, isArray, context });

    } catch (error) {
        console.error(`❌ getConfigData(${relativePath}) fehlgeschlagen:`, error.message);
        return null;
    }
}

export { getConfigData };