// nyt/nyt.api 

define(['nyt/key', 'utils/ajax'], function(key, ajax){

	var base = 'http://api.nytimes.com/svc/';

	var mostPopular = function(query){
		query = query ? 'offset=' + query + '&' : '';
		var path = base + 'mostpopular/v2/mostviewed/all-sections/30.json?'+ query + 'api-key=' + key.mostPopular;
		return ajax.get('/nyt/' + encodeURIComponent(path))
	};

	var allStories = function(keyword, offset){
		offset = offset || 0;
		var term = encodeURIComponent(keyword);
		var path = base
		+ 'search/v2/articlesearch.json?fq='
		+ 'organizations%3A%28%22' + term 
		+ '%22%29+OR+glocations%3A%28%22' + term 
		+ '%22%29+OR+persons%3A%28%22' + term 
		+ '%22%29+OR+subject%3A%28%22' + term 
		+ '%22%29&sort=newest'
		+	'&page=' + offset
		+ '&api-key=' + key.allStories;
		return ajax.get('/nyt/' + encodeURIComponent(path))
	};

	return {
		mostPopular: mostPopular,
		allStories: allStories
	}
})



