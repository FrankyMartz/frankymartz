'use strict';
/** =========================================================================
 * GitHub events feed
 * Grab GitHub events and append to web page
 *
 * @author Franky Martinez <frankymartz@gmail.com>
 * @version 1.0.0
 * @copyright FrankyMartz 2014
 * ========================================================================== */

// Imports
var $ = require("jquery");
var relDateTime = require("../util/RelativeDateTime");
var trimStringToNewline = require('../util/TrimStringToNewline');
var trimUrlToBaseName = require('../util/TrimURLToBaseName');


// Local Globals
var maxEvents = 10;
var maxNestedEvents = 3;

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
	GollumEvent: {
		main: 'octicon-book',
		created: 'octicon-file-text',
		edited: 'octicon-pencil'
	},
	IssueCommentEvent: 'octicon-comment-discussion',
	IssuesEvent: {
		opened: 'octicon-issue-opened',
		closed: 'octicon-issue-closed',
		reopened: 'octicon-issue-reopened'
	},
	PushEvent: {
		main: 'octicon-repo-push',
		commit: 'octicon-git-commit'
	},
	ReleaseEvent: 'octicon-megaphone',
	WatchEvent: 'octicon-star',
	more: 'octicon-ellipsis'
};


/**
 * Trim Git Commit Message to fifty characters
 * @param {string} str - content to trim
 * @returns {string} content trimmed to 50 characters
 */
function trimGitCommitMessage(str) {
	var message = trimStringToNewline(str);
	if (message.length > 50) {
		message = message.slice(0,47) + '...';
	}
	return message;
}


/**
 * Create GitHub Relative URL string
 * @param {object} event - GitHub API HTTP response object
 * @return {string} GitHub relative URL string
 */
function githubURL(event) {
	var args = Array.prototype.slice.call(arguments, 1).join('');
	return 'http://github.com/'.concat(event.repo.name, args);
}


/**
 * Render HTML HyperLink
 * @param {string} content - HTML hyperlink content
 * @param {string} href - HTML hyperlink
 * @param {string} title - HTML title attribute content
 * @param {string} [style= ] - HTML CSS class
 * @returns {string} HTML for hyperlink
 */
function renderLink(content, href, title, style) {
	href = href || '';
	title = title || '';
	style = style || '';
	if (style) {
		style = ' '.concat('class="', style, '"');
	}
	return ''.concat(
		'<a', style, ' title="', title, '" href="', href, '" target="_blank">', content, '</a>'
	);
}


/**
 * Render HTML for Git Commit Hash
 * @param {string} id - Git Commit Hash
 * @param {string} href - URL of git commit location
 * @returns {string} - HTML for git commit hash
 */
function renderCommitHash(id, href) {
	return renderLink(
		id.commit_id.slice(0,7),
		href,
		''.concat('git commit')
	);
}


/**
 * Render HTML for GitHub Event Reference Type
 * @param {object} event - GitHub API HTTP response object
 * @returns {string} HTML for GitHub event reference type
 */
function renderEventReferenceType(event) {
	var content,url;
	if (event.payload.ref === null) {
		content = event.repo.name;
		url = githubURL(event);
	} else {
		content = event.payload.ref;
		url = githubURL(event, '/tree/', event.payload.ref);
	}
	return renderLink( content, url, ''.concat('git ', event.payload.ref_type));
}


/**
 * Render HTML for GitHub Event Repository
 * @param {object} event - GitHub API HTTP response object
 * @param {boolean} [isFork=false] - Create anchor for fork repository
 * @returns {string} HTML for GitHub event repository
 */
function renderEventRepository(event, isFork) {
	isFork = isFork || false;
	var repository = isFork ? event.payload.forkee.full_name : event.repo.name;
	return renderLink(
		repository,
		''.concat('https://github.com/', repository),
		'git repository'
	);
}


/**
 * Render HTML for Octicon Icon
 * @param {string} type - octicon reference
 * @param {string} href - HTML hyperlink
 * @param {string} title - HTML title attribute
 * @returns {string} HTML for octicon icon
 */
function renderOcticon(type, href, title, content) {
	if (href) {
		title = title || '';
		content = content || '';
		return renderLink(content, href, title, ('octicon ' + type));
	}
	return ''.concat('<i class="octicon ', type, '"></i>');
}


/**
 * Render HTML for List Item
 * @returns {string} HTML for list item
 */
function renderListItem() {
	var args = Array.prototype.slice.call(arguments, 0).join('');
	return ''.concat( '<li>', args, '</li>' );
}


/**
 * Render HTML for GitHub Event
 * @param {object} event - GitHub API HTTP response object
 * @returns {string} HTML for GitHub Event
 */
