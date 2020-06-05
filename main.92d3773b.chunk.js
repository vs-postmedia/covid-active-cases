(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 10:
/***/ (function(module) {

module.exports = JSON.parse("{\"id\":\"#app\",\"headline\":\"Recoveries, deaths and active cases of COVID-19\",\"subhead\":\"<span class='active'>Active cases</span> of COVID-19 in PROV, as well as <span class='recovered'>recoveries</span> and <span class='deaths'>deaths</span> from the coronavirus. Data is current as of \",\"source_text\":\"COVID-19 Canada Open Data Working Group\",\"source_url\":\"https://github.com/ishaberry/Covid19Canada\",\"credit\":\"N. Griffiths / Postmedia News\",\"chart_variables\":[\"cumulative_recovered\",\"active_cases\",\"cumulative_deaths\"],\"fill_colours\":[\"#009775\",\"#0062A3\",\"#231F20\"]}");

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(2);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(5);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./src/css/normalize.css
var normalize = __webpack_require__(76);

// EXTERNAL MODULE: ./src/css/colors.css
var colors = __webpack_require__(77);

// EXTERNAL MODULE: ./src/css/fonts.css
var fonts = __webpack_require__(78);

// EXTERNAL MODULE: ./src/css/main.css
var main = __webpack_require__(79);

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(30);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// EXTERNAL MODULE: ./src/data/config.json
var data_config = __webpack_require__(10);

// EXTERNAL MODULE: ./node_modules/d3/index.js + 289 modules
var d3 = __webpack_require__(0);

// EXTERNAL MODULE: ./src/components/AreaChart/area-chart.css
var area_chart = __webpack_require__(97);

// CONCATENATED MODULE: ./src/components/AreaChart/area-chart.js



 // THE GOOD STUFF
// const yScaleMetric = 'active_cases'; // cumulative_cases, cumulative_recovered, active_cases

var configCache, dataCache, id, height, width, x, y, yScaleMetric;
var yTicks = 5;
var opacity = 0.5;
var margin = {
  top: 10,
  right: 20,
  bottom: 25,
  left: 55
};

var area_chart_addLabels = function addLabels(svg, config, data) {
  config.chart_variables.forEach(function (d) {
    // not every province had deaths
    if (data[data.length - 1].cumulative_deaths < 1 && d === 'cumulative_deaths') {
      return;
    } // get the bounding box for the area charts to position the labels 


    var bbox = d3["i" /* select */](".".concat(d, " path")).node().getBBox();
    var xPos = width * 0.925;
    var yPos = height - bbox.height / 1.75;
    var label = d.replace('cumulative_', '').replace('_cases', ''); // magical repositioning so the labels fit somewhat well...

    if (label === 'active') {
      xPos = width - bbox.width / 2.75;
      yPos = height * 0.875;
    } else if (label === 'deaths') {
      xPos = width * 0.925;
      yPos = height * 0.9;
    } // place the text


    svg.append('text').text(label).attr('class', "".concat(label, " label")).attr('text-anchor', 'end').attr('x', xPos).attr('y', yPos);
  });
};

var area_chart_drawData = function drawData(svg, metric, i, data, config) {
  // prep variables for d3.area
  var variable = data.map(function (d) {
    d.value = parseInt(d[metric]);
    return function (_ref) {
      var date = _ref.date,
          value = _ref.value;
      return {
        date: date,
        value: value
      };
    }(d);
  }); // draw area charts

  svg.append('g').attr('class', "area ".concat(metric)).append('path').datum(variable).attr('stroke', config.fill_colours[i]).attr('stroke-width', 2).attr('opacity', 1).attr('fill', config.fill_colours[i]).attr('opacity', opacity).attr('d', d3["a" /* area */]().x(function (d) {
    return x(d.date);
  }).y0(y(0)).y1(function (d) {
    return y(d.value);
  })); // outline the areas

  svg.append('path').datum(variable).attr('fill', 'none').attr('stroke', config.fill_colours[i]).attr('stroke-width', 2).attr('d', d3["e" /* line */]().x(function (d) {
    return x(d.date);
  }).y(function (d) {
    return y(d.value);
  }));
};

var area_chart_parseDate = function parseDate(data) {
  return data.map(function (d) {
    d.date = d3["j" /* timeParse */]('%d-%m-%Y')(d.date_active);
  });
};

var area_chart_setupFooter = function setupFooter(config) {
  var footer = d3["i" /* select */](config.id).append('footer');
  footer.append('p').attr('class', 'source').text('SOURCE: ').append('a').attr('href', config.source_url).attr('target', '_blank').text(config.source_text);
  footer.append('p').attr('class', 'credit').text(config.credit);
};

var area_chart_setupHeader = function setupHeader(config, data) {
  // inset province name into deck
  var subhead = config.subhead.replace('PROV', data[0].province);
  var d = config.timestamp.split(' ')[0].split('-');
  var date = new Date(d[0], d[1] - 1, d[2]); // const date = new Date(config.timestamp.split(' ')[0].split('-'));

  var dateString = " ".concat(date.toLocaleString('default', {
    month: 'long'
  }), " ").concat(date.getDay(), ", ").concat(date.getFullYear(), "."); // add timestamp to deck

  subhead += dateString;
  d3["i" /* select */](config.id).append('header').append('h1').attr('class', 'headline').text(config.headline);
  d3["i" /* select */]("".concat(config.id, " header")).append('p').attr('class', 'subhead').html(subhead);
};

var setYScaleMetric = function setYScaleMetric(data) {
  var cases = parseInt(data[data.length - 1].active_cases);
  var recovered = parseInt(data[data.length - 1].cumulative_recovered);
  return recovered > cases ? 'cumulative_recovered' : 'active_cases';
};

var area_chart_ySetup = function ySetup(data) {
  return d3["g" /* scaleLinear */]().domain([0, d3["f" /* max */](data, function (d) {
    return parseInt(d[yScaleMetric]);
  })]).nice().range([height - margin.bottom, margin.top]);
};

var area_chart_xSetup = function xSetup(data) {
  return d3["h" /* scaleUtc */]().domain(d3["d" /* extent */](data, function (d) {
    return d.date;
  })).range([margin.left, width - margin.right]);
};

var area_chart_xAxis = function xAxis(g) {
  g.attr("transform", "translate(0, ".concat(height - margin.bottom, ")")).attr('class', 'x-axis').call(d3["b" /* axisBottom */](x).ticks(5).tickSizeOuter(0).tickFormat(d3["k" /* utcFormat */]('%b')));
};

var area_chart_yAxis = function yAxis(g) {
  g.attr("transform", "translate(".concat(margin.left, ",0)")).attr('class', 'y-axis').call(d3["c" /* axisLeft */](y).ticks(yTicks)).call(function (g) {
    return g.select(".domain").remove();
  }); // removed the line
};

var area_chart_yAxisGridlines = function yAxisGridlines(g) {
  g.attr("transform", "translate(".concat(margin.left, ",0)")).attr('class', 'gridline').call(d3["c" /* axisLeft */](y).ticks(yTicks).tickSize(-width + margin.left + margin.right).tickFormat('')).call(function (g) {
    return g.select(".domain").remove();
  }); // removed the line
};

var init = /*#__PURE__*/function () {
  var _ref2 = asyncToGenerator_default()( /*#__PURE__*/regenerator_default.a.mark(function _callee(data, config) {
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // setup
            id = config.id;
            dataCache = data;
            configCache = config; // sometimes actives_cases are higher than recovered. Set the yScale metric on the fly

            yScaleMetric = setYScaleMetric(data); // convert dates into something useful

            _context.next = 6;
            return area_chart_parseDate(data);

          case 6:
            area_chart_updateChart(data, config);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function init(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var area_chart_updateChart = function updateChart(data, config) {
  // headline & deck
  area_chart_setupHeader(config, data); // set height & width

  height = d3["i" /* select */](id).style('height').slice(0, -2) / 1.5 - margin.top - margin.bottom;
  width = d3["i" /* select */](id).style('width').slice(0, -2); // svg

  var svg = d3["i" /* select */](id).append('svg').attr('viewBox', [0, 0, width, height]); // .attr('width', width + margin.left + margin.right)
  // .attr('height', height + margin.top + margin.bottom);
  // Add axes

  x = area_chart_xSetup(data);
  y = area_chart_ySetup(data);
  svg.append('g').call(area_chart_xAxis);
  svg.append('g').call(area_chart_yAxis);
  svg.append('g').call(area_chart_yAxisGridlines); // draw data area 

  config.chart_variables.forEach(function (metric, i) {
    area_chart_drawData(svg, metric, i, data, config);
  }); // add labels

  area_chart_addLabels(svg, configCache, data); // don't forget the footer!

  area_chart_setupFooter(configCache);
};

window.addEventListener('resize', function () {
  var el = document.getElementById(id.replace('#', ''));

  if (el !== null) {
    el.innerHTML = '';
    area_chart_updateChart(dataCache, configCache);
  }
});

// CONCATENATED MODULE: ./src/index.js


// CSS



 // JS



 // VARS

var defaultPrCode = 'BC';
var dataUrl = 'https://storage.googleapis.com/vs-postmedia-data/covid-active-cases.json';

var src_init = /*#__PURE__*/function () {
  var _ref = asyncToGenerator_default()( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
    var prCode, resp, data;
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // pull 2digit province code from URL
            prCode = getPrCode(); // fetch & prep data

            _context.next = 3;
            return axios_default.a.get(dataUrl);

          case 3:
            resp = _context.sent;
            data = resp.data.results.filter(function (d) {
              return d.prov_code === prCode;
            }); // pass provineName into config

            data_config.province = data[0].province;
            data_config.timestamp = resp.data.timestamp;
            init(data, data_config);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

var getPrCode = function getPrCode() {
  var province;
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var prCode = urlParams.get('prov');
  return prCode ? prCode.toUpperCase() : defaultPrCode;
};

var prepData = /*#__PURE__*/function () {
  var _ref2 = asyncToGenerator_default()( /*#__PURE__*/regenerator_default.a.mark(function _callee2(d, prCode) {
    var data;
    return regenerator_default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // filter for selected province
            data = d.filter(function (d) {
              return d.prov_code === prCode;
            });
            return _context2.abrupt("return", data);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function prepData(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

src_init();

/***/ })

},[[98,1,2]]]);