// Authors: Cory Bateman and Kaylyn Duncan
// Due Date: 7/30/25
// CS491-Exercise 4 Main player_module.js

/**
 * Gets the player data for a specific player ID.
 * @param {number} player_id - The ID of the player whose data is to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the player data.
 * @throws {Error} - If there is an error during the retrieval process.
 */
export async function getPlayerData(player_id) {
  try {
    const response = await fetch(`/player/${player_id}`);
    if (!response.ok) throw new Error('Could not get player data.');
    const player_data = await response.json();
    return player_data;
  } catch (error) {
      console.error('Error getting player data:', error);
      throw error;
  }
}

/** * Updates the player data for a specific player ID.
 * @param {number} player_id - The ID of the player whose data is to be updated.
 * @param {Object} player - The player data to update.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the update process.
 */
export async function putPlayerData(player_id, player) {
  try {
    const response = await fetch(`/player/${player_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(player),
      keepalive: true,
    });
    if (!response.ok) throw new Error('Could not update player data.');
      return await response.text();
  } catch (error) {
      console.error('Error updating player data:', error);
      throw error;
  }
}

/** * Resets the player data for both players.
 * @returns {Promise<void>} - A promise that resolves when the player data is reset.
 * @throws {Error} - If there is an error during the reset process.
 */
export async function resetPlayerData() {
  try {
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
    await putPlayerData(1, player_1);
    await putPlayerData(2, player_2);
    return console.log('Player data reset successfully.');

  } catch (error) {
    console.error('Error resetting player data:', error);
    throw error;
  }
}

/** * Gets a specific attribute from the player data.
 * @param {number} player_id - The ID of the player whose attribute is to be retrieved.
 * @param {string} attribute - The attribute to retrieve from the player data.
 * @returns {Promise<any>} - A promise that resolves to the value of the requested attribute.
 * @throws {Error} - If there is an error during the retrieval process.
 */
export async function getPlayerAttribute(player_id, attribute) {
  try {
    const player = await getPlayerData(player_id);
    if (player && attribute in player) {
      return player[attribute];
    } else {
      throw new Error(`Attribute ${attribute} not found for player ${player_id}.`);
    }
  } catch (error) {
    console.error('Error getting player attribute:', error);
    throw error;
  }
}

/** * Updates a specific attribute in the player data.
 * @param {number} player_id - The ID of the player whose attribute is to be updated.
 * @param {string} attribute - The attribute to update in the player data.
 * @param {any} value - The new value for the specified attribute.
 * @returns {Promise<string>} - A promise that resolves to a success message.
 * @throws {Error} - If there is an error during the update process.
 */
export async function putPlayerAttribute(player_id, attribute, value) {
  try {
    const player = await getPlayerData(player_id);
    if (player && attribute in player) {
      player[attribute] = value;
      return await putPlayerData(player_id, player);
    } else {
      throw new Error(`Attribute ${attribute} not found for player ${player_id}.`);
    }
  } catch (error) {
    console.error('Error updating player attribute:', error);
    throw error;
  }
}
