'use strict';
/**
 * Format String method
 *
 * @author Adam LeVasseur
 *
 * @example
 * 'Added {0} by {1} to your collection'.f(title, artist)
 * 'Your balance is {0} USD'.f(77.7)
 *
 * @param {...String*} arguments - comma delimited list of strings for replacement
 * @returns {String}
 */
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m === "{{") { return "{"; }
    if (m === "}}") { return "}"; }
    return args[n];
  });
};


/**
 * String method for verifying suffix
 *
 * @author Josh Stodola
 * @param {String} suffix - suffix to verify on string.
 * @returns {Boolean}
 */
String.prototype.endsWith = function (suffix) {
  return (this.substr(this.length - suffix.length) === suffix);
};


/**
 * String method for verifying prefix
 *
 * @author Josh Stodola
 * @param {String} prefix - prefix to verify on string.
 * @returns {Boolean}
 */
String.prototype.startsWith = function(prefix) {
  return (this.substr(0, prefix.length) === prefix);
};
