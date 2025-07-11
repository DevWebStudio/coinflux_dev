/**
 * Setzt mehrere Attribute auf ein DOM-Element.
 *
 * @function setAttributes
 * @param {HTMLElement} element - Das Ziel-Element, auf das die Attribute gesetzt werden sollen.
 * @param {Object.<string, string>} attributes - Ein Objekt mit Attributnamen als Schlüssel und deren Werten.
 *
 * @example
 * setAttributes(button, {
 *   type: 'button',
 *   'aria-label': 'Schließen',
 *   class: 'btn btn-danger'
 * });
 */
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

export { setAttributes };