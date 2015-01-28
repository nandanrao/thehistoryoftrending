define(['squire'], function(Squire){

	describe('bus', function(){
		var injector,
				bus;

		beforeEach(function(done){
 
			injector = new Squire();			
			injector 
				.require(['utils/bus'], function(_bus){
					bus = _bus
					done()
				})
		})

		describe('subscribing/publishing', function(){
			
			it('publishes to subscribers', function(){
				var testMessage = 'testMessage'
				var callback = jasmine.createSpy();
				bus.on('test', callback);
				bus.trigger('test', testMessage)
				expect(callback).toHaveBeenCalledWith(testMessage)
			})
		})

		describe('unsubscribing', function(){
			it('unsubscribes via the off method', function(){
				var testMessage = 'testMessage';
				var callback = jasmine.createSpy();
				bus.on('test', callback);
				bus.off('test', callback)
				bus.trigger('test', testMessage)
				expect(callback).not.toHaveBeenCalled()
			})
		})
	})
})