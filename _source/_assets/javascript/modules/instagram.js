'use strict';
/** =========================================================================
 * Instagram Feed Widget
 * Grab Instagrams and append to web page
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @version 1.0.0
 * @copyright FrankyMartz 2014
 * ========================================================================== */

// Modules
var $ = require('jquery');
var relativeDateTime = require('../util/RelativeDateTime');

// Local Globals
var clientID = '2dacf88dd8af4cb8b555832bfdb13d5a';
var userID = '12359370';

var instagram_GET_url = ''.concat(
	'https://api.instagram.com/v1/users/', userID, '/media/recent/',
	'?client_id=', clientID,
	'&callback=?'
);


// Ajax Call to GitHub. If success add widget to site.
$.getJSON(instagram_GET_url, function(response) {

	var count = 3;

	var data = response.data;
	var length = data.length;
	var html = '';
	var item, page_url, title, image_url, relDatatime, datetime, likes, comments, info;

	var index;
	for (index = 0; index < length; index++) {
		if (count <= 0) {
			break;
		}

		item = data[index];

		// Ignore Instagram Videos
		if (!item.hasOwnProperty('videos')) {

			page_url = item.link;
			title = item.caption.text;
			image_url = item.images.standard_resolution.url;
			datetime = parseInt(item.created_time, 10) * 1000;
			relDatatime = relativeDateTime(datetime);
			likes = item.likes.count;
			comments = item.comments.count;

			info = '';

			if ( likes || comments ) {
				info += '<div>';
				info += likes ? '<i class="octicon octicon-heart"></i>' + likes : '';
				info += comments ?  '<i class="octicon octicon-comment"></i>' + comments : '';
				info += '</div>';
			}

			html += ''.concat(
				'<a class="instagram__item" href="', page_url, '">',
					'<div class="instagram-item__info">',
						'<span class="instagram-item-info__head">', title,'</span>',
						'<em><time datetime="', Date(datetime).toString(), '">', relDatatime,'</time></em>',
						info,
					'</div>',
					'<img class="instagram-item__image" alt="', title, '" title="', title, '" src="', image_url, '"/>',
				'</a>'
			);

			count--;
		}
	}
	$('.instagram').append(html);
});

/*
if (window.matchMedia("(min-width: 400px)").matches) {
  // the view port is at least 400 pixels wide
  // the view port is at least 400 pixels wide
} else {
  // the view port is less than 400 pixels wide
}
*/
