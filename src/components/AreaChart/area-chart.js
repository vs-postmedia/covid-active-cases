import * as d3 from 'd3';
import css from './area-chart.css';



// THE GOOD STUFF
let configCache, dataCache, id, height, width, x, y;
const yTicks = 5;
const opacity = 0.5;
const margin = {
	top: 10,
	right: 20,
	bottom: 25,
	left: 50
};

const addLabels = (svg, config) => {
	config.chart_variables.forEach(d => {
		let yOffset = 0.91;
		let xOffset = 0.65;
		const label = d.replace('cumulative_', '').replace('_cases', '');

		if (label === 'recovered') {
			yOffset = 0.6;
			xOffset = 0.7
		} else if (label === 'active') {
			yOffset = 0.8;
		} else if (label === 'deaths') {
			xOffset = 0.8;
		}

		svg.append('text')
			.text(label)
			.attr('class', `${label} label`)
			.attr('x', width * xOffset)
			.attr('y', height * yOffset)
	})
};

const drawData = (svg, metric, i, data, config) => {
	// prep variables for d3.area
	const variable = data.map(d => {
		d.value = parseInt(d[metric]);
		return (({date, value}) => ({date, value}))(d);
	});

	// draw area charts
	svg.append('g')
		.attr('class', 'area')	
		.append('path')
		.datum(variable)
		.attr('fill', config.fill_colours[i])
		.attr('opacity', opacity)
		.attr('d', d3.area()
			.x(d => x(d.date))
			.y0(y(0))
			.y1(d => y(d.value))
		)
};

const setupFooter = (config) => {
	d3.select(config.id)
		.append('footer')
		.append('p')
			.attr('class', 'source')
			.text('SOURCE: ')
			.append('a')
			.attr('href', config.source_url)
			.attr('target', '_blank')
		.text(config.source_text);

};

const setupHeader = (config, data) => {
	// inset province name into deck
	let subhead = config.subhead.replace('PROV', data[0].province);

	const date = new Date(config.timestamp.split(' ')[0].split('-'));
	const dateString = ` ${date.toLocaleString('default', { month: 'long' })} ${date.getDay()}, ${date.getFullYear()}.`

	// add timestamp to deck
	subhead += dateString;

	d3.select(config.id)
		.append('header')
		.append('h1')
		.attr('class', 'headline')
		.text(config.headline);
	
	d3.select(`${config.id} header`)
		.append('p')
		.attr('class', 'subhead')
		.text(subhead);
}

const ySetup = (data) => {
	return d3.scaleLinear()
		.domain([0, d3.max(data, d => parseInt(d.cumulative_recovered))]).nice()
		.range([height - margin.bottom, margin.top])
};

const xSetup = (data) => {
	return d3.scaleUtc()
			.domain(d3.extent(data, d => d.date ))
			.range([ margin.left, width - margin.right ]);
};

const xAxis = g => {
	g.attr("transform", `translate(0, ${height - margin.bottom})`)
		.attr('class', 'x-axis')
		.call(d3.axisBottom(x)
			.ticks(5)
			.tickSizeOuter(0)
			.tickFormat(d3.utcFormat('%b'))
		)
}

const yAxis = g => {
	g.attr("transform", `translate(${margin.left},0)`)
		.attr('class', 'y-axis')
		    .call(d3.axisLeft(y)
		    	.ticks(yTicks)
		    )
		    .call(g => g.select(".domain").remove()); // removed the line
}

const yAxisGridlines = g => {
	g.attr("transform", `translate(${margin.left},0)`)
		.attr('class', 'gridline')
		    .call(d3.axisLeft(y)
		    	.ticks(yTicks)
		    	.tickSize(-width + margin.left + margin.right)
				.tickFormat('')
		    )
		    .call(g => g.select(".domain").remove()); // removed the line
}

const init = async (data, config) => {
	// setup
	id = config.id;
	dataCache = data;
	configCache = config;

	// convert dates into something useful
	await parseDate(data);
	
	updateChart(data, config);
}

const updateChart = (data, config) => {
	// headline & deck
	setupHeader(config, data);

	// set height & width
	height = d3.select(id).style('height').slice(0, -2) / 1.5 - margin.top - margin.bottom;
	width = d3.select(id).style('width').slice(0, -2);
	// svg
	const svg = d3.select(id)
		.append('svg')
		.attr('viewBox', [0, 0, width, height]);
		// .attr('width', width + margin.left + margin.right)
		// .attr('height', height + margin.top + margin.bottom);

	// Add axes
	x = xSetup(data);
	y = ySetup(data);

	svg.append('g')
		.call(xAxis)

	svg.append('g')
		.call(yAxis)

	svg.append('g')
		.call(yAxisGridlines)

	config.chart_variables.forEach((metric,i) => {
		drawData(svg, metric, i, data, config);
	});

	addLabels(svg, configCache);

	setupFooter(configCache);
};

function parseDate(data) {
	return data.map(d => {
		d.date = d3.timeParse('%d-%m-%Y')(d.date_active);
	});
}

window.addEventListener('resize', () => {
	const el = document.getElementById(id.replace('#', ''));

	if (el !== null) {
		el.innerHTML = '';
		updateChart(dataCache, configCache);
	}
});

export { init, updateChart };