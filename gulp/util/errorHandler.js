'use strict';
/**
 * Notify Gulp Error Handler
 */
var notify = require('gulp-notify');
/**
 * Function for using as callback when catching errors in stream. Not designed
 * for direct usage.
 * @mixin errorHandler
 */
module.exports = function() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: "<%= error.message %>"
  }).apply(this, args);
  // Prevent GulpJS from hanging.
  this.emit('end');
};
