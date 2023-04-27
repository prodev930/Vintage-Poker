import React, { useContext, useEffect, useState } from "react";
import Container from "../components/layout/Container";
import Heading from "../components/typography/Heading";
import PropTypes from "prop-types";
import ColoredText from "../components/typography/ColoredText";
import kingImg from "../assets/img/king-rounded-img@2x.png";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import useScrollToTopOnPageLoad from "../hooks/useScrollToTopOnPageLoad";
import globalContext from "../context/global/globalContext";
import contentContext from "../context/content/contentContext";
// import modalContext from "../context/modal/modalContext";
import gameContext from "../context/game/gameContext";
import socketContext from "../context/websocket/socketContext";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import uuid from "uuid";
import { Stack, Typography } from "@mui/material";

import useGameState from "../hooks/useGameState";

const WelcomeHeading = styled(Heading)`
  @media screen and (min-width: 468px) and (min-height: 600px) {
    margin: 2rem auto;
  }

  @media screen and (max-width: 900px) and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
`;

const MainMenuWrapper = styled.div`
  margin: 0 0 auto 0;
  display: grid;
  justify-content: center;
  align-content: center;
  grid-template-columns: repeat(2, minmax(250px, auto));
  grid-template-rows: repeat(2, minmax(250px, auto));
  grid-gap: 2rem;
  max-width: 600px;

  @media screen and (max-width: 900px) and (max-height: 450px) and (orientation: landscape) {
    grid-template-columns: repeat(4, 140px);
    grid-template-rows: repeat(1, minmax(140px, auto));
    grid-gap: 1rem;
  }

  @media screen and (max-width: 590px) and (max-height: 420px) and (orientation: landscape) {
    grid-template-columns: repeat(4, 120px);
    grid-template-rows: repeat(1, minmax(120px, auto));
    grid-gap: 1rem;
  }

  @media screen and (max-width: 468px) {
    grid-template-columns: repeat(1, auto);
    grid-template-rows: repeat(4, auto);
    grid-gap: 1rem;
  }
`;

const MainMenuCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.playingCardBg};
  border-radius: ${(props) => props.theme.other.stdBorderRadius};
  padding: 1.5rem 2rem;
  box-shadow: ${(props) => props.theme.other.cardDropShadow};

  &,
  & > * {
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
  }

  ${Heading} {
    margin-bottom: 0;
    color: ${(props) => props.theme.colors.primaryCta};
    word-wrap: break-word;
  }

  img {
    margin: 1rem;
    width: 75%;
    max-width: 170px;
  }

  @media screen and (min-width: 648px) {
    font-size: 3rem;
  }

  @media screen and (max-width: 648px) {
    padding: 0.5rem;
  }

  @media screen and (max-width: 468px) {
    flex-direction: row;
    justify-content: space-between;
    border-radius: 90px 40px 40px 90px;
    padding: 0 1rem 0 0;

    ${Heading} {
      text-align: right;
      margin: 0 1rem;
    }

    img {
      max-width: 80px;
      margin: 0;
    }
  }
`;

const MainPage = ({ history }) => {
  const [loadGameState] = useGameState();
  const { userName } = useContext(globalContext);
  const { socket } = useContext(socketContext);
  const { getLocalizedString } = useContext(contentContext);
  const { TABLE_TYPE, tableList, createTable, joinTable,setTableList } =
    useContext(gameContext);

  useScrollToTopOnPageLoad();
  const play = (id) => {
    socket && joinTable(id);
    history.push("/play");
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setInputValues({
      inputValue1: uuid.v4(),
      inputValue2: "",
      inputValue3: "",
      inputValue4: "",
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    loadGameState().then((res) => {
      let { tables } = res;
      setTableList(tables);
    });
   
  }, [])
  

  const [inputValues, setInputValues] = React.useState({
    inputValue1: uuid.v4(),
    inputValue2: "",
    inputValue3: "",
    inputValue4: "",
  });

  const handleClick =  () => {
    if (
      inputValues.inputValue1 === "" ||
      inputValues.inputValue2 === "" ||
      inputValues.inputValue3 === "" ||
      inputValues.inputValue4 === ""
    ) {
      setOpen(false);
      return;
    } else {
      createTable(
        inputValues.inputValue1,
        inputValues.inputValue2,
        inputValues.inputValue3,
        inputValues.inputValue4
      );
      setOpen(false);
    }
  };

  return (
    <Container
      fullHeight
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      padding="6rem 2rem 2rem 2rem"
    >
      <WelcomeHeading as="h2" textCentered>
        {getLocalizedString("main_page-salutation")}{" "}
        <ColoredText>{userName}!</ColoredText>
      </WelcomeHeading>

      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          Create room
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"CREATE ROOM"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Stack>
                <Stack
                  md="12"
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Stack md="6">
                    <Typography>
                      <TextField
                        value={inputValues.inputValue1}
                        onChange={(e) =>
                          setInputValues({
                            ...inputValues,
                            inputValue1: e.target.value,
                          })
                        }
                        disabled
                        size="small"
                        id="_tableUuid"
                        defaultValue={inputValues.inputValue1}
                      />
                    </Typography>
                  </Stack>
                  <Stack md="6">
                    <FormControl sx={{ m: 1, minWidth: 205 }} size="small">
                      <InputLabel id="demo-select-label">Table_Type</InputLabel>
                      <Select
                        value={inputValues.inputValue2}
                        onChange={(e) =>
                          setInputValues({
                            ...inputValues,
                            inputValue2: e.target.value,
                          })
                        }
                        labelId="demo-select-small-label"
                        id="demo-select-small _tableType"
                        label="Count"
                      >
                        <MenuItem value={TABLE_TYPE.SIX}>
                          {TABLE_TYPE.SIX}
                        </MenuItem>
                        <MenuItem value={TABLE_TYPE.NINE}>
                          {TABLE_TYPE.NINE}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-around"}>
                  <Stack>
                    <TextField
                      value={inputValues.inputValue3}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          inputValue3: e.target.value,
                        })
                      }
                      id="outlined-basic _tableName"
                      size="small"
                      label="TABLE_NAME"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack>
                    <TextField
                      style={{ width: "210px" }}
                      value={inputValues.inputValue4}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          inputValue4: e.target.value,
                        })
                      }
                      type="number"
                      id="_limit"
                      inputProps={{ min: 1000, max: 50000 }}
                      min={1000}
                      size="small"
                      label="Chip_Limit"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Stack>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClick} autoFocus>
              Create
            </Button>
            <Button onClick={handleClose}>Disagree</Button>
          </DialogActions>
        </Dialog>
      </div>
      <MainMenuWrapper>
        {tableList &&
          Object.keys(tableList).map((id) => (
            <MainMenuCard key={id} onClick={() => play(id)}>
              <img src={kingImg} alt="Join" />
              <Heading as="h3" headingClass="h5" textCentered>
                {tableList[id].name}
              </Heading>
            </MainMenuCard>
          ))}
      </MainMenuWrapper>
    </Container>
  );
};

MainPage.propTypes = {
  userName: PropTypes.string,
};

export default withRouter(MainPage);