function githubEventHandler(event) {
	if (!icon.hasOwnProperty(event.type)) {
		return '';
	}

	var html;
	var p = event.payload;
	var eventIcon = icon[event.type];
	var eventAction;
	var eventDescription = '';


	/**
	 * Render HTML for Nested GitHub Events
	 * @param {array.object} nEvents - array of events to process
	 * @param {function} callback - Block placed inside each listed item
	 * @returns {string} Renders HTML for nested github events
	 */
	function renderEventNestedList(nEvents, callback) {
		// return empty if insufficient room for nested events
		if (maxEvents < 3) {
			return '';
		}
		var text, len, i, remainder;
		len = nEvents.length;
		text = '<ul class="git-event-main__description">';
		for (i = 0; i < len; i++) {
			// create ellipsis icon if reaching max nested events
			//
			// TODO: more link should point to commits
			if (i >= maxNestedEvents - 1) {
				remainder = len - i;
				text += renderListItem(
					renderLink(
						''.concat(
							remainder,
							' more commit', (remainder === 1 ? '' : 's'),
							' &raquo;'
						),
						githubURL(event),
						event.repo.name
					)
				);
				break;
			}
			text += callback(i);
			maxEvents -= 1;
		}
		text += '</ul>';
		return text;
	}


	switch (event.type) {
		case 'CommitCommentEvent':
			eventAction = ''.concat(
				'commented on commit ',
				renderCommitHash(p.comment.commit_id, p.comment.html_url)
			);
			break;

		case 'CreateEvent':
			eventIcon = eventIcon[p.ref_type];
			eventAction = ''.concat(
				'created ', p.ref_type, ' ', renderEventReferenceType(event),
				(p.ref === null ? '' : ' at ' + renderEventRepository(event))
			);
			break;

		case 'DeleteEvent':
			eventIcon = eventIcon[p.ref_type];
			eventAction = ''.concat(
				'deleted ', p.ref_type,
				' '.concat('<i>', event.repo.name,'</i> '),
				'at ', renderEventRepository(event)
			);
			break;

		case 'ForkEvent':
			eventAction = ''.concat(
				'forked ', renderEventRepository(event), ' to ', renderEventRepository(event, true)
			);
			break;

		case 'GollumEvent':
			eventIcon = eventIcon.main;
			eventAction = ''.concat(
				'modified ',
				renderLink('wiki', githubURL(event, '/wiki'), p.repository.name + ' wiki'),
				' in ', renderEventRepository(event)
			);

			eventDescription = renderEventNestedList(p.pages, function(i){
				return renderListItem(
					renderOcticon( icon[event.type][p.pages[i].action] ),
					p.pages[i].action,
					' wiki page ',
					renderLink(p.pages[i].page_name, p.pages[i].html_url, p.pages[i].title)
				);
			});
			break;

		case 'IssueCommentEvent':
			eventAction = ''.concat(
				'commented on issue ',
				renderLink(p.issue.title, p.issue.html_url, p.issue.title),
				' at ',
				renderEventRepository(event)
			);
			break;

		case 'IssuesEvent':
			eventIcon = eventIcon[p.action];
			eventAction = ''.concat(
				p.action, ' issue ',
				renderLink(p.issue.title, p.issue.html_url, p.issue.title),
				' at ', renderEventRepository(event)
			);
			break;

		case 'PushEvent':
			eventIcon = eventIcon.main;
			eventAction = ''.concat(
				'pushed to ',
				renderLink(
					trimUrlToBaseName(p.ref),
					githubURL(event, '/tree/', trimUrlToBaseName(p.ref)),
					'git repository push'
				),
				' at ',
				renderEventRepository(event)
			);
			eventDescription = renderEventNestedList(p.commits, function(i){
				return renderListItem(
					renderOcticon(
						icon.PushEvent.commit,
						githubURL(event, '/commit/', p.commits[i].sha),
						''.concat('git push to ', event.repo.name)
					),
					trimGitCommitMessage(p.commits[i].message)
				);
			});
			break;

		case 'ReleaseEvent':
			// published 1.0.0 of frankymartz/frankymartz
			eventAction = ''.concat(
				event.type, ' ',
				renderLink(p.release.tag_name, p.release.html_url, p.release.tag_name),
				' of ',
				renderEventRepository(event)
			);
			break;

		case 'WatchEvent':
			eventAction = ''.concat('starred ', renderEventRepository(event));
			break;

		default:
			return '';
	}

	html = ''.concat(
		'<div class="git__event">',
			'<div class="git-event__aside">', renderOcticon(eventIcon), '</div>',
			'<div class="git-event__main">',
				'<p class="git-event-main__content">', eventAction, '</p>',
				eventDescription,
				'<time class="git-event-main__datetime" datetime="', event.created_at, '">',
					relDateTime(event.created_at),
				'</time>',
			'</div>',
		'</div>'
	);

	maxEvents--;
	return html;
}


// Ajax Call to GitHub. If success add widget to site.
$.getJSON("https://api.github.com/users/frankymartz/events/public", function(data) {
	var feed_html;
	var length = data.length;

	var index;
	for (index = 0; index < length; index++) {
		feed_html = githubEventHandler(data[index]);

		$('.git').append(feed_html);

		if (maxEvents <= 0) {
			break;
		}
	}
});

