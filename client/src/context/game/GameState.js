import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  CALL,
  CHECK,
  FOLD,
  JOIN_TABLE,
  LEAVE_TABLE,
  RAISE,
  REBUY,
  SIT_DOWN,
  STAND_UP,
  TABLE_JOINED,
  TABLE_LEFT,
  TABLE_UPDATED,
  CREATE_TABLE,
  TABLE_CREATED
} from "../../pokergame/actions";
import authContext from "../auth/authContext";
import socketContext from "../websocket/socketContext";
import GameContext from "./gameContext";

const GameState = ({ history, children }) => {
  const { socket } = useContext(socketContext);
  const { loadUser } = useContext(authContext);

  const TABLE_TYPE = {
    SIX: 6,
    NINE: 9,
  };

  const [messages, setMessages] = useState([]);
  const [tableList, setTableList] = useState({});
  const [currentTable, setCurrentTable] = useState(null);
  const [isPlayerSeated, setIsPlayerSeated] = useState(false);
  const [seatId, setSeatId] = useState(null);
  const [turn, setTurn] = useState(false);
  const [turnTimeOutHandle, setHandle] = useState(null);

  const currentTableRef = React.useRef(currentTable);

  useEffect(() => {
    currentTableRef.current = currentTable;
    isPlayerSeated &&
      seatId &&
      currentTable.seats[seatId] &&
      turn !== currentTable.seats[seatId].turn &&
      setTurn(currentTable.seats[seatId].turn);
  }, [currentTable]);


  useEffect(() => {
    if (turn && !turnTimeOutHandle) {
      const handle = setTimeout(fold, 15000);
      setHandle(handle);
    } else {
      turnTimeOutHandle && clearTimeout(turnTimeOutHandle);
      turnTimeOutHandle && setHandle(null);
    }
    // eslint-disable-next-line
  }, [turn]);

  useEffect(() => {
    if (socket) {
      window.addEventListener("unload", leaveTable);
      window.addEventListener("close", leaveTable);

      socket.on(TABLE_UPDATED, ({ table, message, from }) => {
        console.log('tableupdate------------', table)
        setCurrentTable(table);
        message && addMessage(message);
      });

      socket.on(TABLE_CREATED,  (table) => {
        // let { id } = table;
        // tableList[id]=table;
        setTableList(table);

      });

      socket.on(TABLE_JOINED, ({ tables, tableId }) => {
        setCurrentTable(tables[tableId]);
        console.log(tables[tableId], "tables[tableId]");
      });

      socket.on(TABLE_LEFT, ({ tables, tableId }) => {
        setCurrentTable(null);
        loadUser(localStorage.token);
        setMessages([]);
      });
    }
    return () => leaveTable();
    // eslint-disable-next-line
  }, [socket]);

  const joinTable = (tableId) => {
    socket.emit(JOIN_TABLE, tableId);
  };

  const leaveTable = () => {
    isPlayerSeated && standUp();
    currentTableRef &&
      currentTableRef.current &&
      currentTableRef.current.id &&
      socket.emit(LEAVE_TABLE, currentTableRef.current.id);
    history.push("/");
  };

  const sitDown = (tableId, seatId, amount) => {
    socket.emit(SIT_DOWN, { tableId, seatId, amount });
    setIsPlayerSeated(true);
    setSeatId(seatId);
  };

  const rebuy = (tableId, seatId, amount) => {
    socket.emit(REBUY, { tableId, seatId, amount });
  };

  const standUp = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(STAND_UP, currentTableRef.current.id);
    setIsPlayerSeated(false);
    setSeatId(null);
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log(message);
  };

  const createTable = async (_tableUuid, _tableType, _tableName, _limit) => {
   
    let newTable = {
      id: _tableUuid,
      maxPlayers: _tableType,
      name: _tableName,
      limit: _limit,
    };
    socket.emit(CREATE_TABLE, newTable);
  };

  const fold = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(FOLD, currentTableRef.current.id);
  };

  const check = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(CHECK, currentTableRef.current.id);
  };

  const call = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(CALL, currentTableRef.current.id);
  };

  const raise = (amount) => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(RAISE, { tableId: currentTableRef.current.id, amount });
  };

  return (
    <GameContext.Provider
      value={{
        messages,
        TABLE_TYPE,
        currentTable,
        tableList,
        createTable,
        isPlayerSeated,
        seatId,
        joinTable,
        leaveTable,
        sitDown,
        standUp,
        addMessage,
        fold,
        check,
        call,
        raise,
        rebuy,
        setTableList
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default withRouter(GameState);
