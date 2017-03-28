"use strict"
let fs = require('fs')
let JSONStream = require('JSONStream');
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/Test';

MongoClient.connect(url, function (err, db) {

  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {

    console.log('Connection established to', url);

    let collection = db.collection('posts');

    let array = Array(2).fill(null).map((x, i) =>
      ({
        title      : 'myTitle' + i,
        description: 'myDescription' + i
      })
    )

    let main = async() => {

      await collection.remove({})

      await collection.insert(array)

      let res = await collection.find().toArray()

      let file = fs.createWriteStream('array.json');

      await file.write(JSON.stringify(res))

      await collection.remove({})

      let stream = fs.createReadStream('array.json', {flags: 'r', encoding: 'utf-8'});

      stream.pipe(JSONStream.parse('*'))
        .on('data', async(d) => {

          console.log(d)

          await collection.insert(d)

          let res1 = await collection.find().toArray()

          db.close();

          console.log(res1)
        })
    }

    main();

  }
})
