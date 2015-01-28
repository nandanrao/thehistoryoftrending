define(['kefir'], function(Kefir){
	var streams = {};
	var bus = {};

	bus.on = function(name, cb){
		streams[name] = streams[name] || Kefir.emitter();
		streams[name].onValue(cb)
	};

	bus.off = function(name, cb){
		streams[name] = streams[name] || Kefir.emitter();
		streams[name].offValue(cb)
	};

	bus.trigger = function(name, msg){
		streams[name] = streams[name] || Kefir.emitter();
		streams[name].emit(msg)
	};
	
	return bus
}) 