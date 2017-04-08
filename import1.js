"use strict"
let fs = require('fs')
let JSONStream = require('JSONStream')
let mongodb = require('mongodb')
let MongoClient = mongodb.MongoClient
let dbName = process.argv.slice(2) // [dbName]

let url = 'mongodb://localhost:27017/' + dbName

MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err)
  } else {

    console.log('Connection established to', url);

    (async() => {

      let collectionNames = await db.listCollections().toArray()

      await db.dropDatabase()

      for (let i in collectionNames){

        let collectionName = collectionNames[i].name;

        let file = fs.createReadStream(collectionName + '.json', {flags: 'r', encoding: 'utf-8'})

        await new Promise((resolve) => {

          file.pipe(JSONStream.parse('*'))

            .on('data', async(d)=>{
              if(Object.keys(d).length){
                await db.collection(collectionName).insert(d)
              }
            })

            .on('end', resolve)
        })

      }

    })().then(db.close.bind(db))
  }
})