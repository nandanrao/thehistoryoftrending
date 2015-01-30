define(['nyt/nyt.api', 'utils/bus', 'kefir', 'lodash', 'es6-promise'], function(nyt, bus, Kefir, _, es6p){
	var Promise = es6p.Promise;
	var stream = Kefir.emitter();

	var mostPopular = function(){
		nyt.mostPopular().then(function(obj){
		  var num = obj.num_results;
		  var promises = [];
		  for (var i=0; i < num; i += 20){
		  	promises.push(nyt.mostPopular(i).then(function(obj){
		  		return stream.emit(obj.results)
		  	}))
		  }
		  Promise.all(promises).then(function(results){
		  	stream.end()
		  })
		})
	}

	stream
		.flatten()
		.map(function(obj){
			return _.chain(obj)
								.pick(['des_facet', 'geo_facet', 'org_facet', 'per_facet'])
								.values()
								.flatten()
								.filter(function(a){
									return !!a
								})
								.countBy()
								.value()
		})
		.scan(_.partialRight(_.merge, function(next, prev){
				return !!next ? next + prev : next
		}))
		.map(function(obj){
			return _.chain(obj)
								.pick(function(v, k){
									return v > 4
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
		.filter(function(arr){
			return _.size(arr) > 0
		})
		.onValue(function(obj){
			bus.trigger('toUI', obj)
		})
		.onEnd(function(){
			bus.trigger('toUI', 'popular:end')
		})

	return mostPopular
})