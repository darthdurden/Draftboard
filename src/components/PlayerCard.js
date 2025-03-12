const PlayerCard = props => {
    const onHeadshotError = (ev) => {
        ev.target.src = 'https://fantraximg.com/assets/images/icons/layout/profile__placeholder--dark.svg'
        ev.target.style.display = 'none';
    }

    const teamLogo = (mlbTeam) => {
        if(mlbTeam === "(N/A)") {
            return;
        }

        switch(mlbTeam) {
            case "CHW":
            mlbTeam = "CWS";
            break;
            default:
            break;
        }

        return <img className='teamlogo' width={50} height={50} alt={mlbTeam} src={`https://sportsbook.draftkings.com/static/logos/teams/mlb/${mlbTeam}.png`} />
    }

    function renderHittingStatsMaybe(player, statsYear) {
        const hittingStats = player.hittingStats.filter(x => x.season === statsYear)[0];
        if(hittingStats) {
            return <div className='hittingStats'>
            <div>{hittingStats.homeruns} HR</div>
            <div>{hittingStats.runsProduced} RP</div>
            <div>{hittingStats.totalBases} TB</div>
            <div>{String.format("{0:#.000} OBP", hittingStats.onBasePct)}</div>
            <div>{hittingStats.netStolenBases2} SB</div>
            </div>
        }

        return null;
    }

    function renderPitchingStatsMaybe(player, statsYear) {
        const pitchingStats = player.pitchingStats.filter(x => x.season === statsYear)[0];

        if(pitchingStats) {
            return <div className='pitchingStats'>
            <div>{pitchingStats.startingPitcherContribution} SPC</div>
            <div>{pitchingStats.reliefPitcherContribution} RPC</div>
            <div>{String.format("{0:0.00} ERA", pitchingStats.era)}</div>
            <div>{String.format("{0:0.00} WHIP", pitchingStats.whip)}</div>
            <div>{pitchingStats.strikeouts} K</div>
            </div>
        }

        return null;
    }

    function hasTwoWayStats(player, statsYear) {
        const pitchingStats = player.pitchingStats.filter(x => x.season === statsYear)[0];
        const hittingStats = player.hittingStats.filter(x => x.season === statsYear)[0];

        return pitchingStats && hittingStats;
    }

    let displayPositions = props.player.positions;

    let classNames = "playerCell";
    if(displayPositions.length === 1 ||
        (displayPositions.length === 2 && displayPositions.includes("UT") && !displayPositions.includes("P")) ||
        (displayPositions.length === 2 && displayPositions.includes("P") && !displayPositions.includes("UT"))) {
        classNames += ` position${displayPositions[0]}`;
    } else {
        classNames += " positionMulti";
    }

    if(hasTwoWayStats(props.player, props.statsYear)) {
        classNames += " twoWayStats";
    }

    return (
        <div style={props.style} className="playerCell" onClick={(e) => { props.onClick(e); }}>
            <div className={`inner ${classNames}`}>
                <div className="playerNames">
                    <div><span className="firstName">{props.player.firstName}</span> <span className="age">({props.player.age})</span></div>
                    <div className="lastName">{props.player.lastName}</div>
                </div>
                <div className="logos">
                {teamLogo(props.player.mlbTeam)}
                <img className='headshot' width={50} height={50} src={props.player.headshot} alt={props.player.name} onError={onHeadshotError} />
                </div>
                <div className='positions'>
                {displayPositions.map(x => <div key={x} className={`positionCell position${x}`}>{x}</div>)}
                </div>
                <div className='statsContainer'>
                {renderHittingStatsMaybe(props.player, props.statsYear)}
                {renderPitchingStatsMaybe(props.player, props.statsYear)}
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;