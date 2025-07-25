// Authors: Cory Bateman and Kaylyn Duncan
// Due Date: 7/30/25
// CS491-Exercise 4 Main client.js

import * as player from './player_module.js';
import * as gamestate from './gamestate_module.js';

/**
 * @typedef {Object} player
  * @property {boolean} is_previous_winner - Indicates if the player was a previous winner.
  * @property {string} player_icon - The icon representing the player.
  * @property {string} player_name - The name of the player.
  * @property {Array} player_held_positions - The positions held by the player.
  * @requires player_module.js
 */

/**
 * @typedef {Object} gamestate
  * @property {string} status - The current status of the game (e.g., 'coin_flip', 'playing').
  * @property {boolean} isGameOver - Indicates if the game is over.
  * @property {number} currentPlayer - The ID of the current player (1 or 2).
  * @property {string|null} winner - The winner of the game, or null if there is no winner yet.
  * @requires gamestate_module.js
 */

/**
 * @typedef {Object} coin
  * @property {string|null} coin_1 - The result of the first player's coin flip, or null if not flipped.
  * @property {string|null} coin_2 - The result of the second player's coin flip, or null if not flipped.
  * @requires gamestate_module.js
 */

let player_id = null;
let coin_id = null;

/** @const {number} board_size - The number of spaces on the board. */ 
const board_size = 16;

const control_button = document.getElementById('control-button');

/** @const {Array} winning_combinations - The winning combinations for a 4x4 board. */
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

let coin_polling = null;



// Game State Functions

/** 
 * * Flips a coin for the player and determines who goes first.
 * @returns {Promise<void>} - A promise that resolves when the coin flip is complete.
 * @throws {Error} - If there is an error during the coin flip process.
 */
async function flipCoin() {
    const flip = Math.random() < 0.5 ? 'heads' : 'tails';

    try {
        const coin_1_result = await gamestate.getCoinAttribute('coin_1');
        const coin_2_result = await gamestate.getCoinAttribute('coin_2');

        if (coin_1_result === null) {
            await gamestate.putCoinAttribute('coin_1', flip);
            coin_id = 1;
            console.log(`Coin 1 flipped: ${flip}`);
        } else if (coin_2_result === null) {
            await gamestate.putCoinAttribute('coin_2', flip);
            coin_id = 2;
            console.log(`Coin 2 flipped: ${flip}`);
        } else {
            console.log("Both players have already flipped.");
            return;
        }

        if (!coin_polling) {
            coin_polling = setInterval(monitorCoinFlips, 1000);
        }

    } catch (error) {
        console.error('Error flipping coin:', error);
        throw error;
    }
}

/** 
 * * Monitors the coin flips and determines which player goes first.
 * @returns {Promise<void>}
 * @throws {Error} - If there is an error during the monitoring process.
 */
async function monitorCoinFlips() {
    try {
        const coin_1_result = await gamestate.getCoinAttribute('coin_1');
        const coin_2_result = await gamestate.getCoinAttribute('coin_2');

        if (coin_1_result === null || coin_2_result === null) {
          return;
        }

        if (coin_1_result === coin_2_result) {
            console.log(`Both players flipped ${coin_1_result}. Reflipping...`);
            alert(`Both players flipped ${coin_1_result}. Reflip`);
            await gamestate.resetCoinData();
            clearInterval(coin_polling);
            coin_polling = null;
            return;
        }

        if ((coin_1_result === 'heads' && coin_id === 1) || 
            (coin_2_result === 'heads' && coin_id === 2)) {
            player_id = 1;
            console.log(`You go first!`);
            alert('You go first!');
        } else {
            player_id = 2;
            console.log(`Opponent goes first!`);
            alert('Opponent goes first!');
        }

        clearInterval(coin_polling);
        coin_polling = null;
        await gamestate.putGameStateAttribute('status', 'ready');

    } catch (error) {
        console.error('Error monitoring coin flips:', error);
        throw error;
    }
}

/**
 * Makes a move for the player in the game.
 * @param {number} index - The index of the position on the board where the player wants to make a move.
 * @returns {Promise<void>} - A promise that resolves when the move is made.
 * @throws {Error} - If there is an error during the move process.
 */
