'use strict';

/* IE10: Windows 8, Windows Phone 8 - Media Query Fix
 * Internet Explorer 10 doesn't differentiate device width from viewport width,
 * and thus doesn't properly apply the media queries in CSS. Normally you'd just
 * add a quick snippet of CSS to fix this:
 *
 * @-ms-viewport{width:device-width;}
 *
 * However, this doesn't work for devices running Windows Phone 8 versions older
 * than Update 3 (a.k.a. GDR3), as it causes such devices to show a mostly
 * desktop view instead of narrow "phone" view.
 */

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  );
  document.querySelector('head')[0].appendChild(msViewportStyle);
}

