const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static('public'));

app.get('/player/:id', (req, res) => {
  const player_id = req.params.id; // e.g., "1", "2", etc.
  const file_path = path.join(__dirname, `player_${player_id}.json`);
  res.sendFile(file_path, err => {
    if (err) {
      res.status(404).send('Player file not found');
    }
  });
});

app.put('/player/:id', (req, res) => {
  const player_id = req.params.id;
  const updated_player_data = req.body;
  const file_path = path.join(__dirname, `player_${player_id}.json`);
  fs.writeFile(file_path, JSON.stringify(updated_player_data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Player data updated successfully');
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