async function makeMove(index) {
  try {
    const player_positions = await player.getPlayerAttribute(player_id, 'player_held_positions');
    if (player_positions.includes(index)) {
      alert('This position is already taken. Please choose another.');  
      return; 
    }

    player_positions.push(index);
    await player.putPlayerAttribute(player_id, 'player_held_positions', player_positions);

    if(!await isWin()){
        await isDraw();
    }

    await gamestate.putGameStateAttribute('currentPlayer', player_id === 1 ? 2 : 1);

  } catch (error) {
      console.error('Error getting player positions:', error);
      throw error;
  }
}

/** * Checks if the current player has won the game.
 * @returns {Promise<boolean>} - A promise that resolves to true if the player has won, false otherwise.
 * @throws {Error} - If there is an error during the win check process.
 */
async function isWin() {
    try {
        const player_positions = await player.getPlayerAttribute(player_id, 'player_held_positions');
        const is_game_over = await gamestate.getGameStateAttribute('isGameOver');
        for (const combination of winning_combinations) {
            if (combination.every(index => player_positions.includes(index))) {
                let winner = player_id === 1 ? 'Player 1' : 'Player 2';
                await player.putPlayerAttribute(player_id, 'is_previous_winner', true);
                await gamestate.putGameStateAttribute('isGameOver', true);
                await gamestate.putGameStateAttribute('winner', winner);

                // Highlight winning cells
                combination.forEach(index => {
                    const cell = document.querySelector(`[data-index="${index}"]`);
                    cell.classList.add('winner');
                });
                return true
            }
        }
    } catch (error) {
        console.error('Error checking win:', error);
        throw error;
    }
    return false;
}

/** * Checks if the game is a draw.
 * @returns {Promise<boolean>} - A promise that resolves to true if the game is a draw, false otherwise.
 * @throws {Error} - If there is an error during the draw check process.
 */
async function isDraw() {
    try {
        const opponent_held_positions = await player.getPlayerAttribute(player_id === 1 ? 2 : 1, 'player_held_positions');
        const player_held_positions = await player.getPlayerAttribute(player_id, 'player_held_positions');
        if (player_held_positions.length + opponent_held_positions.length === board_size) {
            await gamestate.putGameStateAttribute('isGameOver', true);
            await gamestate.putGameStateAttribute('winner', 'Draw');
            return true;
        }
    } catch (error) {
        console.error('Error checking draw:', error);
        throw error;
    }
    return false;
}

async function handleGameState() {
    try {
        const current_status = await gamestate.getGameStateAttribute('status');
        const is_game_over = await gamestate.getGameStateAttribute('isGameOver');
        const winner = await gamestate.getGameStateAttribute('winner');
        if (is_game_over) {
          renderCurrentBoard();
          control_button.textContent = 'Clear';
          if (winner === 'Draw') {
              alert('Game Over! It\'s a draw!');
          } else {
              alert(`Game Over! ${winner} wins!`);
          }
          return;
        }

        if (current_status === 'coin_flip') {
          control_button.textContent = 'Flip';
          return;
        }

        if (current_status === 'playing') {
            renderCurrentBoard();
            control_button.textContent = 'Clear';
            control_button.disabled = false;
            return;
        } 

        if (current_status === 'ready') {
            control_button.textContent = 'Start';
            const currentPlayer = await gamestate.getGameStateAttribute('currentPlayer');
            if (currentPlayer === player_id) {
                control_button.disabled = false;
            } else {
                control_button.disabled = true;
            }
            return;
        }
    } catch (error) {
        console.error('Error handling game state:', error);
        throw error;
    }
}

async function handleControlButtonClick(button_value) {
    try {
        const winner = await gamestate.getGameStateAttribute('winner');
        if (button_value === 'Flip') {
            await flipCoin();
        } else if (button_value === 'Start') {
            await gamestate.putGameStateAttribute('status', 'playing');
        } else if (button_value === 'Clear' && (winner === "" || winner === 'Draw')) {
            await player.resetPlayerData();
            await gamestate.resetGameStateData();
            await gamestate.resetCoinData();
            renderEmptyBoard();
        } else if (button_value === 'Clear' && (winner !== "" && winner !== 'Draw')) {
            replayAfterWin();
        }
    } catch (error) {
        console.error('Error handling control button click:', error);
    }
}

