//Coin Functions
export async function getCoinData() {
    try {
        const response = await fetch('/coin');
        if (!response.ok) throw new Error('Could not get coin data.');
        const coin_data = await response.json();
        return coin_data; 
    }
    catch (error) {
        console.error('Error getting coin data:', error);
        throw error;
    }
}

export async function putCoinData(coin) {
    try {
        const response = await fetch('/coin', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(coin),
            keepalive: true,
        });
        if (!response.ok) throw new Error('Could not update coin data.');
        return await response.text();
    } catch (error) {
        console.error('Error updating coin data:', error);
        throw error;
    }
}

export async function resetCoinData() {
    try {
        const coin = {
            "coin_1": null,
            "coin_2": null
        };
        await putCoinData(coin);
        return console.log('Coin data reset successfully.');
    } catch (error) {
        console.error('Error resetting coin data:', error);
        throw error;
    }
}

export async function getCoinAttribute(attribute) {
    try {
        const coin = await getCoinData();
        if (coin && attribute in coin) {
            return coin[attribute];
        } else {
            throw new Error(`Attribute ${attribute} not found in coin data.`);
        }
    } catch (error) {
        console.error('Error getting coin attribute:', error);
        throw error;
    }
}

export async function putCoinAttribute(attribute, value) {
    try {
        const coin = await getCoinData();
        if (coin && attribute in coin) {
            coin[attribute] = value;
            return await putCoinData(coin);
        } else {
            throw new Error(`Attribute ${attribute} not found in coin data.`);
        }
    } catch (error) {
        console.error('Error updating coin attribute:', error);
        throw error;
    }
}   

//Game State Functions
export async function getGameStateData() {
    try {
        const response = await fetch('/gamestate');
        if (!response.ok) throw new Error('Could not get game state data.');
        const gamestate_data = await response.json();
        return gamestate_data;
    } catch (error) {
        console.error('Error getting game state data:', error);
        throw error;
    }
}

export async function putGameStateData(gamestate) {
    try {
        const response = await fetch('/gamestate', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gamestate),
            keepalive: true,
        });
        if (!response.ok) throw new Error('Could not update game state data.');
        return await response.text();
    } catch (error) {
        console.error('Error updating game state data:', error);
        throw error;
    }
}

export async function resetGameStateData() {
    try {
        const gamestate = {
            "status": "coin_flip",
            "isGameOver": false,
            "currentPlayer": 1
        };
        await putGameStateData(gamestate);
        return console.log('Game state data reset successfully.');
    } catch (error) {
        console.error('Error resetting game state data:', error);
        throw error;
    }
}

export async function getGameStateAttribute(attribute) {
    try {
        const gamestate = await getGameStateData();
        if (gamestate && attribute in gamestate) {
            return gamestate[attribute];
        } else {
            throw new Error(`Attribute ${attribute} not found in game state.`);
        }
    } catch (error) {
        console.error('Error getting game state attribute:', error);
        throw error;
    }
}

export async function putGameStateAttribute(attribute, value) {
    try {
        const gamestate = await getGameStateData();
        if (gamestate && attribute in gamestate) {
            gamestate[attribute] = value;
            return await putGameStateData(gamestate);
        } else {
            throw new Error(`Attribute ${attribute} not found in game state.`);
        }
    } catch (error) {
        console.error('Error updating game state attribute:', error);
        throw error;
    }   
}