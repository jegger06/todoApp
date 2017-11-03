const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://test:test@ds147265.mlab.com:47265/todo');

// Create a schema
var todoSchema = new mongoose.Schema({
	item: String
});

var Todo = mongoose.model('Todo', todoSchema);

const urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

	app.get('/todo', (req, res) => {
		// get data from mongodb and pass it to the view
		Todo.find({}, function(err, data) {
			if (err) throw err;
			res.render('todo', {todos: data});
		});
	});

	app.post('/todo', urlencodedParser, (req, res) => {
		// get data from the view and add it to mongodb
		var newTodo = Todo(req.body).save(function(err, data) {
			if (err) throw err;
			res.json(data);
		});
	});

	app.delete('/todo/:item', (req, res) => {
		// delete the requested item from mongodb
		Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove(function(err, data) {
			if (err) throw err;
			res.json(data);
		});
	});

};