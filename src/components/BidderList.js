import { Grid } from "@mui/material";

const BidderList = props => {
    const canBid = (bidder) => {
        let highBid = 0;
        if(props.highBid) {
            highBid = props.highBid.bid;
        }

        return bidder.remainingDraftCash >= highBid + 1;
    }

    return <Grid container className="bidderList">
            {props.fantasyTeams.map(ft => {
                    let className = "";
                    let cashRemaining = ft.remainingDraftCash;

                    if(ft === props.highBid.team) {
                        className = "highBidder";
                        cashRemaining -= props.highBid.bid;
                    }

                    if(props.allBidders.includes(ft)) {
                        className += " activeBidder";
                    }

                    if(!canBid(ft)) {
                        className += " noBidding";
                    }

                    return <Grid className={className} item key={ft.teamId} xs={3} onClick={() => {if(canBid(ft)) { props.onBidderClicked(ft); } }}>
                        <div className="bidder">
                            <span className="ownerName">{ft.ownerName ?? ft.teamId}</span>
                            <span className="teamName">{ft.name}</span>
                            <div>
                                <span className="cashRemainingOriginal">{String.format("{0:$0}", ft.remainingDraftCash)}</span>
                                <span className="cashRemaining">{String.format("{0:$0}", cashRemaining)}</span>
                            </div>
                        </div>
                    </Grid>
                }
            )}
        </Grid>
}

export default BidderList;
