// "use strict"
// let Set = require('./dbSet')
// let Article = Set.ArticleModel
// let q = Set.q
// let fs = Set.fs
//
// let clearPending = q.defer()
// let fillingPending = q.defer()
//
// Article.remove({}, () => {
//   clearPending.resolve()
// })
//
// clearPending.promise.then(() => {
//   console.log('end clearing')
//   let array = []
//   for (let i = 0; i < 100; i++) {
//     array.push(new Article({
//       title      : 'myTitle' + i,
//       description: 'myDescription' + i
//     }))
//   }
//   Article.create(array, () => {
//     console.log('save end')
//     fillingPending.resolve()
//   })
// })
//
// fillingPending.promise.then(() => {
//   Article.find(function (err, articles) {
//     if (!err) {
//       let file = fs.createWriteStream('array.txt');
//       file.on('error', function (err) {
//         console.log(err)
//       });
//       articles.forEach(function (v) {
//         file.write(v + '\n');
//       });
//       file.end();
//     } else  console.log(err.message)
//   })
// })







