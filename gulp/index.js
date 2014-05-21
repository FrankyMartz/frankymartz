'use strict';
/**
 * User Task Module Loader for Gulp
 *
 * @author Francisco Martinez <frankymartz@gmail.com>
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
   * @throws {TypeError} Requires argument <name> typeof String
   */
  addTask: function(name, dep, opts) {
    if (!name || typeof name !== 'string') {
      throw new Error('addTask: requires module <name> typeof String.');
    }
    if (!opts) {
      opts = dep;
      dep = undefined;
    }
    var path = './task/' + name;
    require(path)(name, dep, opts);
  }
};
