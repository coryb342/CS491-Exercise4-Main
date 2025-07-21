const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.json());

app.use(express.static('public'));

//Player Endpoints
/** Gets the player data for a specific player ID.
 * @param {number} player_id - The ID of the player whose data is to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the player data.
 * @throws {Error} - If there is an error during the retrieval process.
 */
app.get('/player/:id', (req, res) => {
  const player_id = req.params.id; // e.g., "1", "2", etc.
  const file_path = path.join(__dirname, `player_${player_id}.json`);
  res.sendFile(file_path, err => {
    if (err) {
      res.status(404).send('Player file not found');
    }
  });
});

/** Updates the player data for a specific player ID.
 * @param {number} player_id - The ID of the player whose data is to be updated.
 * @param {Object} player - The player data to update.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the update process.
 */
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

//Coin Endpoints
/** Gets the current coin data.
 * @returns {Promise<Object>} - A promise that resolves to the coin data.
 * @throws {Error} - If there is an error during the retrieval process.
 */
app.get('/coin', (req, res) => {
  const file_path = path.join(__dirname, 'coin.json');
  res.sendFile(file_path, err => {
    if (err) {
      res.status(404).send('Coin file not found');
    }
  });
});

/** Updates the coin data.
 * @param {Object} coin - The coin data to update.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the update process.
 */
app.put('/coin', (req, res) => {
  const updated_coin_data = req.body;
  const file_path = path.join(__dirname, 'coin.json');
  fs.writeFile(file_path, JSON.stringify(updated_coin_data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Coin data updated successfully');
  });
});

//Game State Endpoints
/** Gets the current game state data.
 * @returns {Promise<Object>} - A promise that resolves to the game state data.
 * @throws {Error} - If there is an error during the retrieval process.
 */
app.get('/gamestate', (req, res) => {
  const file_path = path.join(__dirname, 'gamestate.json');
  res.sendFile(file_path, err => {
    if (err) {
      res.status(404).send('Game state file not found');
    }
  });
});

/** Updates the game state data.
 * @param {Object} gamestate - The game state data to update.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the update process.
 */
app.put('/gamestate', (req, res) => {
  const updated_gamestate_data = req.body;
  const file_path = path.join(__dirname, 'gamestate.json');
  fs.writeFile(file_path, JSON.stringify(updated_gamestate_data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Game state updated successfully');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
