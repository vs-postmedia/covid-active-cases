import * as d3 from 'd3';
// import * as d3Selection from 'd3-selection';
import tooltipTemplate from '../TooltipTemplate/tooltip-template';
import css from './area-chart.css';



// THE GOOD STUFF
// const yScaleMetric = 'active_cases'; // cumulative_cases, cumulative_recovered, active_cases
let configCache, dataCache, id, height, width, x, y, yScaleMetric;
const yTicks = 5;
const opacity = 0.5;
const margin = {
	top: 10,
	right: 20,
	bottom: 25,
	left: 55
};

const addLabels = (svg, config, data) => {
	config.chart_variables.forEach(d => {
		// not every province had deaths
		if (data[data.length - 1].cumulative_deaths < 1 && d === 'cumulative_deaths') {
			return;
		}
		
		// get the bounding box for the area charts to position the labels 
		const bbox = d3.select(`.${d} path`).node().getBBox();
		let xPos = width * 0.925;
		let yPos = height - (bbox.height / 1.75);

		const label = d.replace('cumulative_', '').replace('_cases', '');

		// magical repositioning so the labels fit somewhat well...
		if (config.province === 'Quebec' && label === 'active') {
			xPos = width - (bbox.width / 2.25);
			yPos = height * 0.6;
		} else if (label === 'active') {
			xPos = width - (bbox.width / 1.6);
			yPos = height * 0.825;
		} else if (label === 'deaths') {
			xPos = width * 0.925;
			yPos = height * 0.9;
		}

		// place the text
		svg.append('text')
			.text(label)
			.attr('class', `${label} label`)
			.attr('text-anchor', 'end')
			.attr('x', xPos)
			.attr('y', yPos)
	});
};

const areaGenerator = (data, x) => {
	return d3.area() 
		.x(d => x(d.date))
		.y0(y(0))
		.y1(d => y(d.value))
}

const drawData = (svg, metric, i, data, config) => {
	// prep variables for d3.area
	const variable = data.map(d => {
		d.value = parseInt(d[metric]);
		return (({date, value}) => ({date, value}))(d);
	});

	// draw area charts
	svg.append('g')
		.attr('class', `area ${metric}`)	
		.append('path')
		.datum(variable)
		.attr('stroke', config.fill_colours[i])
		.attr('stroke-width', 2)
		.attr('opacity', 1)
		.attr('fill', config.fill_colours[i])
		.attr('opacity', opacity)
		.attr('d', areaGenerator(variable, x));

	// outline the areas
	svg.append('path')
		.datum(variable)
		.attr('fill', 'none')
		.attr('stroke', config.fill_colours[i])
		.attr('stroke-width', 2)
		.attr('d', d3.line()
			.x(d => x(d.date))
			.y(d => y(d.value))
		);
	
	// tooltip highlights
	svg.append('g')
		.append('circle')
		.attr('class', `highlight highlight-${i}`)
		.attr('r', 5)
		.attr('fill', config.fill_colours[i])
		.style('display', 'none');
};



function handleMouseMove() {
	const bisectDate = d3.bisector(dataPoint => dataPoint.date).left;
	
	// get x-value of current mouse position
	const xValue = x.invert(d3.mouse(this)[0]);

	// Get the index of the xValue relative to the dataSet & the datapoints on the left & right of the index
	const dataIndex = bisectDate(dataCache, xValue, 1);
	const leftData = dataCache[dataIndex - 1];
	const rightData = dataCache[dataIndex];

	// determine if xPos is closer to the left or right data point
	const dataPoint = xValue - leftData.date > rightData.date - xValue ? leftData : rightData;

	d3.select('.highlight-0')
		.style('display', null)
		.attr('transform', `translate(${x(dataPoint.date)}, ${y(parseInt(dataPoint.cumulative_recovered))})`);

	d3.select('.highlight-1')
		.style('display', null)
		.attr('transform', `translate(${x(dataPoint.date)}, ${y(parseInt(dataPoint.active_cases))})`);

	d3.select('.highlight-2')
		.style('display', null)
		.attr('transform', `translate(${x(dataPoint.date)}, ${y(parseInt(dataPoint.cumulative_deaths))})`);

	//
	showTooltip(dataPoint);
}

function showTooltip(data) {
	const pageXpadding = 15;
	const content = tooltipTemplate(data);

	const tooltip = d3.select('.tooltip-container')
		.html(content);

	const width = d3.select('.tooltip-container')
		.style('width')

	// tooltip left/right of pointer to keep from getting pushed off screen
	const left = event.pageX > parseInt(width) ? event.pageX - (parseInt(width) + pageXpadding)  : event.pageX + pageXpadding;

	d3.select('.tooltip-container')
		.style('display', null)
		.style('top', `${event.pageY - 15}px`)
		.style('left', `${left}px`);
}

