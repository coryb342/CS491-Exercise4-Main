export async function getPlayerData(player_id) {
  try {
    const response = await fetch(`/player/${player_id}`);
    if (!response.ok) throw new Error('Could not get player data.');
    const server_token = await response.json();
    return server_token;
  } catch (error) {
      console.error('Error getting player data:', error);
      throw error;
  }
}

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