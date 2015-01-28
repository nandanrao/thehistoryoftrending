importScripts('../../lib/bower_components/requirejs/require.js');
importScripts('../config.js');

require({baseUrl: '../'}, ['utils/bus', 'nyt/router'],	function(bus) {

	postMessage('loaded');

  self.onmessage = function(e){
    bus.trigger('fromUI', e.data);
	}

  bus.on('toUI', function(payload){
    postMessage(payload)
  })

});
