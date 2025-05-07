const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let users = [
  { id: 1, name: 'Admin', email: 'admin@anichin.co.id' }
];

let series = [
  { id: 1, title: 'Martial Master', status: 'ongoing', episodes: 544 },
  { id: 2, title: 'Spirit Sword Sovereign', status: 'ongoing', episodes: 493 }
];

let episodes = [
  { id: 1, title: 'Martial Master', episode: 544, status: 'published', date: new Date() },
  { id: 2, title: 'Spirit Sword Sovereign', episode: 493, status: 'draft', date: new Date() }
];
