define(['nyt/nyt.api', 'utils/bus', 'kefir', 'lodash'], function(nyt, bus, Kefir, _){

	function createQueryHash(num, chunkSize){
		var queries = {};
		for (var i=0; i < num; i += chunkSize){
			queries[i] = true;
		}
		return queries
	}

  function getMostPopularAsStream(num){
  	var stream = Kefir.emitter()
		var queries = createQueryHash(num, 20)
		Kefir
			.sequentially(125, _.keys(queries))
	  	.onValue(makeRequest)

	  return stream

  	function makeRequest(i){
  		nyt.mostPopular(i)
  			.then(function(obj){
  				stream.emit(obj.results)
  				checkItOff(i)
  			})
  			.catch(function(err){
  				if (/developer|timeout/i.test(err)){
	  				_.delay(makeRequest(i), 100)
	  			}
	  			else {
	  				stream.error(err)
	  			}
  			})
  	}

  	function checkItOff(i){
  		delete queries[i]
  		if (_.size(queries) === 0){
  			stream.end()
  		}
  	}
  }

  function formatAndSend(stream){
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
  }

	var mostPopular = function(){
		nyt.mostPopular()
			.then(function(obj){		  
		  	var num = obj.num_results;
		  	var responseStream = getMostPopularAsStream(num)
			  formatAndSend(responseStream)
			})
			.catch(function(err){
				console.log('Error in mostPopular initial call', err)
				throw new Error(err)
			})
	}

	return mostPopular
})