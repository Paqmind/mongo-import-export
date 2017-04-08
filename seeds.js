"use strict"
let fs = require('fs')
let JSONStream = require('JSONStream')
let mongodb = require('mongodb')
let MongoClient = mongodb.MongoClient

let url = 'mongodb://localhost:27017/Test'

MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {

    console.log('Connection established to', url);

    (async() => {

      let collections = ['Feeds', 'Articles'];
      await db.dropDatabase()

      for (let i in collections) {

        let collection = db.collection(collections[i]);

        for (let j = 0; j < 10; j++) {

          await collection.insert({
            field1: collections[i] + 'field1' + j,
            field2: collections[i] + 'field2' + j
          })

        }
      }

    })().then(db.close.bind(db))
  }
})