function handleMouseOut() {
	d3.selectAll('.highlight')
		.style('display', 'none');

	d3.select('.tooltip-container')
		.style('display', 'none');
}

const parseDate = (data) => {
	return data.map(d => {
		d.date = d3.timeParse('%d-%m-%Y')(d.date_active);
	});
};

const setupFooter = (config) => {
	const footer = d3.select(config.id)
		.append('footer');
	
	footer.append('p')
			.attr('class', 'source')
			.text('SOURCE: ')
			.append('a')
			.attr('href', config.source_url)
			.attr('target', '_blank')
		.text(config.source_text);

	footer.append('p')
			.attr('class', 'credit')
			.text(config.credit);
};

const setupHeader = (config, data) => {
	// inset province name into deck
	let subhead = config.subhead.replace('PROV', data[0].province);

	const d = config.timestamp.split(' ')[0].split('-');
	const date = new Date(d[0], d[1] - 1, d[2]);
	const dateString = ` ${date.toLocaleString('default', { month: 'long' })} ${d[2]}, ${date.getFullYear()}.`

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
		.html(subhead);
};

const setYScaleMetric = data => {
	const cases = parseInt(data[data.length - 1].active_cases);
	const recovered = parseInt(data[data.length - 1].cumulative_recovered);

	return recovered > cases ? 'cumulative_recovered' : 'active_cases';
}

const ySetup = (data) => {
	return d3.scaleLinear()
		.domain([0, d3.max(data, d => parseInt(d[yScaleMetric]))]).nice()
		.range([height - margin.bottom, margin.top])
};

const xSetup = (data) => {
	return d3.scaleUtc()
			.domain(d3.extent(data, d => d.date ))
			.range([ margin.left, width - margin.right ]);
};

const xAxis = g => {
	g.attr('transform', `translate(0, ${height - margin.bottom})`)
		.attr('class', 'x-axis')
		.call(d3.axisBottom(x)
			.ticks(5)
			.tickSizeOuter(0)
			.tickFormat(d3.utcFormat('%b'))
		)
};

const yAxis = g => {
	g.attr("transform", `translate(${margin.left},0)`)
		.attr('class', 'y-axis')
		    .call(d3.axisLeft(y)
		    	.ticks(yTicks)
		    )
		    .call(g => g.select(".domain").remove()); // removed the line
};

const yAxisGridlines = g => {
	g.attr("transform", `translate(${margin.left},0)`)
		.attr('class', 'gridline')
		    .call(d3.axisLeft(y)
		    	.ticks(yTicks)
		    	.tickSize(-width + margin.left + margin.right)
				.tickFormat('')
		    )
		    .call(g => g.select(".domain").remove()); // removed the line
};

const init = async (data, config) => {
	// setup
	id = config.id;
	dataCache = data;
	configCache = config;
	// sometimes actives_cases are higher than recovered. Set the yScale metric on the fly
	yScaleMetric = setYScaleMetric(data);

	// convert dates into something useful
	await parseDate(data);
	
	updateChart(data, config);
};

const updateChart = (data, config) => {
	// headline & deck
	setupHeader(config, data);

	// set height & width
	height = d3.select(id).style('height').slice(0, -2) / 1.6 - margin.top - margin.bottom;
	width = d3.select(id).style('width').slice(0, -2);
	
	// svg
	const svg = d3.select(id)
		.append('svg')
		.attr('viewBox', [0, 0, width, height])
		
	d3.select('svg')
		.on('mousemove touchmove', handleMouseMove)
		.on('mouseout touchend', handleMouseOut);

	// Add axes
	x = xSetup(data);
	y = ySetup(data);

	svg.append('g')
		.call(xAxis)

	svg.append('g')
		.call(yAxis)

	svg.append('g')
		.call(yAxisGridlines)

	// draw data area 
	config.chart_variables.forEach((metric,i) => {
		drawData(svg, metric, i, data, config);
	});

	// add labels
	addLabels(svg, configCache, data);

	// add tooltip
	d3.select('#app')
		.append('div')
			.attr('class', 'tooltip-container')
			.style('display', 'none')
			.style('font', '1rem BentonSans');
	
	// don't forget the footer!
	setupFooter(configCache);
};


window.addEventListener('resize', () => {
	const el = document.getElementById(id.replace('#', ''));

	if (el !== null) {
		el.innerHTML = '';
		updateChart(dataCache, configCache);
	}
});

export { init, updateChart };