require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.use(bodyParser.urlencoded({ extended: false }));

let urls = [];
let id = 1;

// POST: shorten URL
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const hostname = urlParser.parse(originalUrl).hostname;

  // Validate URL
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    let shortUrl = id++;
    urls[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urls[shortUrl];

  if (!originalUrl) {
    return res.json({"error":"No short URL found for the given input"});
  }

  res.redirect(originalUrl);
});










app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
