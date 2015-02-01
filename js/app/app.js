require([ 
		'lodash',
		'utils/bus',
		'workercontroller'
	], function(_, bus, workerCtrl){


	workerCtrl.loadWorker()
				.then(workerCtrl.showMostPopular)
				.then(workerCtrl.getSelectedSubject)
				.then(function(subject){
					workerCtrl.getStories(subject)
					bus.on('clickAnimationFinished', function(word){
						workerCtrl.showStories()
					})
				})
				
})
