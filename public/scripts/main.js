import { devLog, logs, setLogMode, getTypeAdvanced } from "./utils/index.js";
import { getConfigData } from "./data/utils/index.js";
import { loadNavigation } from "./partials/index.js";

/**
 * Liest Seitendaten aus dem DOM-Element mit der ID `dataset-parameters`
 * und erstellt ein `dataPage`-Objekt für die Initialisierung von Modulen.
 *
 * Erwartet, dass das HTML-Element ein `data-parameter-page`-Attribut besitzt,
 * das ein JSON-Objekt mit den Eigenschaften `id` und `dataLevel` enthält.
 *
 * Beispiel-HTML:
 * ```html
 * <div id="dataset-parameters" data-parameter-page='{"id":"coin-live", "dataLevel":2}'></div>
 * ```
 *
 * @returns {Object} dataPage - Objekt mit den Schlüsseln:
 * - {string} idPage – ID der Seite (Standard: "index")
 * - {number} pathDepth – Verschachtelungstiefe im Verzeichnis (Standard: 0)
 * - {string} pathPrefix – Pfad-Präfix zur Rücknavigation (`../` wiederholt)
 */
function createDataPageFromDOM() {
    try {
        const defaults = { idPage: "index", pathDepth: 0, pathPrefix: "" };
        const paramElement = document.getElementById("dataset-parameters");

        if (!paramElement) {
            return defaults;
        } else {
            const parsed = JSON.parse(paramElement.dataset?.parameterPage || "{}");
            return {
                idPage: parsed.id || defaults.idPage,
                pathDepth: parsed.dataLevel ?? defaults.pathDepth,
                pathPrefix: "../".repeat(parsed.dataLevel ?? defaults.pathPrefix)
            };
        }
    } catch (error) {
        console.error(`❌ Fehler in: Fehler beim Parsen von "data-parameter-seite"`, error);
    }
}

/**
 * Ermittelt den vollständigen Import-Pfad und Dateinamen für ein Modul anhand seiner Konfiguration.
 *
 * Die Funktion unterstützt verschiedene Modul-Typen:
 * - `"main"`: Seitenmodul mit Gruppenzuordnung (z. B. "fro", "adm", "usr")
 * - `"intern_modul"`: internes Hilfsmodul innerhalb des Base-Pfads
 * - `"extern"`: externes Modul, z. B. aus einem externen Library-Verzeichnis
 *
 * @param {Object} payload – Die Daten zur Modulauflösung
 * @param {Object} payload.moduleConfig – Konfigurationsobjekt für ein einzelnes Modul
 * @param {string} payload.moduleConfig.name – Dateiname des Moduls (z. B. "coin-live.js")
 * @param {string} [payload.moduleConfig.type] – Modultyp (Standard: "main")
 * @param {string} [payload.moduleConfig.group] – Gruppenkennung (z. B. "fro" für frontend)
 * @param {string} [payload.moduleConfig.linkPrefix] – Pfad innerhalb der Gruppe (optional)
 * @param {Object} payload.globalSettings – Globale Einstellungen inkl. Pfadangaben
 * @param {Object} payload.dataPage – Informationen zur aktuellen Seite
 * @param {string} payload.dataPage.idPage – ID der aktuellen Seite (z. B. "coin-live")
 *
 * @returns {{ path: string, file: string }} Objekt mit Pfad und Dateiname zur Verwendung beim Import
 */
function resolvedPath(payload) {
    try {
        const { moduleConfig, globalSettings, dataPage } = payload;

        const resolvedModulePath = {
            path: "",
            file: ""
        };

        const type = moduleConfig.type ?? "main";
        const paths = globalSettings.paths;
        devLog(`Start resolvedPath`);
        devLog(`Typ: ${type}`);
        switch (type) {
            case "main":
                const groupCode = moduleConfig.group ?? "fro";
                const groupName = paths.modules.groups[groupCode]?.name ?? "";
                const linkPrefix = moduleConfig.linkPrefix ?? `${dataPage.idPage}/`;

                resolvedModulePath.path = `${paths.modules.base}${groupName}${linkPrefix}`;
                resolvedModulePath.file = moduleConfig.name;
                return resolvedModulePath;

            case "intern_modul":
                resolvedModulePath.path = `${paths.modules.base}`;
                resolvedModulePath.file = moduleConfig.name;
                return resolvedModulePath;

            case "extern":
                resolvedModulePath.path = `${paths.modules.ext}`;
                resolvedModulePath.file = moduleConfig.name;
                return resolvedModulePath;

            default:
                devLog(`⚠️ Unbekannter Modul-Typ: ${type}`, "warn");
        }

        devLog(`Parameter moduleList:`, `info`, { moduleConfig, globalSettings, dataPage });
        devLog(`Modul resolvedPath abgeschlossen.`, 'info');

    } catch (error) {
        console.error(`❌ Fehler in ${resolvedPath.name}: ❌ Fehler beim ermitteln der Modulparameter`, error);
    }
}

/**
 * Extrahiert die angegebenen Parameter aus dem übergebenen `fullPayload`-Objekt
 * auf Basis der in `moduleConfig.parameters` definierten Schlüsselnamen.
 *
 * @function getModuleParameters
 * @param {Object} payload - Das Eingabeobjekt.
 * @param {Object} payload.fullPayload - Alle verfügbaren Parameter, aus denen selektiert werden kann.
 * @param {Object} payload.moduleConfig - Die Konfiguration des Moduls, einschließlich eines `parameters`-Arrays.
 * @returns {Object} result - Ein neues Objekt mit nur den Parametern, die im Modulkonfigurationsarray definiert wurden.
 */
