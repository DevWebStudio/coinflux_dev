// ─────────────────────────────────────────────────────────────────────────────
// Modul: Navigation
// Lädt und verarbeitet die Navigationsdaten zur Laufzeit aus JSON-Datei
// ─────────────────────────────────────────────────────────────────────────────

import { devLog, logs, setAttributes } from '../utils/index.js';
import { getConfigData } from "../data/utils/index.js";

/**
 * Setzt den Dokumenttitel dynamisch anhand des Navigationseintrags.
 *
 * @function setDocumentTitle
 * @param {Object} payload - Objekt mit Seitendaten.
 * @param {Object} payload.navPageData - Navigationseintrag zur aktuellen Seite.
 * @param {string} [payload.navPageData.pageTitle] - Titel der Seite für das `<title>`-Element.
 * @returns {void}
 */
function setDocumentTitle(payload) {
    try {
        const { navPageData } = payload;
        const title = `WBX | ${navPageData?.pageTitle}` || "WBX | CoinFlux";
        document.title = title;
        devLog(`🔹 Titel gesetzt: ${title}`, "info");
    } catch (error) {
        console.error(`❌ Fehler in ${setDocumentTitle.name}: ❌ Fehler beim setzen des Seitentitels`, error);
    }
}

/**
 * Fügt dynamisch Meta-Tags in den `<head>`-Bereich des Dokuments ein.
 *
 * @function insertMetaTags
 * @param {Object} payload - Objekt mit Navigations- und Seitendaten.
 * @param {Object} payload.navPageData - Navigationseintrag zur aktuellen Seite (inkl. `metaData`).
 * @param {Array<Object>} [payload.navPageData.metaData] - Array mit Meta-Tag-Definitionen, z. B. `{ name: "description", content: "..." }`.
 * @param {Object} payload.navigationItems - Navigationsobjekt mit globalSettings (z. B. `isAfterTitle`).
 * @returns {void}
 */
function insertMetaTags(payload) {
    try {
        const { navPageData, globalSettings } = payload;
        const metaData = navPageData?.metaData;
        if (!Array.isArray(metaData)) return;

        const head = document.querySelector("head");
        const titleElement = globalSettings?.navigation?.isAfterTitle
            ? head.querySelector("title")?.nextSibling
            : head.querySelector("title");

        const fragment = document.createDocumentFragment();
        metaData.forEach((entry) => {
            const { content } = entry;
            if (!content) return;

            const attrKey = Object.keys(entry).find(key => key !== "content");
            if (!attrKey) return;

            const attrValue = entry[attrKey];
            if (!attrValue) return;

            const meta = document.createElement("meta");
            meta.setAttribute(attrKey, attrValue);
            meta.setAttribute("content", content);

            fragment.append(meta);
            logs(`🔹 Meta-Tag eingefügt: ${attrKey}="${attrValue}" | content="${content}"`, "info", true);
        });
        head.insertBefore(fragment, titleElement);
    } catch (error) {
        console.error(`❌ Fehler in ${insertMetaTags.name}: ❌ Fehler beim Verarbeiten der MetaTags`, error);
    }
}

/**
 * Aktualisiert die Navigationsleiste dynamisch zur Laufzeit.
 * Setzt aktive Links, ersetzt den Link des aktuellen Elements durch ein <span> (zur Vermeidung von Klicks auf die aktuelle Seite),
 * und passt die `href`-Attribute aller anderen Navigationseinträge an.
 *
 * @function updateNavigationMenu
 * @param {Object} payload - Die Navigationsdaten
 * @param {Object} payload.dataPage - Informationen zur aktuellen Seite
 * @param {string} payload.dataPage.idPage - ID der aktuellen Seite
 * @param {string} payload.dataPage.pathPrefix - Pfad zur aktuellen Seite für JSON-Ladepfad und Link-Generierung
 * @param {Object} payload.navigationItems - Vollständige Navigationsdaten aus der JSON-Konfiguration
 * @returns {void}
 */
