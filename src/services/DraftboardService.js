const apiHost = 'https://localhost:5001';

const handleResponse = (response) => {
  if(response.status === 204) {
    return;
  }
  else if(response.status < 400) {
    return response.json();
  } else {
    throw response;
  }
}

const handleUncaughtError = (response) => {
  console.log(response);
}

export const fetchPlayers = async(positions) => {
    try {
        if(positions) {
          const positionsQuery = positions.map(x => `positions=${x}`).join("&")

          return handleResponse(await fetch(`${apiHost}/api/Players?${positionsQuery}`))  
        }

        return handleResponse(await fetch(`${apiHost}/api/Players`));
    } catch (e) {
        handleUncaughtError(e);
    }
}

export const fetchFantasyTeams = async() => {
  try {
      return handleResponse(await fetch(`${apiHost}/api/FantasyTeams`));
  } catch (e) {
      handleUncaughtError(e);
  }
}

export const fetchRoster = async(teamId) => {
    try {
      return handleResponse(await fetch(`${apiHost}/api/FantasyTeams/${teamId}/roster`));
    } catch (e) {
      handleUncaughtError(e);
    }
}

export const fetchHistory = async() => {
  try {
    return handleResponse(await fetch(`${apiHost}/api/Picks`));
  } catch (e) {
    handleUncaughtError(e);
  }
}

export const recordDraftPick = async(winningBid) => {
  try {
    return handleResponse(await fetch(`${apiHost}/api/picks`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bid: winningBid.bid,
        teamId: winningBid.team.teamId,
        playerId: winningBid.player.id
      })
    }));
  } catch (e) {
      handleUncaughtError(e);
      throw e;
  }
}

export const removeDraftPick = async(player) => {
  try {
    return handleResponse(await fetch(`${apiHost}/api/picks/${player.pickNumber}`, {
      method: "DELETE"
    }));
  } catch (e) {
      handleUncaughtError(e);
      throw e;
  }
}