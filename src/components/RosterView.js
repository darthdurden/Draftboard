import { Button } from "@mui/material";

const RosterView = props => {
    props.roster.sort((a, b) => {
        const comparePickNumber = (a.pickNumber ?? 0) - (b.pickNumber ?? 0);
        const comparePositions = a.positions[0].localeCompare(b.positions[0]);
        const compareSalary = b.salary - a.salary;

        return comparePickNumber || comparePositions || compareSalary;
    });

    const onRemovePickClicked = (player) => {
        props.onRemovePickClicked(player);
    }

    return <table className="rosterTable">
        <tbody>
            {props.roster.map(player => <tr className={player.pickNumber ? "drafted" : "keeper"}><td width="20%">{player.positions.join(',')}</td><td width="40%">{player.name}</td><td width="20%">{String.format("{0:$0}", player.salary)}</td><td width="20%">{player.contract}</td><td>{player.pickNumber ? <Button onClick={() => { onRemovePickClicked(player) }}>Remove</Button> : "Keeper"}</td></tr>)}
        </tbody>
    </table>
}

export default RosterView;
