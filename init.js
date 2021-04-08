(function() {
	$(document).ready(function() {
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
				window.hbtnInitTable(projects);
			});
		});
		$("#calendar_button").click(function(evt) {
			listAllCalendars();
		});
	});
}());
