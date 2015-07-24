var express = require('express');
var app = express();
var mongojs = require('mongojs');
var ObjectID = require('mongodb').ObjectID;
var db = mongojs('Looky',['knowledges', 'areas', 'subjects', 'degrees']);
var bodyParser = require('body-parser');
var async = require('async');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/knowledges/:idUser', function(req, res, next){

      var id = req.params.idUser;
      db.knowledges.find({idUser:id}, function (err, knowledges) {
        if(err)
            res.status(500).send(err);
        else if(knowledges){
            req.knowledge = knowledges;
            res.status(200).send(req.knowledge);
        }
        else
        {
            res.status(404).send('Nada encontrado');
        }
      });
});

app.post('/searchKnowledge', function(req, res){

      db.knowledges.find({name:req.body.name}, function (err, knowledges) {
        if(err)
            res.status(500).send(err);
        else if(knowledges){
            req.knowledge = knowledges;
            res.status(200).send(req.knowledge);
        }
        else
        {
            res.status(404).send('Nada encontrado');
        }
      });
});

app.get('/knowledges', function(req, res){
        db.knowledges.find(function(err, docs){
        res.json(docs);
    });
});


app.post('/knowledges', function(req, res){

     console.log(req.body);
     knowledge = req.body;
     var area = {};

     if(!knowledge.area._id || knowledge.area._id === 0 || knowledge.area._id === "undefined" ||  knowledge.area._id === null){
        db.areas.insert({
            name:knowledge.area.name
        }, function(err, docs){
            if(err){
                res.status(500)
                res.send(err);
            }
            else{
                area = docs;
                res.status(200);
                addKnowledge(area);
            }
        })
     }

     else{
        area = knowledge.area;
        addKnowledge(area);
     }

     function addKnowledge(area){
         db.knowledges.insert(
          {
            idUser: knowledge.idUser,
            name: knowledge.name,
            area: area.name,
            subject: knowledge.subject,
            degree: knowledge.degree
         }, function(err, doc){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(201);
                    res.send(doc);
                }
             }
)}});

app.get('/areas', function(req, res){

    var jsonOne,
        jsonTwo,
        concattedjson;

    async.series({

        areas: function(callback){
            db.areas.find(function(err, areas){
                callback(null, areas)
            });

          },
        subjects: function(callback){
             db.subjects.find(function(err, subjects){
                callback(null, subjects)
             });
          }
        },
        function(err, results){
            res.json(results);
        });
});

app.post('/areas', function(req, res){
        db.areas.insert({
            name: req.body.name,
        }, function(err, doc){
            res.status(201);
            res.send(doc)
        });
});

app.get('/degrees', function(req, res){
        db.degrees.find(function(err, docs){
        res.json(docs);
    });
});

app.post('/degrees', function(req, res){
        db.degrees.insert({
            name: req.body.name
        }, function(err, doc){
            res.status(201);
            res.send(doc)
        });
});

app.get('/subjects', function(req, res){
        db.subjects.find(function(err, docs){
            res.json(docs);
        });
});

app.post('/subjects', function(req, res){
        db.subjects.insert({
            name: req.body.name,
            degree: req.body.degree
        }, function(err, doc){
            res.status(201);
            res.send(doc)
        });
});

app.delete('/knowledges/:idUser/:idKnowledge', function(req, res){
    var id = req.params.idUser;
    var idKnowledge = req.params.idKnowledge;
    db.knowledges.remove({idUser:id, _id:ObjectID(idKnowledge)}, function (err, doc) {
        res.status(200);
        res.json(doc);
    });
});

app.listen(3000);
console.log("Server running on port 3000");