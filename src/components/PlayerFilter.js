import { Button, Grid, TextField } from "@mui/material";

const PlayerFilter = props => {
    const handleCheck = (event) => {
        handleCheckInternal(event.target.checked, event.target.value);
    };

    const handleCheckInternal = (checked, value) => {
        var updatedList = [...props.selectedPositions];
        if (checked) {
            updatedList = [...props.selectedPositions, value];
        } else {
            updatedList.splice(props.selectedPositions.indexOf(value), 1);
        }
        props.changeSelectedPositions(updatedList);
    }

    const isChecked = (item) => {
        return props.selectedPositions.indexOf(item) > -1;
    }

    const renderRequireCheckMaybe = () => {
        return props.selectedPositions.length > 1 && <Grid item>
            <input type="checkbox" onChange={(e) => props.onRequireAllPositionsChanged(e.target.checked)} checked={props.requireAllPositions} />
            <span>Require All</span>
        </Grid>
    }

    const renderChecks = () => {
        return <ul className="positionChecks">
            {props.positions.map((item, index) => (
                <li key={index} className={`position${item}`} onClick={() => { handleCheckInternal(!isChecked(item), item) }}>
                    <input value={item} type="checkbox" onChange={handleCheck} checked={isChecked(item)} />
                    <span>{item}</span>
                </li>
            ))}
        </ul>;
    }

    const resetFilter = () => {
        props.changeSelectedPositions([]);
        props.onSearchValueChanged("");
        props.onRequireAllPositionsChanged(false);
    }

     return <>
        <Grid container className="playerFilter">
            <Grid item xs={2} className="flexGrid">
                <TextField className="searchField" placeholder="Player Name" value={props.searchValue} onChange={(e) => { props.onSearchValueChanged(e.target.value) }} /></Grid>
            <Grid item xs={8}>
                {renderChecks()}
            </Grid>
            <Grid xs={2} item justifyContent={"center"} alignItems={"center"} className="flexGrid">
                <Grid container direction={"columnn"} justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={12}>
                        <Button className="clearBtn" onClick={resetFilter}>Clear</Button>
                    </Grid>
                    { renderRequireCheckMaybe() }
                </Grid>
            </Grid>
        </Grid>
     </>;

     
};

export default PlayerFilter;