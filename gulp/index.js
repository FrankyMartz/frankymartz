'use strict';
/**
 * User Task Module Loader for Gulp
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @module {Object} gulp
 * @example
 * var g = require(./gulp);
 * g.addTask(<name>, args);  // <name>: Info in module source docs
 */

module.exports = {
  /**
   * Tasks added to (./task) directory are loaded via this method. Valid
   * arguments are documented in each module respectively.
   *
   * @method addTask
   * @param {String} name - User task to load in module:./gulp/task/
   * @param {Array} [dep] - Gulp Task dependencies
   * @param {*} opts - Configuration for task. (Refer to module docs).
   * @throws {TypeError} Require module <name> typeof String
   * @throws {TypeError} Require <dep> typeof Array
   * @throws {TypeError} Require <opts> typeof Object
   */
  addTask: function(name, dep, opts) {
		//////////////////////////////
		// Verify Requirements
		//////////////////////////////
    if (!name || typeof name !== 'string') {
      throw new TypeError('addTask: Require module <name> typeof String.');
    }
		if (dep && !Array.isArray(dep)) {
			throw new TypeError('addTask: Require <dep> typeof Array.');
		}
		if (opts && typeof opts !== 'object') {
			throw new TypeError('addTask: Require <opts> typeof Object.');
		}

		//////////////////////////////
		// Defaults
		//////////////////////////////
    if (!opts) {
      opts = dep;
      dep = undefined;
    }

		//////////////////////////////
		// Call Module
		//////////////////////////////
    var path = './task/' + name;
    require(path)(name, dep, opts);
  }
};
