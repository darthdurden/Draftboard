import { Grid, IconButton } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const CurrentBid = props => {
    const canIncreaseBidBy5 = () => {
        return props.bid.team.remainingDraftCash >= props.bid.bid + 5;
    }

    const canIncreaseBid = () => {
        return props.bid.team.remainingDraftCash >= props.bid.bid + 1;
    }

    const onIncreaseBidClicked = () => {
        props.onIncreaseBid(1);
    }

    const onIncreaseBidBy5Clicked = () => {
        props.onIncreaseBid(5);
    }

    return <Grid className="currentBid" direction={"column"}>
        <Grid className="teamName">{props.bid.team.name}</Grid>
        <Grid className="bid">
            ${props.bid.bid}
            <div className="iconsLeft">
                <IconButton disabled={props.bid.bid <= 1} onClick={props.onDecreaseBidClicked}>
                    <RemoveCircle />
                    <div>1</div>
                </IconButton>
            </div>
            <div className="icons">
                <IconButton disabled={!canIncreaseBid()} onClick={onIncreaseBidClicked}>
                    <AddCircle />
                    <div>1</div>
                </IconButton>
                <IconButton disabled={!canIncreaseBidBy5()} onClick={onIncreaseBidBy5Clicked}>
                    <AddCircle />
                    <div>5</div>
                </IconButton>
            </div>
        </Grid>
    </Grid>
}

export default CurrentBid;