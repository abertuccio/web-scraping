
const  express = require('express');
const app = express();
const jsonImages = require("./getJsonImages");

app.get('/', function (req, res) {
  res.send('tranki, anda ;)');
});

app.get('/get-images', async function (req, res) {
    //ejemplo: localhost:3000/get-images?page=google&q=heladera

    let page = req.query.page;
    let searchTerm = req.query.q;

    var getJson = jsonImages.searchMethod(page)

    var result = await getJson(searchTerm)

    res.send(result);
  });


app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

