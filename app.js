// Nick Castle - 7/23/19
// code follow along for a simple blog using react

// Server Setup:
// requires
const fs = require('fs');   // require filesystem package
const $path = require('path');
const express = require('express');

const app = express();  // set app to express
const port = process.env.PORT || 5000;  // set default port
const publicDir = $path.resolve('./public');
const articlesDir = $path.resolve('./articles');

// limits server to just the public directory
// like blacklisting everything but public
app.use(express.static('public'));

// viewing a single article (server-side)

// get the file path for a specific articleId
function articleFilePath(articleId) {
  return $path.join(articlesDir, `${articleId}.json`);
}

// set up route for articleId.json -> kind of like whitelisting
app.get('/articles/:articleId.json', (request, response) => {
  // get filepath using request.params
  let filePath = articleFilePath(request.params.articleId);
  // send the file back to client from server
  response.sendFile(filePath);
})

// set up general route for article page
app.get('/articles/:articleId', (request, response) => {
  // get filepath
  let filePath = articleFilePath(request.params.articleId);
  // synchronously checks if the filepath exists in the file system
  if (fs.existsSync(filePath)) {
    let htmlFile = $path.join(publicDir, `article.html`);
    response.sendFile(htmlFile);
  } else {  // otherwise send a 404 status with a message
    response.status(404).send(`Article ${request.params.articleId} not found.`)
  }
});

// tell app where to listen -> almost always goes on bottom of file
app.listen(port, () => console.log(`Blog app listening on port ${port}!`));