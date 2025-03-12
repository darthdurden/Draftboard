import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";

const WinnerConfirmationDialog = props => {
    const { onClose, nomination, open, ...other } = props;
    const [nominationValue, setNomination] = useState(nomination);
  
    useEffect(() => {
      if (!open) {
        setNomination(nomination);
      }
    }, [nomination, open]);
  
    const handleCancel = () => {
      onClose();
    };
  
    const handleOk = () => {
      const winningBid = nomination.bids[nomination.bids.length - 1];
      onClose({
        team: winningBid.team,
        bid: winningBid.bid,
        player: nomination.player
      });
    };
  
    return (
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        open={open}
        {...other}
      >
        <DialogTitle>Confirm Selection</DialogTitle>
        <DialogContent dividers>
          <PlayerCard player={nomination.player} statsYear={2023} />
          {nomination.bids[nomination.bids.length - 1].team.name}
          ${nomination.bids[nomination.bids.length - 1].bid}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    );
  }

  export default WinnerConfirmationDialog;