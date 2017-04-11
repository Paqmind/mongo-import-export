"use strict"
let FS = require('fs')
let JSONStream = require('JSONStream')
let mongodb = require('mongodb')
let MongoClient = mongodb.MongoClient
let {Readable} = require("stream")
let {Stringifier, Parser} = require("newline-json")


let stringifier = new Stringifier()
let parser = new Parser()


let dbName = process.argv.slice(2) // [dbName]

let url = 'mongodb://localhost:27017/' + dbName

MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {

    console.log('Connection established to', url);

    ;(async() => {
      // TODO take collectionNames from scheme.json
      let collectionNames = (await db.listCollections().toArray()).map(x => x.name)

      for (let collectionName of collectionNames) {
        let collection = db.collection(collectionName)
        await collection.remove();
        await new Promise((resolve) => {
          let file = FS.createReadStream(collectionName + ".log")
          file.pipe(parser).on("data", d => collection.insert(d))
          file.on("end", resolve)
        })
      }
    })().then(db.close.bind(db))
  }
})