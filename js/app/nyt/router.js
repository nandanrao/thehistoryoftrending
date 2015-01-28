define(['utils/bus', 'nyt/mostpopular', 'nyt/allstories'], function(bus, mostPopular, allStories){

  var endpoints = {
    mostPopular: mostPopular,
    all: allStories
  };

  bus.on('fromUI', function(message){
    var components = message.split(/:/i)
    var route = components[0]
    var term = components[1]
    endpoints[route](term)
  })
})