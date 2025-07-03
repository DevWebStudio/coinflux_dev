/**
 * Universelle Funktion für Konsolenausgaben während der Entwicklung.
 * Unterstützt verschiedene Konsolenmethoden (z. B. log, error, warn, clear).
 *
 * @param {string|null} [text=''] - Die Nachricht, die in der Konsole ausgegeben werden soll.
 *                                  Für `console.clear()` kann der Text weggelassen oder auf `null` gesetzt werden.
 * @param {string} [method='log'] - Die Konsolenmethode, die verwendet werden soll.
 *                                  Standardwert: 'log'. Unterstützte Werte: 'log', 'error', 'warn', 'info', 'clear', etc.
 *
 * @example
 * // Standard Konsolenausgabe
 * devLog('Dies ist eine normale Konsolenausgabe');
 * 
 * // Warnung
 * devLog('Dies ist eine Warnung', 'warn');
 * 
 * // Fehler
 * devLog('Ein Fehler ist aufgetreten', 'error');
 * 
 * // Konsole leeren
 * devLog(); // oder devLog(null, 'clear');
 *
 * // Unbekannte Methode
 * devLog('Text mit unbekannter Methode', 'unknown');
 */
function devLog(message = '', method = 'log', ...args) {
    const styles = {
        success: "color: green; font-weight: bold;",
        error: "color: red; font-weight: bold;",
        warn: "color: orange; font-weight: bold;",
        info: "color: blue; font-weight: bold;",
        debug: "color: purple; font-style: italic;",
        log: "color: black; font-weight: bold;"
    };

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

function logs(message = '', method = 'log', onlyDev = false, ...args) {
    if ( onlyDev === false && arguments.length > 2 ) return;
    const styles = {
        success: "color: green; font-weight: bold;",
        error: "color: red; font-weight: bold;",
        warn: "color: orange; font-weight: bold;",
        info: "color: blue; font-weight: bold;",
        debug: "color: purple; font-style: italic;",
        log: "color: black; font-weight: bold;"
    };

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


function datenTyp(data, arrayTyp = false) {
    if (typeof data === 'undefined') {
        // Wenn die Variable oder der Wert nicht definiert ist
        devLog('⚠️ Der übergebene Wert ist undefined.', 'warn');
        return 'undefined';
    }

    if (!arrayTyp) {
        // Wenn kein Array-Typ geprüft werden soll
        return typeof data;
    } else {
        // Prüft, ob es ein Array ist
        return Array.isArray(data);
    }
}

function datenTyp2(data) {
    if (data === null) return "null";
    if (data === undefined) return "undefined";

    const result = typeof data;

    if (result === "object") {
        if (Array.isArray(data)) return "array";
        return "object";
    }
    return result;
}
export { devLog, logs, datenTyp, datenTyp2};