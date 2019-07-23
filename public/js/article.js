// get article id from URL / pathname
let articleId = document.location.pathname.split('/').splice(-1);

// fetch article json
fetch(`/articles/${articleId}.json`)
  .then(response => response.json())
  .then(fillArticle);

// function to fill article.html with content
function fillArticle(article) {
  // target each element and fill with article content
  document.getElementById('title').textContent = article.title;
  document.getElementById('author').textContent = article.author;
  document.getElementById('body').textContent = article.body;
}