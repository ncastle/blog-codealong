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

app.use(express.static('public'));
// tell app where to listen
app.listen(port, () => console.log(`Blog app listening on port ${port}!`));
