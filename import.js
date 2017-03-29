"use strict"
let fs = require('fs')
let q = require('q')
let JSONStream = require('JSONStream')
let mongodb = require('mongodb')
let MongoClient = mongodb.MongoClient
let data = process.argv.slice(2) // [fileName, dbName]

let url = 'mongodb://localhost:27017/' + data[1]

MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {

    console.log('Connection established to', url);


    (async() => {

      let collections = await db.listCollections().toArray()

      for (let i = 0; i < collections.length; i++) {
        let name = collections[i].name
        await db.collection(name).remove({})
      }

      let stream = fs.createReadStream(data[0], {flags: 'r', encoding: 'utf-8'})

      let array = []
      stream.pipe(JSONStream.parse('*'))
        .on('data', (d) => {
          array.push(d)
        })
        .on('end', async() => {
          console.log(array)
          for (let i = 0; i < array.length; i++) {
            if(array[i].collection.length){
              await db.collection(array[i].name).insert(array[i].collection)
            }
          }
          db.close()
        })
    })()
  }
})