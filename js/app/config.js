require.config({
	baseUrl: 'js/app',
	shim: {
		'RainbowVis-JS': {
			exports: 'Rainbow'
		}
	},
	paths: {
		backbone: '../lib/bower_components/backbone/backbone',
		jquery: '../lib/bower_components/jquery/dist/jquery',
		lodash: '../lib/bower_components/lodash/lodash',
		requirejs: '../lib/bower_components/requirejs/require',
		underscore: '../lib/bower_components/underscore/underscore',
		squire: '../lib/bower_components/squire/src/Squire',
		'requirejs-web-workers': '../lib/bower_components/requirejs-web-workers/src/worker',
		kefir: '../lib/bower_components/kefir/dist/kefir',
		fetch: '../lib/bower_components/fetch/fetch',
		'es6-promise': '../lib/bower_components/es6-promise/promise',
		react: '../lib/bower_components/react/react-with-addons',
		JSXTransformer: '../lib/bower_components/react/JSXTransformer',
		jsx: '../lib/bower_components/requirejs-react-jsx/jsx',
		text: '../lib/bower_components/requirejs-text/text',
		'RainbowVis-JS': '../lib/bower_components/RainbowVis-JS/rainbowvis',
		'react-tween-state': '../lib/bower_components/react-tween-state/index-bower'
	},
	packages: [

	],
	jsx: {
		fileExtension: '.jsx'
	}
});