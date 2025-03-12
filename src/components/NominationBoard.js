import { useEffect, useState } from "react";
import FantasyTeamsList from "./FantasyTeamsList"
import PlayerFilter from "./PlayerFilter"
import PlayerGrid from "./PlayerGrid"

const allPositions = ["C", "1B", "2B", "3B", "SS", "OF", "UT", "SP", "RP", "P"];

const NominationBoard = props => {
    const [search, setSearch] = useState("");
    const [requireAllPositions, setRequireAllPositions] = useState(true);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [clientFilteredPlayers, setClientFilteredPlayers] = useState([]);

    useEffect(() => {
        let clientFiltered = props.players;
        if(search) {
            clientFiltered = props.players.filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
        }

        clientFiltered = clientFiltered.filter(x => {
            if(selectedPositions.length === 0) {
            return true;
            }

            if(requireAllPositions) {
            for (const position of selectedPositions) {
                if(!x.positions.includes(position)) {
                return false;
                }
            }

            return true;
            } else {
            for (const position of selectedPositions) {
                if(x.positions.includes(position)) {
                return true;
                }
            }

            return false;
            }
        });

        setClientFilteredPlayers(clientFiltered);
    }, [props.players, search, selectedPositions, requireAllPositions]);

    useEffect(() => {
        if(selectedPositions.length < 1) {
          setRequireAllPositions(false);
        }
      }, [selectedPositions]);

    return <>
        <FantasyTeamsList onTheClock={props.onTheClock} fantasyTeams={props.fantasyTeams} onTeamClicked={props.onTeamClicked} />
        <PlayerFilter
        requireAllPositions={requireAllPositions}
        onRequireAllPositionsChanged={setRequireAllPositions}
        statsYear={props.statsYear}
        searchValue={search}
        onSearchValueChanged={setSearch}
        positions={allPositions}
        selectedPositions={selectedPositions}
        changeSelectedPositions={setSelectedPositions} />
        <PlayerGrid players={clientFilteredPlayers} statsYear={props.statsYear} onPlayerClicked={props.onPlayerClicked}/>
    </>
}

export default NominationBoard;