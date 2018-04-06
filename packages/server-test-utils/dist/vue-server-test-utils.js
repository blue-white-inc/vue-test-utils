'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var testUtils = _interopDefault(require('@vue/test-utils'));
var Vue = _interopDefault(require('vue'));
var createInstance = _interopDefault(require('create-instance'));
var util = require('shared/util');
var vueServerRenderer = require('vue-server-renderer');
var mergeOptions = require('shared/merge-options');
var cheerio = _interopDefault(require('cheerio'));

var config = testUtils.config

// 

Vue.config.productionTip = false;
Vue.config.devtools = false;

function renderToString (component, options) {
  if ( options === void 0 ) options = {};

  var renderer = vueServerRenderer.createRenderer();

  if (!renderer) {
    util.throwError('renderToString must be run in node. It cannot be run in a browser');
  }
  // Remove cached constructor
  delete component._Ctor;

  if (options.attachToDocument) {
    util.throwError('you cannot use attachToDocument with renderToString');
  }
  var vueClass = options.localVue || testUtils.createLocalVue();
  var vm = createInstance(component, mergeOptions.mergeOptions(options, config), vueClass);
  var renderedString = '';

  // $FlowIgnore
  renderer.renderToString(vm, function (err, res) {
    if (err) {
      console.log(err);
    }
    renderedString = res;
  });
  return renderedString
}

// 

function render (component, options) {
  if ( options === void 0 ) options = {};

  var renderedString = renderToString(component, options);
  return cheerio.load('')(renderedString)
}

var index = {
  renderToString: renderToString,
  config: config,
  render: render
}

module.exports = index;
