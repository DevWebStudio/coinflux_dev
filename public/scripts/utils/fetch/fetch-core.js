import { devLog } from "../log-utils.js";

/**
 * 🔄 Lädt eine JSON-Datei von der angegebenen URL.
 *
 * Verwendet `fetch` und gibt den geparsten JSON-Inhalt zurück oder `null` bei Fehler.
 *
 * @async
 * @function fetchJson
 * @param {Object} payload - Das Parameterobjekt.
 * @param {string} payload.url - Pfad zur JSON-Datei (z. B. `/data/json/config-navigation.json`)
 * @returns {Promise<Object|Array|null>} - Parsed JSON-Daten oder `null` bei Fehler.
 *
 * @example
 * const data = await fetchJson({ url: '/data/json/config-navigation.json' });
 */
async function fetchJsonFile(payload) {
    try {
        const { url } = payload;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der JSON-Datei: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`❌ fetchJson(${payload?.url}) fehlgeschlagen:`, error.message);
        return null;
    }
}

/**
 * Universelle Funktion zum Laden von JSON-Dateien mit optionaler Validierung.
 * Nutzt `fetchJson()` und prüft, ob das Ergebnis ein Objekt oder ein Array ist.
 * Gibt bei Fehler wahlweise `null` (single) oder ein Fehlerobjekt (multi) zurück.
 *
 * @param {Object} payload - Die Parameter für den Ladevorgang.
 * @param {string} payload.url - Pfad zur JSON-Datei.
 * @param {boolean} [payload.isArray=false] - Erwarteter Datentyp: Array.
 * @param {boolean} [payload.isObj=false] - Erwarteter Datentyp: Objekt (kein Array).
 * @param {string} [payload.context='single'] - Verhalten im Fehlerfall: 'single' = `null`, 'multi' = Fehlerobjekt.
 * @returns {Promise<*>} - JSON-Daten oder `null`/Fehlerobjekt bei Fehler.
 *
 * @example
 * const navData = await getDataJson({
 *   url: '/data/json/config-navigation.json',
 *   isObj: true
 * });
 */
async function getDataJson(payload = {}) {
    try {
        const { url = "", isArray = false, isObj = false, context = "single" } = payload;

        if (!url) {
            const msg = "URL-Parameter fehlt in getDataJson()";
            if (context === "single") devLog(`⚠️ ${msg}`, 'warn');
            return context === "multi" ? { error: true, reason: msg, url } : null;
        }

        const data = await fetchJsonFile({ url });

        if (!data) {
            const msg = `JSON-Daten konnten nicht geladen werden von "${url}"`;
            if (context === "single") devLog(`⚠️ ${msg}`, 'warn');
            return context === "multi" ? { error: true, reason: msg, url } : null;
        }

        if (isArray && !Array.isArray(data)) {
            const msg = `Erwartet wurde ein Array, aber erhalten: ${typeof data}`;
            if (context === "single") devLog(`⚠️ ${msg}`, 'warn');
            return context === "multi" ? { error: true, reason: msg, url } : null;
        }

        if (isObj && (typeof data !== "object" || Array.isArray(data) || data === null)) {
            const msg = `Erwartet wurde ein Objekt, aber erhalten: ${typeof data}`;
            if (context === "single") devLog(`⚠️ ${msg}`, 'warn');
            return context === "multi" ? { error: true, reason: msg, url } : null;
        }
        return data;

    } catch (error) {
        const msg = `Fehler in ${getDataJson.name}: ${error.message}`;
        if (context === "single") console.error(`❌ ${msg}`, error);
        return context === "multi"
            ? { error: true, reason: msg, url }
            : null;
    }
}

export { getDataJson };