import { Button } from "@mui/material";

const HistoryView = props => {
    const teamIdToTeamMap = {};
    for(const team of props.fantasyTeams) {
        teamIdToTeamMap[team.teamId] = team;
    }

    const onRemovePickClicked = (player) => {
        props.onRemovePickClicked(player);
    }

    return <table className="rosterTable">
        <tbody>
            {props.history.map(player => <tr key={player.pickNumber}><td width="35%">{teamIdToTeamMap[player.fantasyTeam].name} ({teamIdToTeamMap[player.fantasyTeam].ownerName})</td><td width="35%">{player.name}</td><td width="10%">{String.format("{0:$0}", player.salary)}</td><td width="10%">{player.contract}</td><td><Button onClick={() => { onRemovePickClicked(player) }}>Remove</Button></td></tr>)}
        </tbody>
    </table>
}

export default HistoryView;