function getModuleParameters(payload) {
    try {
        const { fullPayload, moduleConfig } = payload;

        const parametersToPass = moduleConfig.parameters || [];
        const result = {};
        parametersToPass.forEach(key => {
            if (key in fullPayload) {
                result[key] = fullPayload[key];
            }
        });
        return result;
    } catch (error) {
        console.error(`❌ Fehler in ${getModuleParameters.name}: ❌ Fehler beim generieren der  Modulparameter`, error);
    }
}

/**
 * Initialisiert alle Module für die aktuelle Seite basierend auf der
 * übergebenen Konfiguration.
 *
 * Jedes Modul wird aus dem Pfad geladen, der durch `resolvedPath()` ermittelt wird.
 * Falls das Modul eine `initModul`-Funktion enthält und `initialisierung` aktiv ist,
 * wird es automatisch initialisiert.
 *
 * Voraussetzungen:
 * - Jedes Modul muss im `moduleList` unter `dataPage.idPage` eingetragen sein.
 * - Module können auch nur eingebunden, aber nicht initialisiert werden.
 *
 * @async
 * @function initModules
 * @param {Object} payload - Übergabeparameter für die Initialisierung.
 * @param {Object} payload.moduleList - Objekt mit allen Modulen pro Seite (aus config-modul-list.json).
 * @param {Object} payload.globalSettings - Globale Einstellungen mit Pfaden etc.
 * @param {Object} payload.dataPage - Seiteninformationen mit `idPage`, `pathDepth` und `pathPrefix`.
 * @returns {void}
 */
async function initModules(payload) {
    try {
        const { moduleList, globalSettings, dataPage } = payload;

        // Modulparameter
        const fullPayload = { globalSettings, dataPage, moduleList };

        const initModulName = "initModul";

        if (!dataPage.idPage) {
            devLog(`❌ Abbruch: idPage ist nicht gesetzt.`, 'error');
            return;
        }

        const modulesForPage = moduleList[dataPage.idPage];


        if (!modulesForPage || modulesForPage.length === 0) {
            logs(`ℹ️ Keine Module für Seite "${dataPage.idPage}" definiert.`, 'info');
            return;
        }

        for (const moduleConfig of modulesForPage) {
            try {
                const modulePathInfo = resolvedPath({ moduleConfig, globalSettings, dataPage });

                devLog(`Mudulparameter`);
                devLog(`Modulparameter`, `info`, modulePathInfo);

                const loadedModule = await import(`${modulePathInfo.path}${modulePathInfo.file}`, globalSettings);

                devLog(`Parameter für Weitergabe:`, `info`, globalSettings);

                if (moduleConfig.initialisierung && getTypeAdvanced({ data: loadedModule[initModulName] }) === 'function') {
                    const payload = getModuleParameters({ moduleConfig, fullPayload });
                    devLog(`zu übergebene Parameter`, `info`, payload);
                    await loadedModule[initModulName](payload); // 🟢 Initialisieren
                    devLog(`✅ Modul "${`${modulePathInfo.path}${modulePathInfo.file}`}" erfolgreich initialisiert.`, 'info');
                    devLog(`Rückgabe Modulllist:`, `info`, loadedModule);
                } else if (!moduleConfig.initialisierung) {
                    devLog(`✅ Modul "${`${modulePathInfo.path}${modulePathInfo.file}`}" erfolgreich eingebunden aber nicht initialisiert.`, 'info');
                } else {
                    devLog(`ℹ️ Modul "${`${modulePathInfo.path}${modulePathInfo.file}`}" wurde geladen, aber nicht initialisiert.`, 'debug');
                }

            } catch (error) {
                devLog(`❌ Fehler beim Laden/Initialisieren von "${moduleConfig.name}": ${error.message}`, 'error');
            }
        }
        devLog(`Modul initModules abgeschlossen.`, 'info');
    } catch (error) {
        console.error(`❌ Fehler in ${initModules.name}: ❌ Fehler beim ermitteln der Mudulparameter`, error);
    }
}


// Starte Initialisierung nach DOM-Ready
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const dataPage = createDataPageFromDOM();
        if (!dataPage) {
            devLog(`FEHLER!!! Parameter aus der HTML seite wurden nicht ermittelt`, `error`);
            return;
            /**
             * todo
             * statt return externe fehlerseite aufrufen
             */
        }

        devLog(`Seiten ID: ${dataPage.idPage}, data-level: ${dataPage.pathDepth}`, `info`);
        devLog({ dataPage }, `info`);

        const configFileGlobalSettings = `config-global-settings.json`;
        const globalSettings = await getConfigData({ relativePath: configFileGlobalSettings, dataPage });

        if (!globalSettings) {
            devLog(`FEHLER!!! globale Konfiguration kommte nicht geladen werden`, `error`);
            return;
        }

        // globalen Parameter auslesen für Test oder Livebetrieb
        setLogMode(globalSettings.isDevMode);

        // Navigation verarbeiten
        const resultNavigation = await loadNavigation({ dataPage, globalSettings });

        if (resultNavigation === null) {
            devLog(`Navigation wurde nicht verarbeitet ...`, `warn`);
        }

        const { configFileModules = globalSettings?.configFiles?.modules } = globalSettings;
        const moduleList = await getConfigData({ relativePath: configFileModules, dataPage });

        if (!moduleList || Object.keys(moduleList).length === 0) {
            devLog(`FEHLER!!! Modulloste kommte nicht geladen werden`, `error`);
            return;
        }
        initModules({ moduleList, globalSettings, dataPage });

    } catch (error) {
        console.error(`❌ Fehler bei DOMContentLoaded`, error);
    }
});