// Users API
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Series API
app.get('/api/series', (req, res) => {
  res.json(series);
});

app.post('/api/series', (req, res) => {
  const newSeries = { id: series.length + 1, ...req.body };
  series.push(newSeries);
  res.status(201).json(newSeries);
});

// Episodes API
app.get('/api/episodes', (req, res) => {
  res.json(episodes);
});

app.post('/api/episodes', (req, res) => {
  const newEpisode = { id: episodes.length + 1, ...req.body, date: new Date() };
  episodes.push(newEpisode);
  res.status(201).json(newEpisode);
});

// Start server
app.listen(port, () => {
  console.log(`Backend API server running at http://localhost:${port}`);
});
