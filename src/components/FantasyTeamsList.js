const FantasyTeamsList = props => {
    return <div>
        <ul className="fantasyTeamList">
            {props.fantasyTeams.map(ft => {
                    let className = "";
                    if(ft === props.onTheClock) {
                        className = "onTheClock";
                    }

                    if(ft.remainingDraftCash <= 0) {
                        className += " broke";
                    }

                    return <li key={ft.teamId} className={className} onClick={() => { props.onTeamClicked(ft) }}>
                        <span className="ownerName">{ft.ownerName ?? ft.teamId}</span>
                        <span className="cashRemaining">{String.format("{0:$0}", ft.remainingDraftCash)}</span>
                    </li>
                }
            )}
        </ul>
    </div>
}

export default FantasyTeamsList;
