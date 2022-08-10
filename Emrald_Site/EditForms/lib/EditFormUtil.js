/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable jsdoc/check-tag-names */
/**
 * @file Some common functions for use in forms.
 */

/**
 * Extends an object's types through casting.
 *
 * @global
 * @template X - The type to extend.
 * @template A - The type to extend from.
 * @param {X} x - The object to cast.
 * @param {A} _a - An object of the type to extend from.
 * @returns {X & A} - The correctly typed object.
 */
function cast(x, _a) {
  return /** @type {X & A} */ (x);
}

/**
 * Gets the Angular scope of the element with the given ID.
 *
 * @global
 * @template A - The custom scope properties.
 * @param {string} id - The ID of the element whose scope to get.
 * @param {A} _a - An instance of the custom scope for casting.
 * @returns {import('angular').IScope & A} The extended scope.
 */
function getScope(id, _a) {
  return cast(window.angular.element(document.getElementById(id)).scope(), _a);
}
