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

    let array = Array(10).fill(null).map((x, i) =>
      ({
        title      : 'myTitle' + i,
        description: 'myDescription' + i
      })
    )

    collection.remove({}).then(() => collection.insert(array))
      .then(() => collection.find().toArray())

      .then((result) => {
        let file = fs.createWriteStream('array.json');
        file.write(JSON.stringify(result))
        db.close();
        file.end()
      })

      .then(() => {
        let stream = fs.createReadStream('array.json', {flags: 'r', encoding: 'utf-8'});
        stream.pipe(JSONStream.parse('*'))
          .on('data', (d) => console.log(d))
      })

  }
})
;