import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AuctioneerTimer from "./AuctioneerTimer";
import BidderList from "./BidderList";
import CurrentBid from "./CurrentBid";
import PlayerCard from "./PlayerCard";
import WinnerConfirmationDialog from "./WinnerConfirmationDialog";

const WARNING_THRESHOLD = 3;

const AuctionBoard = props => {
  const [currentSeconds, setSeconds] = useState(props.auctionTime);
  const [isBidReset, setIsBidReset] = useState(false);
  const [duration, setDuration] = useState(props.auctionTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const endHandler = () => {
    setSeconds(undefined);
    setIsRunning(false);
    setDuration(0);
  }
  
  const resetHandler = () => {
    const displaySeconds = props.resetDuration < 10 ? `0${props.resetDuration}` : props.resetDuration;
    setSeconds(displaySeconds);
    setIsRunning(true);
    setDuration(props.resetDuration);
  };

  useEffect(() => {
    if (isRunning === true) {
      let timer = duration;

      if(isPaused) {
        timer = parseInt(currentSeconds, 10);
        setIsPaused(false);
      }

      var seconds;
      const interval = setInterval(function () {
        if (--timer <= 0) {
          endHandler();
        } else {
          seconds = parseInt(timer % 60, 10);
          const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

          setSeconds(displaySeconds);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if(isRunning === false && isBidReset === true) {
        setIsBidReset(false);

        if(parseInt(currentSeconds, 10) < props.resetDuration) {
            const displaySeconds = props.resetDuration < 10 ? `0${props.resetDuration}` : props.resetDuration;
            setSeconds(displaySeconds);
            setDuration(props.resetDuration);
            setIsRunning(true);
        }
    }
  }, [isRunning]);

  useEffect(() => {
    const newBidder = props.nomination && props.nomination.bids.length > 0 ?
        props.nomination.bids[props.nomination.bids.length - 1] : undefined;

    if(newBidder && !isRunning && !isBidReset) {
        const displaySeconds = props.auctionTime < 10 ? `0${props.auctionTime}` : props.auctionTime;
        setSeconds(displaySeconds);
        setDuration(props.auctionTime);
        setIsRunning(true);
    }
  }, [props.nomination]);

  const onPauseClicked = () => {
    setIsPaused(true);
    setIsRunning(false);
  }

  const onResumeClicked = () => {
    setIsRunning(true);
  }

  const onCancelClicked = () => {
    props.onCancelClicked();
  }

    const getAllBidders = () => {
        return props.nomination.bids.map(x => x.team);
    }

    const onBidderClicked = (bidder) => {
      var highBid = props.nomination.bids[props.nomination.bids.length - 1];
      if(bidder.remainingDraftCash >= highBid.bid + 1) {
          props.onBidderClicked(bidder);

          setIsRunning(true);
          if(parseInt(currentSeconds, 10) < props.resetDuration) {
              setIsBidReset(true);
              setIsRunning(false);
          }
      }
    }

    const canIncreaseBid = (amount) => {
      var highBid = props.nomination.bids[props.nomination.bids.length - 1];
      if(highBid.team.remainingDraftCash >= highBid.bid + amount) {
        return true;
      }

      return false;
    }

    const onIncreaseBid = (amount) => {
      if(canIncreaseBid(amount)) {
        props.onIncreaseBid(amount);
        setIsRunning(true);
        if(parseInt(currentSeconds, 10) < props.resetDuration) {
            setIsBidReset(true);
            setIsRunning(false);
        }
      }
    }

    const onDecreaseBidClicked = () => {
      props.onDecreaseBidClicked();
      setIsRunning(true);
      if(parseInt(currentSeconds, 10) < props.resetDuration) {
          setIsBidReset(true);
          setIsRunning(false);
      }
    }

    const onConfirmClose = (winningBid) => {
        if(winningBid) {
            props.onWinningBid(winningBid);
        } else {
            resetHandler();
        }
    }

    return <>
        <Grid container>
            <Grid item xs={4}>
            <PlayerCard player={props.nomination.player} statsYear={props.statsYear} />
            </Grid>
            <Grid item xs={4}>
                <CurrentBid bid={props.nomination.bids[props.nomination.bids.length - 1]} onIncreaseBid={onIncreaseBid} onDecreaseBidClicked={onDecreaseBidClicked} />
            </Grid>
            <Grid item xs={4}>
                <AuctioneerTimer isRunning={isRunning} warningThreshold={WARNING_THRESHOLD} timer={currentSeconds} onPauseClicked={onPauseClicked} onResumeClicked={onResumeClicked} onCancelClicked={onCancelClicked} />
            </Grid>
            <Grid item xs={12}>
                <BidderList allBidders={getAllBidders()} highBid={props.nomination.bids[props.nomination.bids.length - 1]} fantasyTeams={props.fantasyTeams} onBidderClicked={onBidderClicked} />
            </Grid>
        </Grid>
        <WinnerConfirmationDialog onClose={onConfirmClose} nomination={props.nomination} open={props.nomination && isRunning === false && !isBidReset && !isPaused} />
    </>
}

export default AuctionBoard;