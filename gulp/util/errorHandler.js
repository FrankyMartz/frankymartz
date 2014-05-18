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
  notify.onError({
    title: 'Compile Error',
    message: "<%= error.message %>"
  }).apply(this, arguments);
  // Prevent GulpJS from hanging.
  this.emit('end');
};
