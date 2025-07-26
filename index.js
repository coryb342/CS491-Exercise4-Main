// Authors: Cory Bateman and Kaylyn Duncan
// Due Date: 7/30/25
// CS491-Exercise 4 Main index.js

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

/** Resets the player data for both players.
 * @returns {Promise<void>} - A promise that resolves when the player data is reset.
 * @throws {Error} - If there is an error during the reset process.
 */
app.post('/player/reset', (req, res) => {
  const player_1 = {
    "is_previous_winner": false,
    "player_icon": "O",
    "player_name": "Player 1",
    "player_held_positions": [],
    "ack_win": false
  };
  const player_2 = {
    "is_previous_winner": false,
    "player_icon": "X",
    "player_name": "Player 2",
    "player_held_positions": [],
    "ack_win": false
  };
  const file_path_1 = path.join(__dirname, 'player_1.json');
  const file_path_2 = path.join(__dirname, 'player_2.json');
  fs.writeFile(file_path_1, JSON.stringify(player_1), (err) => {
    if (err) {
      console.error('Error writing player 1 file:', err);
      return res.status(500).send('Internal Server Error');
    }
    fs.writeFile(file_path_2, JSON.stringify(player_2), (err) => {
      if (err) {
        console.error('Error writing player 2 file:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(200).send('Player data reset successfully');
    });
  });
});

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

/** Resets the coin data.
 * @returns {Promise<void>} - A promise that resolves when the coin data is reset.
 * @throws {Error} - If there is an error during the reset process.
 */
app.post('/coin/reset', (req, res) => {
  const coin_data = {
    "coin_1": null,
    "coin_2": null
  };
  const file_path = path.join(__dirname, 'coin.json');
  fs.writeFile(file_path, JSON.stringify(coin_data), (err) => {
    if (err) {
      console.error('Error writing coin file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Coin data reset successfully');
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

/** Resets the game state data.   
 * @param {Object} gamestate_data - The game state data to reset. 
 * @return {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the reset process.
 * */
app.post('/gamestate/reset', (req, res) => {
  const gamestate_data = {
    "status": "coin_flip",
    "isGameOver": false,
    "currentPlayer": 1,
    "winner": "",
    "winning_combo": [],
    "player_1_assigned": false,
    "player_2_assigned": false
  };
  const file_path = path.join(__dirname, 'gamestate.json');
  fs.writeFile(file_path, JSON.stringify(gamestate_data), (err) => {
    if (err) {
      console.error('Error writing game state file:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Game state data reset successfully');
  });
}); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
