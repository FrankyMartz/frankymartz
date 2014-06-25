'use strict';
/**
 * GitHub events feed
 * Grab GitHub events and append to web page
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @copyright FrankyMartz 2014
 */

var $ = require("jquery");
require("../util/String");
var relDateTime = require("../util/RelativeDateTime");


var icon = {
    CommitCommentEvent: 'octicon-comment',
		CreateEvent: {
		    repository: 'octicon-repo',
				branch: 'octicon-git-branch',
				tag: 'octicon-tag'
		},
		DeleteEvent: {
		    branch: 'octicon-trashcan',
				tag: 'octicon-x'
		},
		ForkEvent: 'octicon-repo-forked',
		GollumEvent: 'octicon-pencil',
		IssueCommentEvent: 'octicon-comment-discussion',
		IssuesEvent: {
		    opened: 'octicon-issue-opened',
				closed: 'octicon-issue-closed',
				reopened: 'octicon-issue-reopened'
		},
		PushEvent: 'octicon-git-commit',
		ReleaseEvent: 'octicon-megaphone',
		WatchEvent: 'octicon-star'
}

function trimStringToNewline(str) {
	var len = str.indexOf("\n");
	len = (len !== -1) ? len : str.length;
	return str.slice(0, len);
}


function trimUrlToBaseName(str) {
	var len = str.lastIndexOf('/');
	return str.slice(len + 1);
}


// create html element for event
function createEventHTML(avatar, action, datetime, comment) {
	if (comment !== '' || comment !== undefined || comment !== null) {
		comment = ''.concat(
			'<p class="home-github-event-body-comment">',
				trimStringToNewline(comment),
			"</p>");
	} else {
		comment = '';
	}

	return ''.concat(
		'<article class="home-github-event">',
			'<a href="http://github.com/FrankyMartz"><img class="home-github-avatar" src="', avatar, '" alt="github avatar"/></a>',
			'<img class="home-github-event-avatar" src="', avatar,'" alt="github avatar" />',
			'<div class="home-github-event-body">',
				'<p class="home-github-event-action">', action, '</p>',
				comment,
				'<time class="home-github-event-datetime" datetime="', datetime,'">', relDateTime(datetime),'</time>',
			'</div>',
		'</article>'
	);
}


// create json object
$.getJSON("https://api.github.com/users/frankymartz/events/public", function(data) {
	var count = 5;
	var html = '';
	var event,avatar,datetime,action,comment;
	var page, commit;

	var i,il;
	var k,kl;

	iterateEvents:
	for (i = 0, il = data.length; i < il; i++) {
		event = data[i];
		avatar = event.actor.avatar_url;
		datetime = event.created_at;
		comment = '';

		// TODO: Add html anchor links
		determineEvent:
		switch (event.type) {
			case 'CreateEvent':
				// (img) created {payload.ref_type}[ {payload.ref} at] {repo.name}
				// (img) {created_at}
				action = ''.concat('created ', event.payload.ref_type, ' ');
				action.concat(event.payload.ref !== null ? event.payload.ref + ' at ' : '');
				action.concat(event.repo.name);
				break determineEvent;

			case 'DeleteEvent':
				// (img) deleted {payload.ref_type} {payload.ref}
				// (img) {created_at}
				action = ''.concat('deleted ', event.payload.ref_type, ' ', event.payload.ref);
				break determineEvent;

			case 'ForkEvent':
				// (img) forked {repo.name} to {payload.forkee.full_name}
				// (img) {created_at}
				action = ''.concat('forked ', event.repo.name, ' to ', event.payload.forkee.full_name);
				break determineEvent;

			case 'GollumEvent':
				// (img) {payload.pages[].action} the wiki page {payload.pages[].page_name}
				// (img) {created_at}
				for (k = 0, kl = event.payload.pages.length; k < kl; k++) {
					page = event.payload.pages[k];
					action = ''.concat(
						page.action, ' the wiki page ', page.page_name
					);
					html = html.concat(createEventHTML(avatar, action, datetime, comment));
					count--;
					if (count <= 0) {
						break iterateEvents;
					}
				}
				break determineEvent;

			case 'IssueCommentEvent':
				// (img) commented on issue {repo.name}#{payload.issue.number}
				// (img) {payload.comment.body}
				// (img) {created_at}
				action = ''.concat(
					'commented on issue ', event.repo.name, '#', event.payload.issue.number
				);
				// TODO: Trim comment to 50 chars
				comment = event.payload.comment.body;
				break determineEvent;

			case 'IssuesEvent':
				// (img) {payload.action} issue in {repo.name}
				// (img) {payload.issue.title}
				// (img) {created_at}
				action = ''.concat(
					event.payload.action, ' issue in ', event.repo.name
				);
				comment = event.payload.issue.title;
				break determineEvent;

			case 'PushEvent':
				// (img) pushed to {payload.ref} at {repo.name}
				// (img) {comment}
				// (img) {created_at}
				for (k = 0, kl = event.payload.commits.length; k < kl; k++) {
					commit = event.payload.commits[k];
					action = ''.concat(
						'pushed to ', trimUrlToBaseName(event.payload.ref), ' at ', event.repo.name
					);
					comment = trimStringToNewline(commit.message);
					html = html.concat(createEventHTML(avatar, action, datetime, comment));
					count--;
					if (count <= 0) {
						break iterateEvents;
					}
				}
				break determineEvent;

			case 'WatchEvent':
				// (img) [star] {repo.name}
				// (img) {created_at}
				action = '&#9733; '.concat(event.repo.name);
				break determineEvent;

			default:
				continue iterateEvents;
		}
		console.log(createEventHTML(avatar, action, datetime, comment));
		html = html.concat(createEventHTML(avatar, action, datetime, comment));
		count--;

		if (count <= 0) {
			console.log('perchance');
			break iterateEvents;
		}
	}
	$('.home-github').append(html);
});

// length limit 45 chars including ellipsis
// f3402a9 BugFix: Did not assign Route:get ...

