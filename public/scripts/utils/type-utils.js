import { devLog } from '../utils/index.js';

/**
 * Gibt den primitiven Typ eines Wertes zurück.
 * Optional kann geprüft werden, ob es sich um ein Array handelt.
 *
 * @param {Object} payload - Das Parameterobjekt.
 * @param {*} payload.data - Der zu untersuchende Wert.
 * @param {boolean} [payload.arrayTyp=false] - Falls true, wird geprüft, ob es ein Array ist.
 * @returns {string|boolean} - Der Typ als String (z. B. "string", "number") oder ein Boolean bei Arrayprüfung.
 */
function getTypeSimple(payload) {
    const { data, arrayTyp = false } = payload;

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

/**
 * Gibt den detaillierten Typ eines Wertes zurück (z. B. "array", "null", "object").
 *
 * @param {Object} payload - Das Parameterobjekt.
 * @param {*} payload.data - Der zu untersuchende Wert.
 * @returns {string} - Der erkannte Typ als String: "string", "number", "array", "object", "null", "undefined", etc.
 */
function getTypeAdvanced(payload) {
    const { data } = payload;

    if (data === null) return "null";
    if (data === undefined) return "undefined";

    const result = typeof data;

    if (result === "object") {
        if (Array.isArray(data)) return "array";
        return "object";
    }
    return result;
}

export { getTypeSimple, getTypeAdvanced };