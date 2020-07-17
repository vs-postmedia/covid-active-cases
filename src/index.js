// CSS
import normalize from './css/normalize.css';
import colours from './css/colors.css';
import fonts from './css/fonts.css';
import css from './css/main.css';

// JS
import axios from 'axios';
import config from './data/config.json';
import * as AreaChart from './components/AreaChart/area-chart.js';

// VARS
let dataUrl;
const defaultPrCode = 'BC';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const boxUrl = 'https://app.box.com/s/jbcowpxlvrd59b5jos3715040ikqk1n4';

const init = async () => {
	let data;
	// pull 2digit province code from URL
	const prCode = getPrCode();

	// production
	if (!urlParams.get('dev')) {
		dataUrl = boxUrl;
		// fetch & prep data
		const resp = await axios.get(dataUrl);
		data = resp.data.results.filter(d => d.prov_code === prCode);
		config.timestamp = resp.data.timestamp;
	// local dev (since i struggled to get localhost past CORS)
	} else {
		const allData = await require('../config/local-test-data.json');
		data = allData.results.filter(d => d.prov_code === prCode);
		config.timestamp = allData.timestamp;
	}

	// pass provinceName into config
	config.province = data[0].province;
	
	// draw the chart
	AreaChart.init(data, config);
};

const getPrCode = () => {
	let province
	const prCode = urlParams.get('prov');

	return prCode ? prCode.toUpperCase() : defaultPrCode;
};

const prepData = async (d, prCode) => {
	// filter for selected province
	const data = d.filter(d => d.prov_code === prCode);

	return data;
}

init();