function updateNavigationMenu(payload) {
    try {
        const { globalSettings,  navigationItems, dataPage } = payload;

        const navBar = document.querySelector("#wbxNavbarPrimary");
        if (!navBar) {
            devLog(`Navigation nicht gefunden`, `warn`);
            return;
        }

        Object.entries(navigationItems).forEach((entry) => {
            const { idPage = entry[0], parameters = entry[1] } = entry;

            const navElement = navBar.querySelector(`[data-page="${idPage}"]`);
            if (navElement) {
                if (dataPage.idPage === idPage) {
                    if (!navElement) {
                        devLog(`NavigationsItem nicht gefunden: Link ${idPage} kann nicht geändert werden.`, `warn`)
                    } else {
                        const spanElement = document.createElement('span');
                        spanElement.className = navElement.className;
                        spanElement.classList.add('active');
                        setAttributes(spanElement, {
                            "data-page": navElement.getAttribute('data-page'),
                            "aria-current": "page",
                        });
                        spanElement.textContent = navElement.textContent;
                        navElement.parentNode.replaceChild(spanElement, navElement);

                        devLog(`aktuelle seite: ${idPage}`);
                        if (parameters.isMegaMenu) {
                            devLog(`aktueller Eintrag: ${idPage} ist ein Megamenü`);
                        }
                    }
                } else {
                    navElement.classList.remove("active");
                    dataPage.idPage === "index"
                        ? navElement.setAttribute("href", `${globalSettings?.navigation?.linkPrefixFrontend}${parameters.href}`)
                        : navElement.setAttribute("href", `${parameters.href}`);
                }
                if (parameters.isMegaMenu) {
                    devLog(`das Item: ${idPage} ist ein Megamenü`);
                }
            }
        });
    } catch (error) {
        console.error(`❌ Fehler in ${updateNavigationMenu.name}: ❌ Fehler beim Verarbeiten der NavigationsItems`, error);
    }
}

/**
 * Führt die Navigationseinträge aus und steuert die Darstellung im DOM.
 *
 * @function renderNavigation
 * @param {Object} payload - Objekt mit Navigations- und Seitendaten.
 * @param {Object} payload.navigationItems - Alle geladenen Navigationsdaten (inkl. globalSettings).
 * @param {Object} payload.navPageData - Navigationseintrag zur aktuellen Seite.
 * @param {Object} payload.dataPage - Objekt mit Informationen zur aktuellen Seite.
 * @returns {void}
 */
function renderNavigation(payload) {
    try {
        const { navigationItems, dataPage, navPageData, globalSettings } = payload;

        setDocumentTitle({ navPageData });
        insertMetaTags({ globalSettings, navPageData });
        updateNavigationMenu({ globalSettings, navigationItems, dataPage });
    } catch (error) {
        console.error(`❌ Fehler in ${renderNavigation.name}: ❌ Fehler beim Verarbeiten der Navigation`, error);
    }
}

/**
 * Lädt die Navigationsdaten aus der JSON-Datei und verarbeitet sie weiter.
 *
 * @async
 * @function loadNavigation
 * @param {Object} payload - Objekt mit Seitendaten.
 * @param {Object} payload.dataPage - Objekt mit Informationen zur aktuellen Seite.
 * @param {string} payload.dataPage.idPage - ID der aktuellen Seite (z. B. "index", "coin-create").
 * @param {string} payload.dataPage.pathPrefix - Relativer Pfad zur JSON-Datei.
 * @returns {Promise<Object|null>} - Gibt die geladenen Navigationsdaten zurück oder `null` bei Fehler.
 */
async function loadNavigation(payload = {}) {
    try {
        const { globalSettings, dataPage } = payload;
        // const { configNav = globalSettings?.configFiles?.navigation, configPath = globalSettings?.paths?.config } = globalSettings;

        const { configFileNavigation = globalSettings?.configFiles?.navigation } = globalSettings;
        const navigationItems = await getConfigData({ relativePath: configFileNavigation, dataPage });

        const navPageData = navigationItems[dataPage.idPage];
        if (navPageData && Object.keys(navPageData).length > 0) {
            renderNavigation({ navigationItems, navPageData, dataPage, globalSettings });
        } else {
            devLog(`⚠️ Keine Navigationseinträge für "${dataPage.idPage}" gefunden – Navigation wird nicht gerendert.`, "warn");
        }

        return navigationItems;

    } catch (error) {
        console.error(`❌ Fehler in ${loadNavigation.name}: ❌ Fehler beim Laden der Navigation`, error);
        return null;
    }
}

export { loadNavigation };