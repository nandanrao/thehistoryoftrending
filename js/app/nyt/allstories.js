// nyt/allstories

define(['nyt/nyt.api', 'kefir', 'lodash', 'utils/bus'], function(nyt, Kefir, _, bus){

	var stream = Kefir.emitter();

	var allStories = function(keyword){
		nyt.allStories(keyword).then(function(obj){
			
			var num = obj.response.meta.hits;
			var promises = [];
			callAllStories();

			// Buffers the story api calls to keep under API usage limits
			function callAllStories(i){
				i = i ? i += 10 : 10;
				promises.push(nyt.allStories(keyword, i/10).then(function(obj){
					if (obj.response && obj.response.docs){
						stream.emit(obj.response.docs)	
					}
				}));
				if (i > num || i > 200){
					beginningOfTheEnd()
					return 
				}
				setTimeout(callAllStories.bind(this, i), 100)	
			}

			// Promises array is all filled, so end the stream when it's resolved
			function beginningOfTheEnd(){
				Promise.all(promises).then(function(results){
					stream.end()
				})	
			}
		})
	}

	stream
		.map(function(docs){
			return _.chain(docs)
								.map(_.partialRight(_.pick, [
										'headline', 
										'abstract', 
										'snippet', 
										'pub_date', 
										'news_desk',
										'byline',
										'web_url',
										'_id',
										'keywords'
									]))
								.map(function(obj){
									obj.text = obj.abstract || obj.snippet;
									delete obj.abstract;
									delete obj.snippet;
									obj.keywords = _.map(_.pluck(obj.keywords, 'value'));
									obj.headline = obj.headline.main;
									obj.byline = obj.byline.original;
									return obj
								})
								.value();
		})
		.onValue(function(obj){
			console.log(obj)
			// bus.trigger('toUI', obj)
		})
		.onEnd(function(){
			bus.trigger('toUI', 'allstories:end')
		})
	return allStories
})

// {
// 	headline(headline.main):
// 	abstract:
// 	snippet:
// 	pub_date:
// 	news_desk:
// 	byline (byline.original):
// 	web_url:
// 	_id:
// }