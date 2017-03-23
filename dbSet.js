"use strict"

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
    for (let i = 0; i < 100; i++) {
      array.push({
        title      : 'myTitle' + i,
        description: 'myDescription' + i
      })
    }

    let p1 = new Promise((resolve, reject) => {
      collection.insert(array, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
          resolve('res');
        }
      })
    })

    p1.then(() => {
      console.log('start')
      collection.find().toArray((err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
          console.log('Found:', result);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
        collection.remove({}, (err, result) => {
          db.close();
        })
      })
    })

  }
});