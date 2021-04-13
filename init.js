(function() {
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

			$.getJSON("/cgi/index.py", {batch_id: batch_id, intranet_session: intranet_session}, function(data) {
				// take events add them to the calendar
				const all_events = data.data;
				const plds = [];
				const projects = [];
				const evaluationquizes = [];
				const npss = [];
				const refineries = [];
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
			});
		});
		$("#add_events").click(function(evt) {
			// get which calendar we're adding it to
			const calenederIDToAddEventsTo = $('#step_3_cont select').val();
			// get the items we're adding.
			const itemsToAddList = [];
			// get any text they want to add for PLDs (Later any)
			// add all the events proper
			makeIterator(plds, addEventsToCalendar, listUpcomingEvents);
		});
		$("#calendar_button").click(function(evt) {
			listAllCalendars();
		});
	}
	$(document).ready(init);
}());
