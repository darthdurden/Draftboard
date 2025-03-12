import 'react-virtualized/styles.css'; // only needs to be imported once

import { Grid as VirtualGrid, AutoSizer } from 'react-virtualized';
import { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
String.format = require("clr-format");


const PlayerGrid = props => {
  const [scrollTop, setScrollTop] = useState(0);
  const [oldProps, setOldProps] = useState({});

  useEffect(() => {
    if(oldProps?.players && props?.players && oldProps.players.length !== props.players.length) {
      setScrollTop(0);
    }

    setOldProps(props);
  }, [oldProps.players, props]);

  const onScroll = ({ scrollTop }) => {
    setScrollTop(scrollTop);
  }

    function cellRenderer({columnIndex, key, rowIndex, style}) {
        const index = rowIndex * 4 + columnIndex;

        const item = props.players[index];
        if(!item) {
            return null;
        }

        return <PlayerCard key={key} style={style} statsYear={props.statsYear} player={item} onClick={() => { props.onPlayerClicked(item); }} />
      }

    return (<><AutoSizer style={{height: "calc(100vh - 374px)"}}>
      {({height, width}) => {
        const rowHeight = 120;
        let columnCount = 4;

        if(width < 768) {
          columnCount = 1;    
        } else if (width < 1024) {
          columnCount = 3;
        } else if (width < 1280) {
          columnCount = 4;
        }

        const columnWidth = width / columnCount;

        return (<VirtualGrid scrollTop={scrollTop}
          onScroll={onScroll}
          cellRenderer={cellRenderer}
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={height}
          rowCount={Math.round(props.players.length / columnCount) + 1}
          rowHeight={rowHeight}
          width={width}
      />)
      }}</AutoSizer></>);
};

export default PlayerGrid;