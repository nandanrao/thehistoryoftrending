var express = require('express'),
		app = express(),
		needle = require('needle'),
		bodyParser = require('body-parser');

app.use(express.static(__dirname + ''))
app.use(bodyParser.json());


app.get('/nyt/:fwd', function(req, res, next){
	needle.get(req.params.fwd, function(err, resp){
		res.json(resp.body)
	})
})

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'))