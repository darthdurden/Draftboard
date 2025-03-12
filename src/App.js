import './App.css';
import { fetchPlayers, fetchFantasyTeams, recordDraftPick, fetchRoster, removeDraftPick, fetchHistory } from './services/DraftboardService';
import React, { useState, useEffect } from 'react';
import NominationBoard from './components/NominationBoard';
import AuctionBoard from './components/AuctionBoard';
import RosterView from './components/RosterView';
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Select, TextField } from '@mui/material';
import { Settings, History } from '@mui/icons-material';
import { Container } from '@mui/system';
import logo from './assets/images/logo.png'
import HistoryView from './components/HistoryView';

function App() {
  const [players, setPlayers] = useState([]);
  const [fantasyTeams, setFantasyTeams] = useState([]);
  const [nomination, setNomination] = useState(undefined);
  const [teamOnClock, setTeamOnClock] = useState(undefined);
  const [preserveTeamOnClock, setPreserveTeamOnClock] = useState(false);
  const [roster, setRoster] = useState(undefined);
  const [rosterTeam, setRosterTeam] = useState(undefined);
  const [showRoster, setShowRoster] = useState(false);
  const [auctionTime, setAuctionTime] = useState(30);
  const [resetDuration, setResetDuration] = useState(15);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [removingPick, setRemovingPick] = useState(undefined);
  const [statsYear, setStatsYear] = useState(2023);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (window.sessionStorage.getItem('auctionTime')) {
      setAuctionTime(window.sessionStorage.getItem('auctionTime'));
    } else {
      setAuctionTime(30);
    }

    if (window.sessionStorage.getItem('resetDuration')) {
      setResetDuration(window.sessionStorage.getItem('resetDuration'));
    } else {
      setResetDuration(15);
    }
    
    fetchPlayers([]).then(setPlayers);
    fetchFantasyTeams().then(setFantasyTeams);
  }, []);

  useEffect(() => {
    if(roster) {
      setShowRoster(true);
    }
  }, [roster])

  useEffect(() => {
    if(!teamOnClock) {
      const teamOnClockId = window.sessionStorage.getItem('teamOnClockId');

      if(teamOnClockId) {
        for(const ft of fantasyTeams) {
          if(ft.teamId === teamOnClockId) {
            setTeamOnClock(ft);
            window.sessionStorage.setItem('teamOnClockId', ft.teamId);
            break;
          }
        }
      } else {
        for(const ft of fantasyTeams) {
          if(ft.remainingDraftCash > 0) {
            setTeamOnClock(ft);
            window.sessionStorage.setItem('teamOnClockId', ft.teamId);
            break;
          }
        }
      }
    }
  }, [fantasyTeams, teamOnClock]);

  useEffect(() => {
    if(!nomination && teamOnClock && !preserveTeamOnClock) {
      const originalIndex = fantasyTeams.findIndex(ft => ft.teamId === teamOnClock.teamId);
      let currentIndex = originalIndex;
      while(true) {
        currentIndex++;
        if(currentIndex >= fantasyTeams.length) {
          currentIndex = 0;
        }

        if(currentIndex === originalIndex) {
          if(fantasyTeams[currentIndex].remainingDraftCash > 0) {
            setTeamOnClock(fantasyTeams[currentIndex]);
            window.sessionStorage.setItem('teamOnClockId', fantasyTeams[currentIndex].teamId);
          } else {
            setTeamOnClock(undefined);
            window.sessionStorage.removeItem('teamOnClockId');
          }

          break;
        }

        if(fantasyTeams[currentIndex].remainingDraftCash > 0) {
          setTeamOnClock(fantasyTeams[currentIndex]);
          window.sessionStorage.setItem('teamOnClockId', fantasyTeams[currentIndex].teamId);
          break;
        }
      }
    }

    setPreserveTeamOnClock(false);
  }, [nomination])

  const onPlayerClicked = (player) => {
    if(!nomination) {
      setNomination({
        player,
        bids: [
          {
            team: teamOnClock,
            bid: 1
          }
        ]
      });
    }
  }

  const onCancelAuctionClicked = () => {
    setPreserveTeamOnClock(true);
    setNomination(undefined);
  }

  const onBidderClicked = (team) => {
    if(nomination) {
      setNomination({
        ...nomination,
        bids: [...nomination.bids, {
         team,
         bid: nomination.bids[nomination.bids.length - 1].bid + 1 
        }]
      });
    }
  }

  const onIncreaseBid = (amount) => {
    if(nomination) {
      nomination.bids[nomination.bids.length - 1].bid += amount;

      setNomination({
        ...nomination,
        bids: [...nomination.bids]
      });
    }
  }

  const onDecreaseBidClicked = () => {
    if(nomination) {
      nomination.bids[nomination.bids.length - 1].bid -= 1;

      setNomination({
        ...nomination,
        bids: [...nomination.bids]
      });
    }
  }

  const onWinningBid = (winningBid) => {
    recordDraftPick(winningBid).then(() => {
      // Remove player from list of available players
      setPlayers(players.filter(x => x !== winningBid.player));
      // Update team's draft budget
      const nextFantasyTeams = fantasyTeams.map(ft => {
        if (ft === winningBid.team) {
          // Update remaining cash

          return {
            ...ft,
            remainingDraftCash: ft.remainingDraftCash - winningBid.bid
          };
        } else {
          // No change
          return ft;
        }
      });
      // Re-render with the new array
      setFantasyTeams(nextFantasyTeams);

      setNomination(undefined);
    });
  }

  const onHistoryClicked = () => {
    fetchHistory().then((history) => {
      setHistory(history);
      setShowHistory(true);
    });
  }

  const onTeamClicked = (team) => {
    setRosterTeam(team);
    fetchRoster(team.teamId).then(setRoster);
  }

  const onAuctionTimeChanged = (e) => {
    setAuctionTime(e.target.value);
    window.sessionStorage.setItem('auctionTime', e.target.value);
  }

  const onResetDurationChanged = (e) => {
    setResetDuration(e.target.value);
    window.sessionStorage.setItem('resetDuration', e.target.value);
  }

  const onSelectTeamOnClockChanged = (e) => {
    setTeamOnClock(e.target.value);
    window.sessionStorage.setItem('teamOnClockId', e.target.value.teamId);
  }

  const onRemovePickClicked = (player) => {
    setRemovingPick(player);
  }

  const removePick = () => {
    if(removingPick) {
      removeDraftPick(removingPick).then(() => {
        // Add player to from of available players
        let newPlayers = [...players, removingPick];
        newPlayers.sort((a, b) => a.rank - b.rank);
        setPlayers(newPlayers);
        // Update team's draft budget
        const nextFantasyTeams = fantasyTeams.map(ft => {
          if (ft.teamId === removingPick.fantasyTeam) {
            // Update remaining cash
            return {
              ...ft,
              remainingDraftCash: ft.remainingDraftCash + removingPick.salary
            };
          } else {
            // No change
            return ft;
          }
        });
        // Re-render with the new array
        setFantasyTeams(nextFantasyTeams);
        // Update roster to remove player
        if(roster) {
          setRoster(roster.filter(x => x.id !== removingPick.id));
        }

        if(history) {
          setHistory(history.filter(x => x.id !== removingPick.id));
        }
  
        setRemovingPick(undefined);
      });      
    }
  }

  const renderNominationBoardMaybe = () => {
    if(!nomination) {
      return <NominationBoard statsYear={statsYear} onTeamClicked={onTeamClicked} onTheClock={teamOnClock} players={players} fantasyTeams={fantasyTeams} onPlayerClicked={onPlayerClicked} />;
    }
  }

  const renderAuctionBoardMaybe = () => {
    if(nomination) {
      return <AuctionBoard statsYear={statsYear} auctionTime={auctionTime} resetDuration={resetDuration} onCancelClicked={onCancelAuctionClicked} onWinningBid={(bid) => onWinningBid(bid)} nomination={nomination} fantasyTeams={fantasyTeams} onBidderClicked={onBidderClicked} onIncreaseBid={onIncreaseBid} onDecreaseBidClicked={onDecreaseBidClicked}/>
    }
  }

  const renderRosterViewMaybe = () => {
    return <Dialog open={showRoster} fullWidth={true} onClose={() => setShowRoster(false)}>
      <DialogTitle>
        {rosterTeam && rosterTeam.name} ({rosterTeam && rosterTeam.ownerName})
      </DialogTitle>
      <DialogContent>
        <RosterView onRemovePickClicked={onRemovePickClicked} roster={roster} />
      </DialogContent>
    </Dialog>;
  }

  const renderSettingsMaybe = () => {
    return <Dialog open={showSettings} fullWidth={true} onClose={() => setShowSettings(false)}>
      <DialogTitle>
        Settings
      </DialogTitle>
      <DialogContent>
        <Grid>
          <Grid>
            <span className="settingLabel">Auction Time:</span>
            <TextField className="settingsInput" InputProps={{
                inputProps: { 
                    max: 120, min: resetDuration 
                }
            }} type="number" value={auctionTime} onChange={onAuctionTimeChanged} />
          </Grid>
          <Grid>
              <span className="settingLabel">Reset Time:</span>
              <TextField className="settingsInput" InputProps={{
                  inputProps: { 
                      max: auctionTime, min: 5 
                  }
              }} type="number" value={resetDuration} onChange={onResetDurationChanged} />
          </Grid>
          <Grid>
              <span className="settingLabel">Team On Clock:</span>
            <Select className="select settingsInput"
              value={teamOnClock}
              label="TeamOnClock"
              onChange={onSelectTeamOnClockChanged}
            >
              { fantasyTeams.filter(x => x.remainingDraftCash > 0).map(x => <MenuItem value={x}>{x.name} ({x.ownerName})</MenuItem>)}
            </Select>
          </Grid>
          <Grid>
            <span className="settingLabel">Stats:</span>
            <Select className="select settingsInput" value={statsYear} onChange={(e) => { setStatsYear(e.target.value) }}>
                <MenuItem value={2023}>2023 Projections</MenuItem>
                <MenuItem value={2022}>2022 Regular Season</MenuItem>
                <MenuItem value={2021}>2021 Regular Season</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>;
  }

  const renderHistoryMaybe = () => {
    return <Dialog open={showHistory} fullWidth={true} onClose={() => setShowHistory(false)}>
      <DialogTitle>
        History
      </DialogTitle>
      <DialogContent>
        <HistoryView onRemovePickClicked={onRemovePickClicked} history={history} fantasyTeams={fantasyTeams} />
      </DialogContent>
    </Dialog>;
  }

  const renderRemovePickMaybe = () => {
    let teamName = "";
    if(removingPick) {
      teamName = fantasyTeams.find(x => x.teamId === removingPick.fantasyTeam)?.name;
    }

    return <Dialog open={removingPick} fullWidth={true} onClose={() => setRemovingPick(undefined)}>
      <DialogTitle>
        Remove {removingPick?.name} from {teamName}?
      </DialogTitle>
      <DialogContent>
        This will add {removingPick?.name} back to the player pool and reimburse {teamName} ${removingPick?.salary}.
      </DialogContent>
      <DialogActions>
          <Button autoFocus onClick={() => setRemovingPick(undefined)}>
            Cancel
          </Button>
          <Button onClick={removePick} autoFocus>
            Okay
          </Button>
      </DialogActions>
    </Dialog>;
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Container>
          <img className="logo" src={logo} alt="BLFA" />
          <IconButton className="settingsBtn" onClick={() => { setShowSettings(true) }}>
            <Settings />
          </IconButton>
          <IconButton className="historyBtn" onClick={() => { onHistoryClicked() }}>
            <History />
          </IconButton>
        </Container>
      </AppBar>
      { renderNominationBoardMaybe() }
      { renderAuctionBoardMaybe() }
      { renderRosterViewMaybe() }
      { renderSettingsMaybe() }
      { renderHistoryMaybe() }
      { renderRemovePickMaybe() }
    </div>
  );
}

export default App;
