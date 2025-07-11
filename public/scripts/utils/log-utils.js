// ─────────────────────────────────────────────────────────────────────────────
// Logging-Konfiguration
// Globale Steuerung und Styling für Konsolen-Ausgaben im Entwicklungsmodus
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Globale Logging-Konfiguration.
 * Steuert, ob logs() Ausgaben im DevMode schreiben darf.
 * @type {{ logStatus: boolean }}
 */
const logConfig = {
    logStatus: false
}

/**
 * Setzt den globalen Logging-Modus für logs().
 * Sollte z. B. aus globalSettings.isDevMode initialisiert werden.
 * @param {boolean} status - true aktiviert DevMode-Logging, false deaktiviert es.
 */
function setLogMode(status) {
    logConfig.logStatus = status;
}

/**
 * Gibt ein Style-Objekt mit definierten Konsolen-Farben zurück.
 * Wird intern von logs() und devLog() verwendet.
 * @returns {Object<string, string>} Ein Objekt mit CSS-Stilen für verschiedene Log-Typen.
 */
function getLogStyles() {
    return {
        success: "color: green; font-weight: bold;",
        error: "color: red; font-weight: bold;",
        warn: "color: orange; font-weight: bold;",
        info: "color: blue; font-weight: bold;",
        debug: "color: purple; font-style: italic;",
        log: "color: black; font-weight: bold;"
    };
}


/**
 * Universelle Funktion für Konsolenausgaben während der Entwicklung.
 * Gibt Meldungen formatiert in der Konsole aus, unterstützt verschiedene Methoden und farbige Stile.
 * Verwendet zentral definierte Formatierungsregeln aus `getLogStyles()`.
 *
 * @param {string|Object|null} [message=''] - Die Nachricht, die in der Konsole ausgegeben werden soll.
 *                                            Bei Objekten wird automatisch `console.dir()` verwendet.
 * @param {string} [method='log'] - Die Konsolenmethode, die verwendet werden soll.
 *                                  Unterstützte Werte: 'log', 'info', 'warn', 'error', 'success', 'debug', 'clear'.
 * @param {...any} args - Weitere Parameter, die an die Konsolenausgabe angehängt werden.
 *
 * @example
 * // Einfache Ausgabe
 * devLog('Startpunkt erreicht');
 *
 * // Ausgabe mit anderer Methode
 * devLog('Vorsicht: Etwas ist ungewöhnlich', 'warn');
 *
 * // Objekt ausgeben
 * devLog({ id: 123, name: 'Testobjekt' });
 *
 * // Konsole vollständig leeren
 * devLog(null, 'clear');
 *
 * // Unbekannte Methode – fallback auf console.log mit Hinweis
 * devLog('Testausgabe mit falscher Methode', 'xyz');
 */
function devLog(message = '', method = 'log', ...args) {
    const styles = getLogStyles();

    if (arguments.length === 0) {
        console.clear();
        return;
    } else if (method === 'clear') {
        console[method]();
    }

    if (typeof message === "object") {
        console.dir(message, { depth: null, colors: true });
        return;
    }

    if (method === "success") {
        console.log(`%c${message} - Anfrage verarbeitet.`, styles[method]);
        return;
    }
    if (console[method]) {
        console[method](`%c${message}`, styles[method], ...args);
    } else {
        console.log(`%c⚠️ Unbekannte Methode "${method}". Ausgabe: ${message}`, styles['debug'], ...args);
    }
}

/**
 * Kontrollierte Konsolenausgabe für produktionsnahe Umgebungen.
 * Gibt nur dann etwas aus, wenn der globale DevMode (`logConfig.logStatus`) aktiv ist
 * oder explizit `onlyDev` auf `true` gesetzt wurde.
 * 
 * Unterstützt verschiedene Konsolenmethoden (z. B. log, error, warn, clear).
 *
 * @param {string|Object|null} [message=''] - Die auszugebende Nachricht oder ein Objekt (wird mit `console.dir` ausgegeben).
 * @param {string} [method='log'] - Konsolenmethode (z. B. 'log', 'warn', 'error', 'info', 'clear', 'success').
 * @param {boolean} [onlyDev=false] - Wenn `true`, wird die Ausgabe nur im DevMode aktiv (nützlich für Debug-Ausgaben).
 * @param {...any} args - Weitere Werte, die über `console[method]` mit ausgegeben werden.
 * 
 * @example
 * // Wird nur im DevMode angezeigt
 * logs('Init erfolgreich', 'info');
 * 
 * // Immer anzeigen, auch wenn DevMode deaktiviert ist
 * logs('⚠️ Kritischer Fehler', 'error', true);
 * 
 * // Objekt ausgeben
 * logs({ key: 'value' }, 'log');
 * 
 * // Konsole leeren
 * logs(null, 'clear');
 */
function logs(message = '', method = 'log', onlyDev = false, ...args) {
    if (!logConfig.logStatus && !onlyDev) return;
    const styles = getLogStyles();

    if (arguments.length === 0) {
        console.clear();
        return;
    } else if (method === 'clear') {
        console[method]();
        return;
    }

    if (typeof message === "object") {
        console.dir(message, { depth: null, colors: true });
        return;
    }

    if (method === "success") {
        console.log(`%c${message} - Anfrage verarbeitet.`, styles[method]);
        return;
    }

    if (console[method]) {
        console[method](`%c${message}`, styles[method], ...args);
    } else {
        console.log(`%c⚠️ Unbekannte Methode "${method}". Ausgabe: ${message}`, styles['debug'], ...args);
    }
}


export { devLog, logs, setLogMode };