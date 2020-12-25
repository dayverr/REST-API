//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const wikiSchema = {
  title: String,
  content: String
};

const Item = mongoose.model("article", wikiSchema);

app.route("/articles")

    .get(function(req,res){
        Item.find({}, function(err, finded){
            if(err){
                res.send(err);
            } else {
                res.send(finded);
            }
        })
    })

    .post(function(req,res){
        const newArt = new Item({
            title: req.body.title,
            content: req.body.content
        });
        newArt.save(function(err){
            if(!err){
                res.send("Sucsses add");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function(req,res){
        Item.deleteMany(function(err){
            if(!err){
                res.send("Sucsses delete");
            } else {
                res.send(err);
            }
        });
    });


app.route("/articles/:theOne")

    .get(function(req, res){
        Item.findOne({title: req.params.theOne}, function(err, founded){
            if(founded){
                res.send(founded)
            } else {
                res.send("No article found, error:  " + err);
            }
        })
    })

    .put(function(req, res){
        Item.updateOne(
            {title: req.params.theOne},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err, updated){
                if(!err){
                    res.send("udates succesesufaly");
                } else {
                    res.send("Problem error: " + err)
                }
            })
    })

    .patch(function(req,res){
        Item.updateOne(
            {title: req.params.theOne},
            {$set: req.body},
            function(err, updated){
                if(!err){
                    res.send("udates succesesufaly");
                } else {
                    res.send("Problem error: " + err)
                }
            })
    })

    .delete(function(req,res){
        Item.deleteOne({title: req.params.theOne},  function(err){
            if(!err){
                res.send("Sucsses delete");
            } else {
                res.send(err);
            }
        });
    });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});