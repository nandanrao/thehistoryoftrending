require([
		'backbone', 
		'requirejs-web-workers!nyt/worker.js', 
		'es6-promise', 
		'kefir', 
		'lodash'
	], function(backbone, worker, promise, Kefir, _){

	var Promise = promise.Promise

	var workerLoaded, workerLoadedResolve;
	workerLoaded = new Promise(function(resolve, reject){
		workerLoadedResolve = resolve;
	})

	worker.onmessage = function(e){
		if (e.data === 'loaded') {
			workerLoadedResolve()
		}
	}

	window.allStories = function(keyword){
		worker.postMessage('all:' + keyword)
	}

	workerLoaded.then(function(){ 

		var stream = Kefir.emitter()

		// worker.postMessage('mostPopular')

		worker.onmessage = function(e){
			if (e.data === 'popular:end'){
				stream.end()
			}
			else {
				stream.emit(e.data)
			}
		}

		stream
			.onEnd(function(){
				console.log('stream end')
			})
			.onValue(function(obj){
				console.log(obj)
				
			})

		var totals = stream
										.reduce(function(a,b){
											return _.merge(a, b, function(a, b){
												return a + b
											})
										})
										.map(function(obj){
											return _.chain(obj)
																.pick(function(v, k){
																	return v > 1
																})
																.map(function(v,k){
																	return {
																		word: k,
																		count: v
																	}
																})
																.sortBy(function(obj){
																	return -obj.count
																})
																.value()
										})
										.onValue(function(obj){
											console.log('reduced', obj)
										})
	})
})
