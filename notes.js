# Main -- 
	
	shows loading animation
	spins up worker and hits with load message
	on first message, starts flashing keywords(interval, iterating through array that's being added to... or kefirstream spaced out!)
	on full list message, loads tags as collection bound to list view



#Resources.js -- worker!

	on load
		load module
		hits top stories api
		posts total results
		posts hash with first 20 keywords and counts
		posts hash with next 20 keywords and counts
		etc. until end. 
	
	on keyword 
		keyword module 
		hits article search api with keywords
		returns article text


store[keyword] = store[keyword] ? store[keyword]++ : 1
var topKeywords = _.keys(_.sort(store, ))
lazy.js to perform counting/sorting?


one collection -- subjects
one model --- subject (name, link)