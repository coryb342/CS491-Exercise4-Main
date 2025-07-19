import * as player from './player_module.js';
import * as gamestate from './gamestate_module.js';

const player_id = null;
const board_size = 16;
const winning_combinations = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],

    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],

    [0, 5, 10, 15],
    [3, 6, 9, 12]
];

let polling = null;


/**
 * @typedef {Object} Player
  * @property {boolean} is_previous_winner - Indicates if the player was a previous winner.
  * @property {string} player_icon - The icon representing the player.
  * @property {string} player_name - The name of the player.
  * @property {Array} player_held_positions - The positions held by the player.
  * @property {string} coin_call - The call made by the player regarding the coin toss.
 */
const local_player = {
    "is_previous_winner": null,
    "player_icon": null,
    "player_name": null,
    "player_held_positions": [],
    "coin_call": null
}