async function replayAfterWin() {
    try {
        const is_previous_winner = await player.getPlayerAttribute(player_id, 'is_previous_winner');
        is_previous_winner ? player_id = 1 : player_id = 2;
        player_id = 1 ? alert('Since you won, you get to go first.') : alert('Since you lost, your opponent goes first.');
        await player.resetPlayerData();
        await gamestate.resetGameStateData();
        await gamestate.resetCoinData();
        renderEmptyBoard();
        gamestate.putGameStateAttribute('status', 'ready');
    } catch (error) {
        console.error('Error resetting game state and player data:', error);
    }
}

control_button.addEventListener('click', (event) => {
    handleControlButtonClick(event.target.textContent);
});


/**
 * Resetes the gamestate, player and coin data on window close
 */
addEventListener('beforeunload', async (event) => {
    try {
        await player.resetPlayerData();
        await gamestate.resetGameStateData();
        await gamestate.resetCoinData();
        console.log('Game state and player data reset successfully.');  
    } catch (error) {
        console.error('Error resetting game state and player data:', error);
    }
});


// UI Functions
/** * Handles the click event on a cell in the game board.
 * @param {number} index - The index of the cell that was clicked.
 * @returns {Promise<void>} - A promise that resolves when the cell click is handled.
 * @throws {Error} - If there is an error during the cell click handling process.
 */
async function handleCellClick(index){
    try {
        const currentPlayer = await gamestate.getGameStateAttribute('currentPlayer');
        if(currentPlayer !== player_id){
            alert("It's not your turn!");
            return;
        }

        const cell = document.querySelector(`[data-index="${index}"]`);
        if(cell.textContent !== ''){
            alert("That cell is already taken!");
            return;
        }

        // actually make the move
        await makeMove(index);

        // update UI
        const icon = local_player.player_icon || (player_id === 1 ? 'O' : 'X');
        cell.textContent = icon;
    } catch (err){
        console.error("Error handling cell click:", err);
    }
}

/** * Renders the game board in the UI.
 * @returns {void} - No return value.
 * @throws {Error} - If there is an error during the rendering process.
 */
function renderEmptyBoard(){
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board if any

    let index = 0;
    for(let row = 0; row < 4; row++){
        const tr = document.createElement('tr');

        for(let col = 0; col < 4; col++){
            const td = document.createElement('td');
            td.setAttribute('data-index', index);
            td.textContent = ''; // initially empty
            td.addEventListener('click', () => handleCellClick(index));
            tr.appendChild(td);
            index++;
        }

        boardElement.appendChild(tr);
    }

    console.log('Empty board rendered successfully.');

}

async function renderCurrentBoard(){
  try {
    const player_1_positions = await player.getPlayerAttribute(1, 'player_held_positions');
    const player_2_positions = await player.getPlayerAttribute(2, 'player_held_positions');

    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = ''; // Clear previous board if any

    let index = 0;
    for(let row = 0; row < 4; row++){
        const tr = document.createElement('tr');

        for(let col = 0; col < 4; col++){
            const td = document.createElement('td');
            td.setAttribute('data-index', index);

            if(player_1_positions.includes(index)){
                td.textContent = await player.getPlayerAttribute(1, 'player_icon');
            } else if(player_2_positions.includes(index)){
                td.textContent = await player.getPlayerAttribute(2, 'player_icon');
            } else {
                td.textContent = ''; // empty cell
            }
            td.addEventListener('click', () => handleCellClick(index));
            tr.appendChild(td);
            index++;
        }

        boardElement.appendChild(tr);
        }
  } catch (error) {
    console.error('Error rendering current board:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    renderEmptyBoard();
    let gamestate_polling = setInterval(handleGameState, 1000);
    console.log('Game state polling started.');
});

