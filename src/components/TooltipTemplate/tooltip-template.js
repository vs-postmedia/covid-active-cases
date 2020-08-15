import css from './tooltip-template.css';
import * as d3 from 'd3-time-format';

const formatTime = d3.timeFormat('%B %d, %Y');

function tooltip(data) {
	const template = `
		<div class="tooltip-content">
			<p class="date">${formatTime(data.date)}</p>
			<p class="deaths">${data.cumulative_deaths} deaths</p>
			<p class="active">${data.active_cases} active cases</p>
			<p class="recovered">${data.cumulative_recovered} recovered</p>
		</div>
	`;

	return template;
};

export default tooltip;

