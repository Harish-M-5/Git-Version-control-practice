const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Quiz questions (no DB)
const questions = [
  {
    question: "What is the most popular sport throughout the world?",
    options: ["Soccer", "Basketball", "Cricket", "Badminton"],
    answer: "Soccer"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars"
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Einstein", "Tesla", "Edison"],
    answer: "Einstein"
  }
];

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/style.css') {
    const cssPath = path.join(__dirname, 'style.css');
    fs.readFile(cssPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else if (req.url === '/script.js') {
    const jsPath = path.join(__dirname, 'script.js');
    fs.readFile(jsPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
  } else if (req.url === '/questions') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(questions));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
