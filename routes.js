var gravatar = require('gravatar');


module.exports = function(app,io){


	var MongoClient = require('mongodb').MongoClient

    var URL = 'mongodb://localhost:27017/chat'

    MongoClient.connect(URL, function(err, db) {
      if (err) return
      var collection = db.collection('messages');

	app.get('/', function(req, res){
		res.render('chat');
	});

	var chat = io.on('connection', function (socket) {

		socket.on('load',function(data){
			var room = findClientsSocket(io,data);
			socket.emit('peopleinchat', {number: 0});

		});

		socket.on('login', function(data) {
			var room = findClientsSocket(io, data.id);

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				socket.emit('img', socket.avatar);

				socket.join(data.id);

				var usernames = [],
					avatars = [];

				usernames.push(socket.username);
				chat.in(data.id).emit('startChat', {
					boolean: true,
					id: data.id,
					users: usernames
				});
			});

		socket.on('switchRoom', function(newroom){
			socket.leave(socket.room);
			socket.join(newroom);
			socket.room = newroom;
		});

		socket.on('disconnect', function() {
			socket.leave(socket.room);
		});

		socket.on('oldmessage', function(data) {
			collection.find({id:data.id}).toArray(function(err, docs) {
				socket.emit('messages', {msg: docs});
				console.log(docs);
           	});
		});

		socket.on('msg', function(data){
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
			collection.insert({msg: data.msg, user: data.user, img: data.img, id:data.id}, function(err, result) {
			});
		});

	});
	});
};

function findClientsSocket(io,roomId, namespace) {
	var res = [],
		ns = io.of(namespace ||"/");

	if (ns) {
		for (var id in ns.connected) {
			if(roomId) {
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}
			else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}


