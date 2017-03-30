"use strict"
let fs = require('fs')
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;


let data = process.argv.slice(2) // [dbName, fileName]

let url = 'mongodb://localhost:27017/' + data[0];


MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {

    console.log('Connection established to', url);


    (async() => {

      let collections = await db.listCollections().toArray()

      let file = fs.createWriteStream(data[1])

      for (let i = 0; i < collections.length; i++) {
        let name = collections[i].name
        let collection = await db.collection(name).find().toArray()
        await file.write(JSON.stringify({
          name, collection
        }))
      }

      db.close()

    })()
  }
})


