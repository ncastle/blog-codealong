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
  const filePath = articleFilePath(request.params.articleId);
  // send the file back to client from server
  response.sendFile(filePath);
})

// set up general route for article page
app.get('/articles/:articleId', (request, response) => {
  // get filepath
  const filePath = articleFilePath(request.params.articleId);
  // synchronously checks if the filepath exists in the file system
  if (fs.existsSync(filePath)) {
    const htmlFile = $path.join(publicDir, `article.html`);
    response.sendFile(htmlFile);
  } else {  // otherwise send a 404 status with a message
    response.status(404).send(`Article ${request.params.articleId} not found.`)
  }
});


// set up more specific route before the general route in order to work

// set up route for articles.json page
app.get('/articles.json', (request, response) => {
  const articles = allArticles();
  const data = JSON.stringify(articles);
  response.type('application/json').send(data);
})

// set up route for all articles page
app.get('/articles', (request, response) => {
  // join public directory with articles.html page and sendFile
  response.sendFile($path.join(publicDir, 'articles.html'));
});

// returns a sorted array of each article's json data
function allArticles() {
  return fs.readdirSync(articlesDir)  // read directory synchronously
    .filter(file => file.endsWith('.json')) // filter for files ending in .json
    .map(file => {
      const data = fs.readFileSync($path.join(articlesDir, file));
      return JSON.parse(data);
    })  // map each file to the parsed json
    .sort((a, b) => (a.id - b.id));   // sort based on article id
}

// set up route for publishing an article
app.get('/publish', (request, response) => {
  let htmlFile = $path.join(publicDir, "publish.html");
  response.sendFile(htmlFile);
});

// set up handler for form posting
app.post('/articles',
          express.urlencoded({extended: false}),
          (request, response) => {
            createArticle(nextArticleId(), request.body, response);
          });

// function to get next article id
function nextArticleId() {
  let articles = allArticles();

  // find the highest id
  let id = articles[articles.length - 1].id;

  // pick next id
  let articleId = id + 1;
  return articleId;
}
// note -> above function has a race condition and will sometimes fail when several clients attempt to create new articles simultaneously, but this is good enough for now. will fix later

// function to create a new article
function createArticle(articleId, params, response) {
  let article = {
    id: articleId,
    author: params.author.trim(),
    title: params.title.trim(),
    body: params.body.trim()
  };

  let articleDataFile = $path.join(articlesDir, `${articleId}.json`);
  fs.writeFile(articleDataFile, JSON.stringify(article), (err) => {
    if (err) {
      response.status(500).send(err);
    } else {
      response.redirect('/articles');
    }
  })
}

// tell app where to listen -> almost always goes on bottom of file
app.listen(port, () => console.log(`Blog app listening on port ${port}!`));