
(function() {
	class HbtnEvents extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				checked: true
			};
		}
		render() {
			const rows = this.props.events.slice(0, 10).map(function(item, idx) {
				return (<div key={item.id} className="row">
					<div className="col">
						<input type="checkbox" name="events" value={item.id} />
					</div>
					<div className="col med">{item.id}</div>
					<div className="col big">{item.text}</div>
					<div className="col med">{item.start_date}</div>
					</div>);
			});
			const tableHeader = <div className="row header">
					<div class="col">
						Check All
						<input
							type="checkbox"
							name="events"
							value="" />
					</div>
					<div class="col">ID</div>
					<div class="col">Title</div>
					<div class="col">Start Date</div>
				</div>;
			return (<div className="hbtn-table">{tableHeader}{rows}</div>);
		}
	}
	class Select extends React.Component {
		constructor(props) {
			super(props);
			this.state = {};
		}
		render() {
			const rows = this.props.options.map(function(item, idx) {
				return (<option value={item.value}>{item.text}</option>);
			});
			return (<select className="hbtn-table">{rows}</select>);
		}
	}

	function loadAllCalendarSelects(calendarList) {
		const events = calendarList.map(function(item, idx) {
			return {
				value: item.id,
				text: item.summary
			};
		});
		const domContainer = document.querySelector('#step_3_cont');
		ReactDOM.render(<Select options={events} />, domContainer);
	}

	function initTable(events) {
		const domContainer = document.querySelector('#react_container');
		ReactDOM.render(<HbtnEvents events={events} />, domContainer);
	}
	window.hbtn = {
		initTable: initTable,
		loadCalendarSelect: loadAllCalendarSelects
	}
}());
