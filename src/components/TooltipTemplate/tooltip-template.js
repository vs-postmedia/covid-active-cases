import * as d3 from 'd3-time-format';
import css from './tooltip-template.css';
import helper from '../../js/helper-functions';

const formatTime = d3.timeFormat('%B %d, %Y');

function tooltip(data) {
	const template = `
		<div class="tooltip-content">
			<p class="date">${formatTime(data.date)}</p>
			<p class="active">${helper.numberWithCommas(data.active_cases)} active cases</p>
			<p class="recovered">${helper.numberWithCommas(data.cumulative_recovered)} recovered</p>
			<p class="deaths">${helper.numberWithCommas(data.cumulative_deaths)} deaths</p>
		</div>
	`;

	return template;
};

export default tooltip;

