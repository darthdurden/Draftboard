import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import warningBell from '../assets/sounds/warning-bell.wav'
import { PauseCircle, PlayCircle } from "@mui/icons-material";

const AuctioneerTimer = props => {
  const [audio] = useState(new Audio(warningBell));

    useEffect(() => {
        if(parseInt(props.timer, 10) === props.warningThreshold) {
            audio.play();
        }
      }, [props.timer, props.warningThreshold, audio]);

    if(!props.timer) {
        return <div className="timer winner">Winner!</div>
    }

    const renderPlayPause = () => {
        if(props.isRunning) {
            return <IconButton onClick={() => props.onPauseClicked()}><PauseCircle /></IconButton>
        } else {
            return <IconButton onClick={() => props.onResumeClicked()}><PlayCircle /></IconButton>
        }
    }

    let className = "timer";
    if(props.timer <= props.warningThreshold) {
        className += " danger";
    }

    return <div className={className}>
                <span>0:{props.timer}</span>
                <div className="icons">
                    {renderPlayPause()}
                    <IconButton onClick={props.onCancelClicked}>
                        <CancelIcon />
                    </IconButton>
                </div>
            </div>
}

export default AuctioneerTimer;