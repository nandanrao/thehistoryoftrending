define(['nyt/nyt.api', 'utils/bus', 'kefir', 'lodash', 'es6-promise'], function(nyt, bus, Kefir, _, es6p){
	var Promise = es6p.Promise;
	var stream = Kefir.emitter();

	var mostPopular = function(){
		nyt.mostPopular().then(function(obj){
		  var num = obj.num_results;
		  var promises = [];
		  var queries = {};
		  for (var i=0; i < num; i += 20){
		  	queries[i] = true
		  }

		  getMostPopular(queries)
		  	.then(function(results){
			  	stream.end()
			  })
			  .catch(function(err){
			  	throw new Error(err)
			  })  	
		  
		  function getMostPopular(queries){
		  	return new Promise(function(resolve, reject){
		  		var arr = _.keys(queries)
			  	Kefir.sequentially(100, arr)
		  	  	.flatMapConcat(function(i) {
		  			  return Kefir.later(110, i)
		  			})
		  	  	.onValue(function(i){
		  	  		makeRequest(i)
		  		  })

			  	function makeRequest(i){
			  		nyt.mostPopular(i)
			  			.then(function(obj){
			  				stream.emit(obj.results)
			  				checkItOff(i)
			  			})
			  			.catch(function(err){
			  				if (/developer|timeout/i.test(err)){
			  					console.log(err)
				  				_.delay(makeRequest(i), 100)
				  			}
				  			else {
				  				reject(err)
				  			}
			  			})
			  	}

			  	function checkItOff(i){
			  		delete queries[i]
			  		if (_.size(queries) === 0){
			  			resolve()
			  		}
			  	}		  
		  	})
		  }
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