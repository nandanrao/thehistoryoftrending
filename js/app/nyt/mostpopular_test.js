define(['squire', 'mocks/mockapi', 'lodash'], function(Squire, api, _){

	describe('mostPopular', function(){
		var injector,
				mostPopular,
				bus;

		beforeEach(function(done){
			bus = {
				trigger: jasmine.createSpy()
			};
 
			injector = new Squire();			
			injector 
				.mock('nyt/nyt.api', api)
				.mock('utils/bus', bus)
				.require(['nyt/mostpopular'], function(_mostPopular){
					mostPopular = _mostPopular
					done()
				})
		})

		describe('function', function(){
			
			it('calls the mostpopular method on the nyt.api module', function(){
				spyOn(api, 'mostPopular').and.callThrough()
				mostPopular();
				expect(api.mostPopular).toHaveBeenCalled()
			});

			it('posts the keywords from the results as word:count hash', function(done){
				mostPopular();
				setTimeout(function(){
					expect(bus.trigger.calls.allArgs()).toEqual(api.args)
					done()
				}, 0)
			})

			it('sends results to UI for every single call', function(done){
				var numberOfCalls = Math.round(899/20)
				mostPopular();
				setTimeout(function(){
					expect(bus.trigger.calls.count())
						.toEqual(numberOfCalls)
					done()
				}, 0)
			})

		})
	})
})