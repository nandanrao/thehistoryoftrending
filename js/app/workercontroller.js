define([
	'es6-promise', 
	'requirejs-web-workers!nyt/worker.js',
	'jsx!uiview',
	'utils/bus'
	], function(es6p, worker, UIView, bus){

		var Promise = es6p.Promise;
		var dontShowStories = true;
		var workerCtrl = {};
		var workerLoaded, 
				workerLoadedResolve;

		workerLoaded = new Promise(function(resolve, reject){
			workerLoadedResolve = resolve;
			worker.addEventListener('message', workerLoadedResolve)
		})

		workerCtrl.loadWorker = function(){
			return workerLoaded
				.then(function(){
					worker.removeEventListener('message', workerLoadedResolve)
				})
		}

		workerCtrl.showMostPopular = function(){
			return new Promise(function(resolve, reject){
				worker.postMessage('mostPopular')
				worker.addEventListener('message', receiveMostPopular)
				var mostPopularStream = Kefir.emitter();

				function receiveMostPopular(e){
					if (/:end/.test(e.data)){
						return mostPopularStream.end()
					}
					mostPopularStream.emit(e.data)
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
						worker.removeEventListener('message', receiveMostPopular)
						prop.onValue(function(val){ 
							UIView.subjects(val, true)
							resolve()
						})
					})
					.onError(function(err){
						reject(err)
					})
			})
		}

		workerCtrl.getSelectedSubject = function(){
			return new Promise(function(resolve, reject){
				bus.on('selected', function(subject){
					resolve(subject)
				})	
			})
		}

		

		workerCtrl.getStories = function(subject){
			return new Promise(function(resolve, reject){				
				var allStoriesStream = Kefir.emitter();
				worker.postMessage('allstories:' + subject)
				worker.addEventListener('message', recieveArticles)

				function recieveArticles(e){
					if (/:end/.test(e.data)){
						allStoriesStream.end()
					}
					else {
						allStoriesStream.emit(e.data)
					}
				}

				var prop = allStoriesStream.toProperty()
				prop
					.filter(function(results){
						return dontShowStories ? false : results
					})
					.onValue(function(val){
						console.log('render stories')
						UIView.articles(val)
					})
					.onEnd(function(){
						worker.removeEventListener('message', recieveArticles)
						resolve()
					})
			})
		}

		workerCtrl.showStories = function(){
			dontShowStories = false;
		}

		worker.onerror = function(err){
			alert('oops, we had a problem, please reload the page and try again!')
			throw new Error(err)
		}

		return workerCtrl
})