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
const dataUrl = 'https://storage.googleapis.com/vs-postmedia-data/covid-active-cases.json';

const init = async () => {
	// pull 2digit province code from URL
	const prCode = getPrCode();

	// fetch & prep data
	const resp = await axios.get(dataUrl);
	const data = resp.data.results.filter(d => d.prov_code === prCode);

	// pass provineName into config
	config.province = data[0].province;
	config.timestamp = resp.data.timestamp;
	
	AreaChart.init(data, config);
};

const getPrCode = () => {
	let province
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const prCode = urlParams.get('prov');

	return prCode ? prCode.toUpperCase() : defaultPrCode;
};

const prepData = async (d, prCode) => {
	// filter for selected province
	const data = d.filter(d => d.prov_code === prCode);

	return data;
}

init();
