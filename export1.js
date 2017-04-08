let HL = require("highland")
let FS = require("fs")
let MongoDB = require("mongodb")
let MongoClient = MongoDB.MongoClient

let [dbName] = process.argv.slice(2)

let url = "mongodb://localhost:27017/" + dbName

  ;
(async() => {
  try {
    var db = await MongoClient.connect(url)
  } catch (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err)
    process.exit(1)
  }

  console.log("Connection established to", url)

  ;
  (async() => {

    let collectionNames = (await db.listCollections().toArray()).map(x => x.name)

    for (let collectionName of collectionNames) {

      let file = FS.createWriteStream(collectionName + ".json")

      await file.write('[')

      await new Promise((resolve) => {

        let s = db.collection(collectionName).find().stream({transform: JSON.stringify})

        HL(s).map((x) => {
          return x + ",\n"
        }).pipe(file)
        file.on('finish', resolve)

      })

      await FS.appendFile(collectionName + ".json", '{}]', function (err) {
        if (err) throw err;
      });

    }

  })().then(db.close.bind(db))

})()


