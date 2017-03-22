"use strict";
var fs = require('fs')
let q = require('q')
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Test')
let db = mongoose.connection;

db.once('open', function callback() {
  console.log("Connected to DB!")
});

let Schema = mongoose.Schema
let Article = new Schema({
  title      : {type: String, required: true},
  description: {type: String, required: true},
})

let ArticleModel = mongoose.model('Article', Article)

module.exports.ArticleModel = ArticleModel
module.exports.q = q
module.exports.fs = fs
