require([
		'requirejs-web-workers!nyt/worker.js', 
		'es6-promise', 
		'kefir', 
		'lodash',
		'jsx!uiview',
		'utils/bus'
	], function(worker, promise, Kefir, _, UIView, bus){

	var Promise = promise.Promise

	worker.onerror = function(err){
		alert('oops, we had a problem, please reload the page and try again!')
		throw new Error(err)
	}

	var workerLoaded, workerLoadedResolve;
	workerLoaded = new Promise(function(resolve, reject){
		workerLoadedResolve = resolve;
	})

	worker.addEventListener('message', workerLoadedResolve)

	workerLoaded.then(function(){ 
		worker.removeEventListener('message', workerLoadedResolve)
		worker.postMessage('mostPopular')
		worker.addEventListener('message', receiveMostPopular)


		var mostPopularStream = Kefir.emitter();
		function receiveMostPopular(e){
			if (e.data === 'popular:end'){
				mostPopularStream.end()
				worker.removeEventListener('message', receiveMostPopular)
			}
			else {
				mostPopularStream.emit(e.data)
			}
		};

		var prop = mostPopularStream.toProperty();
		prop
			.flatMapConcat(function(x) {
			  return Kefir.later(2, x)
			})
			.onValue(function(val){
				UIView.subjects(val, false)
			})
			.onEnd(function(obj){
				prop.onValue(function(val){ 
					UIView.subjects(val, true)
				})
			})
	})

	bus.on('selected', function(word){
		getStories(word)
	})

	function getStories(subject){

		worker.postMessage('allstories:' + subject)
		worker.addEventListener('message', recieveArticles)

		var allStoriesStream = Kefir.emitter();
		function recieveArticles(e){
			if (e.data === 'allstories:end'){
				allStoriesStream.end()
				worker.removeEventListener('message', recieveArticles)
			}
			else {
				allStoriesStream.emit(e.data)
			}
		}

		var prop = allStoriesStream
		prop
			.onValue(function(val){
				UIView.articles(val)
			})
		
	}


})
