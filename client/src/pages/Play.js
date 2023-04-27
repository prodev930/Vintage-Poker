import React, { useContext, useEffect, useState } from "react";
import Container from "../components/layout/Container";
import Button from "../components/buttons/Button";
import gameContext from "../context/game/gameContext";
import socketContext from "../context/websocket/socketContext";
import PokerTable from "../components/game/PokerTable";
import { RotateDevicePrompt } from "../components/game/RotateDevicePrompt";
import { PositionedUISlot } from "../components/game/PositionedUISlot";
import { PokerTableWrapper } from "../components/game/PokerTableWrapper";
import { Seat } from "../components/game/Seat";
import Text from "../components/typography/Text";
import modalContext from "../context/modal/modalContext";
import { withRouter } from "react-router-dom";
import { TableInfoWrapper } from "../components/game/TableInfoWrapper";
import { InfoPill } from "../components/game/InfoPill";
import { GameUI } from "../components/game/GameUI";
import { GameStateInfo } from "../components/game/GameStateInfo";
import PokerCard from "../components/game/PokerCard";
import contentContext from "../context/content/contentContext";
import "../styles/tableSeat.css";

const Play = ({ history }) => {
  const { socket } = useContext(socketContext);
  const { openModal } = useContext(modalContext);
  const {
    messages,
    currentTable,
    isPlayerSeated,
    seatId,
    leaveTable,
    sitDown,
    standUp,
    fold,
    check,
    call,
    raise,
  } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);
  const [eachTable, setEachTable] = useState([]);

  const [bet, setBet] = useState(0);

  useEffect(() => {
  
    !socket &&
      openModal(
        () => (
          <Text>{getLocalizedString("game_lost-connection-modal_text")}</Text>
        ),
        getLocalizedString("game_lost-connection-modal_header"),
        getLocalizedString("game_lost-connection-modal_btn-txt"),
        () => history.push("/")
      );
    return () => leaveTable();
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    
    if (currentTable) {
      const temparr = [];
      
      if (currentTable.maxPlayers == 6) {
        for (let i = 1; i <= currentTable.maxPlayers; i++) {
          temparr.push({ id: i, classname: `seatSix_${i}` });
        }
      }
      if (currentTable.maxPlayers == 9) {
        for (let i = 1; i <= currentTable.maxPlayers; i++) {
          temparr.push({ id: i, classname: `seatNine_${i}` });
        }
      }

      setEachTable(temparr);
    }
    currentTable &&
      (currentTable.callAmount > currentTable.minBet
        ? setBet(currentTable.callAmount)
        : currentTable.pot > 0
        ? setBet(currentTable.minRaise)
        : setBet(currentTable.minBet));
  }, [currentTable]);
 
 

  return (
    <>
      <RotateDevicePrompt />
      <Container fullHeight>
        {currentTable && (
          <>
            <PositionedUISlot
              bottom="2vh"
              left="1.5rem"
              sc
              ="0.65"
              style={{ zIndex: "50" }}
            >
              <Button small secondary onClick={leaveTable}>
                {getLocalizedString("game_leave-table-btn")}
              </Button>
            </PositionedUISlot>
            {!isPlayerSeated && (
              <PositionedUISlot
                bottom="1.5vh"
                right="1.5rem"
                scale="0.65"
                style={{ pointerEvents: "none", zIndex: "50" }}
                origin="bottom right"
              >
                <TableInfoWrapper>
                  <Text textAlign="right">
                    <strong>{currentTable.name}</strong> |{" "}
                    <strong>
                      {getLocalizedString("game_info_limit-lbl")}:{" "}
                    </strong>
                    {new Intl.NumberFormat(
                      document.documentElement.lang
                    ).format(currentTable.limit)}{" "}
                    |{" "}
                    <strong>
                      {getLocalizedString("game_info_blinds-lbl")}:{" "}
                    </strong>
                    {new Intl.NumberFormat(
                      document.documentElement.lang
                    ).format(currentTable.minBet)}{" "}
                    /{" "}
                    {new Intl.NumberFormat(
                      document.documentElement.lang
                    ).format(currentTable.minBet * 2)}
                  </Text>
                </TableInfoWrapper>
              </PositionedUISlot>
            )}
          </>
        )}
        <PokerTableWrapper>
          <PokerTable />
          {currentTable && (
            <>
              {eachTable.map((item, index) => (
                <PositionedUISlot key={index} className={item.classname}>
                  <Seat
                    seatNumber={item.id}
                    currentTable={currentTable}
                    isPlayerSeated={isPlayerSeated}
                    sitDown={sitDown}
                  />
                </PositionedUISlot>
              ))}
              <PositionedUISlot
                width="100%"
                origin="center center"
                scale="0.60"
                style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentTable.board && currentTable.board.length > 0 && (
                  <>
                    {currentTable.board.map((card, index) => (
                      <PokerCard key={index} card={card} />
                    ))}
                  </>
                )}
              </PositionedUISlot>
              <PositionedUISlot bottom="8%" scale="0.60" origin="bottom center">
                {messages && messages.length > 0 && (
                  <>
                    <InfoPill>{messages[messages.length - 1]}</InfoPill>
                    {!isPlayerSeated && (
                      <InfoPill>Sit down to join the game!</InfoPill>
                    )}
                    {currentTable.winMessages.length > 0 && (
                      <InfoPill>
                        {
                          currentTable.winMessages[
                            currentTable.winMessages.length - 1
                          ]
                        }
                      </InfoPill>
                    )}
                  </>
                )}
              </PositionedUISlot>
              <PositionedUISlot
                bottom="25%"
                scale="0.60"
                origin="center center"
              >
                {currentTable.winMessages.length === 0 && (
                  <GameStateInfo currentTable={currentTable} />
                )}
              </PositionedUISlot>
            </>
          )}
        </PokerTableWrapper>

        {currentTable &&
          isPlayerSeated &&
          currentTable.seats[seatId] &&
          currentTable.seats[seatId].turn && (
            <GameUI
              currentTable={currentTable}
              seatId={seatId}
              bet={bet}
              setBet={setBet}
              raise={raise}
              standUp={standUp}
              fold={fold}
              check={check}
              call={call}
            />
          )}
      </Container>
    </>
  );
};

export default withRouter(Play);
