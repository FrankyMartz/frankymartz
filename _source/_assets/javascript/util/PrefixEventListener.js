'use strict';
/** =========================================================================
 * Auto Prefix Event Listeners
 *
 * @author Craig Buckler
 * @param {object} element - DOM node for adding Event Listeners
 * @param {string} type - Browser Event Type
 * @param {function} callback - Callback passed to Event Listeners
 * ========================================================================== */

var pfx = ["webkit", "moz", "MS", "o", ""];

module.exports = function (element, type, callback){
	var p;
	for (p = 0; p < pfx.length; p++) {
		if (!pfx[p]) {
			type = type.toLowerCase();   
		}
		element.addEventListener(pfx[p]+type, callback, false);
	}
};
