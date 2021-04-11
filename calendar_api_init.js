// Client ID and API key from the Developer Console
var CLIENT_ID = '533670458891-1tl41cjpu1m42uobe5vu26oqh45dr0g5.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAVF2Daq9eyjP-sQvH3P22rGqt12790ct4';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

		// go and get the calendars
		listAllCalendars();
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	}, function(error) {
		appendPre(JSON.stringify(error, null, 2));
	});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		listUpcomingEvents();
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
	const calendarId = "c_ea7a4nfaf66c1su26tbbgs1co0@group.calendar.google.com";
	document.getElementById('content').innerHTML = "Loading new events";
	gapi.client.calendar.events.list({
		'calendarId': calendarId,
		'timeMin': (new Date()).toISOString(),
		'showDeleted': false,
		'singleEvents': true,
		'maxResults': 250,
		'orderBy': 'startTime'
	}).then(function(response) {
		var events = response.result.items;
		document.getElementById('content').innerHTML = "";
		appendPre('Upcoming events:');

		if (events.length > 0) {
			for (i = 0; i < events.length; i++) {
				var event = events[i];
				var when = event.start.dateTime;
				if (!when) {
					when = event.start.date;
				}
				appendPre(event.summary + ' (' + when + ')')
			}
		} else {
			appendPre('No upcoming events found.');
		}
	});
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function clearAllEvents() {
	const calendarId = "c_ea7a4nfaf66c1su26tbbgs1co0@group.calendar.google.com";
	gapi.client.calendar.events.list({
		'calendarId': calendarId,
		'timeMin': (new Date()).toISOString(),
		'showDeleted': false,
		'singleEvents': true,
		'maxResults': 250,
		'orderBy': 'startTime'
	}).then(function(response) {
		var events = response.result.items;
		makeIterator(events, function(evt) {
			return gapi.client.calendar.events.delete({
				calendarId: calendarId,
				eventId: evt.id
			});
		}, listUpcomingEvents);
	});
}

function makeIterator(events, callback, endfn) {

	let idx = 0;
	const iterator = function () {
		if(idx >= events.length) {
			endfn();
			return;
		}
		callback(events[idx++])
			.execute(function() {
				iterator();
			});
	};
	iterator();
}

function listAllCalendars() {
	gapi.client.calendar.calendarList.list().then(function(resp) {
		const calendarsList = resp.result.items;
		window.hbtn.loadCalendarSelect(calendarsList);
	});
}

function addEventsToCalendar(evtObj) {
	const calendarId = "c_ea7a4nfaf66c1su26tbbgs1co0@group.calendar.google.com";
	let desc;
	switch(evtObj.type) {
		case "peer_learning_day":
			desc =  "Please join our PLD at https://meet.google.com/nui-bnaa-fjh";
			break;
		default:
			desc =  "Just a reminder of when projects start";
	}
	const eventDataObj = {
		summary: evtObj.text,
		description: desc,
		start: {
			dateTime: evtObj.moment_start_date.format(),
			timeZone: 'America/Puerto_Rico'
		},
		end: {
			dateTime: evtObj.moment_end_date.format(),
			timeZone: 'America/Puerto_Rico'
		}
	};
	return gapi.client.calendar.events.insert({
		'calendarId': calendarId,
		'resource': eventDataObj
	});
}
