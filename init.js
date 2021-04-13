(function() {
	const plds = [];
	const projects = [];
	const evaluationquizes = [];
	const npss = [];
	const refineries = [];
	function init() {
		if(!window.hbtn) {
			window.hbtn = {};
		}
		handleClientLoad();
		initEvents();
	}
	function initEvents() {
		$("#clear_calendar").click(function() {
			clearAllEvents();
		});
		// when the form submits
		$("#form").submit(function(evt) {
			const batch_id = $(this).find('[name="batch_id"]').val();
			const intranet_session = $(this).find('[name="intranet_session"]').val();
			evt.preventDefault();
			evt.stopPropagation();
			// clear all of our arrays?
			plds.length = 0;
			projects.length = 0;
			evaluationquizes.length = 0;
			npss.length = 0;
			refineries.length = 0;

			$.getJSON("/cgi/index.py", {batch_id: batch_id, intranet_session: intranet_session}, function(data) {
				// take events add them to the calendar
				const all_events = data.data;
				const now = moment();
				all_events.forEach(function(item, idx) {
					const mItemStartTime = moment(item.start_date, "DD-MM-YYYY HH:mm");
					const isInTheFuture = mItemStartTime > now;
					if(!isInTheFuture) {
						return;
					}

					item.moment_start_date = mItemStartTime;
					item.moment_end_date = moment(item.end_date, "DD-MM-YYYY HH:mm");

					if(item.type === "peer_learning_day") {
						item.moment_start_date.hour(9);
						item.moment_end_date.hour(15).subtract(1, 'day');
						plds.push(item);
						return;
					}
					if(item.type === "project") {
						projects.push(item);
						return;
					}
					if(item.type === "evaluation-quiz") {
						evaluationquizes.push(item);
						return;
					}
					if(item.type === "nps-quiz") {
						npss.push(item);
						return;
					}
					if(item.type === "reefinery") {
						refineries.push(item);
						return;
					}
				});

				window.hbtn.initTable(plds);
				window.hbtn.lists = {
					plds: plds,

				}
			});
		});
		$("#list_upcoming_events").click(function(evt) {
			listUpcomingEvents();
		});
		$("#add_events").click(function(evt) {
			// add all the events proper
			makeIterator(plds, addEventsToCalendar, listUpcomingEvents);
		});
	}
	$(document).ready(init);
}());
