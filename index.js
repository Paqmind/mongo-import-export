"use strict"
let fs = require('fs')
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/Test';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {

    console.log('Connection established to', url);

    let collection = db.collection('posts');

    let array = []
    for (let i = 0; i < 3; i++) {
      array.push({
        title      : 'myTitle' + i,
        description: 'myDescription' + i
      })
    }

    collection.remove({}).then(() => {
      return collection.insert(array)
    })
      .then(() => {
        return collection.find().toArray()
      })
      .then((result) => {
        db.close();
        let file = fs.createWriteStream('array.txt');
        result.forEach(function (v) {
          file.write(JSON.stringify(v) + '\n');
        });
        file.end();
      })
  }
})
;