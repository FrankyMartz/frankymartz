/*jslint browser:true*/
'use strict';
/** =========================================================================
 * FrankyMartz.com JavaScript chunky goodness.
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @copyright FrankyMartz 2014
 * ========================================================================== */

var $ = require('jquery');
var attachFastClick = require('fastclick');

// Vendors
attachFastClick(document.body);

// Global
require('./global/read-more-less');

// Pages
require('./pages/preface');
