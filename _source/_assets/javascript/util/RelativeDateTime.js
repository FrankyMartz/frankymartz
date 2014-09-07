'use strict';
/** =========================================================================
 * Converts Date argument into laymans terms relative to now.
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @example
 * // current date is Jun 12, 2014
 *
 * var relDateTime = require(relativeDateTime);
 * relDateTime("2014-05-17T17:43:05-05:00"); // "3 weeks ago"
 *
 * @param {String | Number} datetime - Date that will be converted
 * @returns {String} Date in layman terms
 * ========================================================================== */

module.exports = function(datetime) {

	var time = {
		second: 1,
		minute: 60,
		hour: 3600,
		day: 86400,
		week: 604800,
		month: 2592000,
		year: 31536000
	};
	var then = new Date(datetime);
	var gap = Math.round((Date.now() - then) / 1000);
	var measure, amount;

	if (gap === 0) {
		return 'just now';
	}

	var mark;
	for (mark in time) {
		if (time.hasOwnProperty(mark)) {
			if (gap >= time[mark]) {
				measure = mark;
			}
		}
	}

	amount = Math.floor(gap / time[measure]);
	measure = amount > 1 ? measure + "s" : measure;

	return amount + " " + measure + " ago";
};

