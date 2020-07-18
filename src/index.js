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
const defaultPrCode = 'BC';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let dataUrl = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/covid-active-cases.json';

const init = async () => {
	let data;
	// pull 2digit province code from URL
	const prCode = getPrCode();

	// production
	if (!urlParams.get('dev')) {
		// fetch & prep data
		const resp = await axios.get(dataUrl, { crossdomain: true });
		data = resp.data.results.filter(d => d.prov_code === prCode);
		config.timestamp = resp.data.timestamp;
	// local dev 
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
