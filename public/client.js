import * as player_module from './player_module.js';
import * as gamestate_module from './gamestate_module.js';

const player_id = null;
let polling = null;

/**
 * @typedef {Object} Player
  * @property {boolean} is_previous_winner - Indicates if the player was a previous winner.
  * @property {string} player_icon - The icon representing the player.
  * @property {string} player_name - The name of the player.
  * @property {Array} player_held_positions - The positions held by the player.
  * @property {string} coin_call - The call made by the player regarding the coin toss.
 */
const player = {
    "is_previous_winner": null,
    "player_icon": null,
    "player_name": null,
    "player_held_positions": [],
    "coin_call": null
}

