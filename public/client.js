import * as player from './player_module.js';
import * as gamestate from './gamestate_module.js';

let player_id = null;
let coin_id = null;
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

let gamestate_polling = null;
let coin_polling = null;


/**
 * @typedef {Object} Player
  * @property {boolean} is_previous_winner - Indicates if the player was a previous winner.
  * @property {string} player_icon - The icon representing the player.
  * @property {string} player_name - The name of the player.
  * @property {Array} player_held_positions - The positions held by the player.
 */
const local_player = {
    "is_previous_winner": null,
    "player_icon": null,
    "player_name": null,
    "player_held_positions": [],
}

// Game State Functions
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

async function monitorCoinFlips() {
    try {
        const coin_1_result = await gamestate.getCoinAttribute('coin_1');
        const coin_2_result = await gamestate.getCoinAttribute('coin_2');

        if (coin_1_result === null || coin_2_result === null) {
        }

        if (coin_1_result === coin_2_result) {
            console.log(`Both players flipped ${coin_1_result}. Reflipping...`);
            await gamestate.resetCoinData();
            clearInterval(coin_polling);
            coin_polling = null;
            return;
        }

        if ((coin_1_result === 'heads' && coin_id === 1) || 
            (coin_2_result === 'heads' && coin_id === 2)) {
            player_id = coin_id;
            console.log(`You (${player_id}) go first!`);
        } else {
            player_id = coin_id === 1 ? 2 : 1;
            console.log(`Opponent (${player_id}) goes first.`);
        }

        await gamestate.putGameStateAttribute('status', 'playing');
        clearInterval(coin_polling);
        coin_polling = null;

    } catch (error) {
        console.error('Error monitoring coin flips:', error);
        throw error;
    }
}
        
async function makeMove(position) {
    try {
      const current_player = await gamestate.getGameStateAttribute('currentPlayer');
      if (current_player !== player_id) {
        alert('It is not your turn to play.');
        return;
      }
      const player_positions = await player.getPlayerAttribute(player_id, 'player_held_positions');
      if (position.value !== "") {
        alert('This position is already taken. Please choose another.');  
        return; 
      } else {
        player_positions.push(position);
        await player.putPlayerAttribute(player_id, 'player_held_positions', player_positions);
        if (!await isWin()) {
          await isDraw();
        }
        await gamestate.putGameStateAttribute('currentPlayer', player_id === 1 ? 2 : 1);
      }
    } catch (error) {
        console.error('Error getting player positions:', error);
        throw error;
    }
  
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

function renderBoard(){
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
}

document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
});

