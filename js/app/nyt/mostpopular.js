define(['nyt/nyt.api', 'utils/bus', 'kefir', 'lodash', 'es6-promise'], function(nyt, bus, Kefir, _, es6p){
	var Promise = es6p.Promise;
	var stream = Kefir.emitter();

	var mostPopular = function(){
		nyt.mostPopular().then(function(obj){
		  stream.emit(obj.results)
		  var num = obj.num_results;
		  var promises = [];
		  for (var i=20; i < num; i += 20){
		  	promises.push(nyt.mostPopular(i).then(function(obj){
		  		return stream.emit(obj.results)
		  	}))
		  }
		  Promise.all(promises).then(function(results){
		  	bus.trigger('toUI', 'popular:end')
		  })
		})
	}

	stream
		.map(function(results){
			return _.chain(results)
								.map(function(result){
									return []
													.concat(result.des_facet)
													.concat(result.geo_facet)
													.concat(result.org_facet)
													.concat(result.per_facet)
								})
								.flatten()
								.filter(function(a){
									return !!a
								})
								.countBy()
								.value()
		})
		.filter(function(obj){
			return _.size(obj) > 0
		})
		.onValue(function(obj){
			bus.trigger('toUI', obj)
		})

	return mostPopular
})