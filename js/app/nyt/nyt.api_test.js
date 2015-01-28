define(['squire', 'lodash'], function(Squire, _){


	describe('api', function(){
		var injector,
				ajax,
				api;

		var keyMock = {
			mostPopular: 'sample-key',
			allStories: 'sample-key',
		};
		var offset = 10;
		var base = '/nyt/';
		var noOffsetPath = base + encodeURIComponent('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json?api-key=' + keyMock.mostPopular);
		var offsetPath = base + encodeURIComponent('http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json?offset=' + offset + '&api-key=' + keyMock.mostPopular);

		var charlieHebdoInitialPath = base + encodeURIComponent('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=organizations%3A%28%22CHARLIE%20HEBDO%22%29+OR+glocations%3A%28%22CHARLIE%20HEBDO%22%29+OR+persons%3A%28%22CHARLIE%20HEBDO%22%29+OR+subject%3A%28%22CHARLIE%20HEBDO%22%29&sort=newest&page=0&api-key=' + keyMock.allStories)
		var charlieHebdoOffsetPath = base + encodeURIComponent('http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=organizations%3A%28%22CHARLIE%20HEBDO%22%29+OR+glocations%3A%28%22CHARLIE%20HEBDO%22%29+OR+persons%3A%28%22CHARLIE%20HEBDO%22%29+OR+subject%3A%28%22CHARLIE%20HEBDO%22%29&sort=newest&page=' + offset + '&api-key=' + keyMock.allStories)

		beforeEach(function(done){
 
			ajax = {
				get: function(){},
			}
 
			injector = new Squire();			
			injector
				.mock('utils/ajax', ajax)
				.mock('nyt/key', keyMock)
				.require(['nyt/nyt.api'], function(_api){
					api = _api
					done()
				})
		}) 

		describe('mostPopular', function(){
			
			it('when called without an offset, it makes a get request without an offset', function(){
				spyOn(ajax, 'get')
				api.mostPopular()
				expect(ajax.get).toHaveBeenCalledWith(noOffsetPath)
			})

			it('when called with an offset, it makes a get request with that offset', function(){
				spyOn(ajax, 'get')
				api.mostPopular(offset)
				expect(ajax.get).toHaveBeenCalledWith(offsetPath)
			})

		})

		describe('allstories', function(){

			it('when called without an offset, it makes a get request without an offset', function(){
				spyOn(ajax, 'get')
				api.allStories('CHARLIE HEBDO')
				expect(ajax.get).toHaveBeenCalledWith(charlieHebdoInitialPath)

			})

			it('when called with an offset, it makes a get request with that offset', function(){
				spyOn(ajax, 'get')
				api.allStories('CHARLIE HEBDO', offset)
				expect(ajax.get).toHaveBeenCalledWith(charlieHebdoOffsetPath)
			})
		})

		

	})
})