(function() {
	$(document).ready(function() {
	// when the form submits
		$("#form").submit(function(evt) {
			const batch_id = $(this).find('[name="batch_id"]').val();
			const intranet_session = $(this).find('[name="intranet_session"]').val();
			evt.preventDefault();
			evt.stopPropagation();

			$.getJSON("/cgi/index.py", {batch_id: batch_id, intranet_session: intranet_session}, function(data) {
				debugger;
			});
		});
	});
}());
