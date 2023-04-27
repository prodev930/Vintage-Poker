const {
  tournamentJoinplayers,
  joinplayer,
  gametable,
  gameresult,
} = require("../models/Table");
// const { dbSave } = require("./index")
// const { tournamentregister, tournamentjoin, tournamentleft } = require("../pokergame/NewTable")
const Mongoose = require("mongoose");
const { isObject } = require("lodash");
const { usermodel } = require("../models/User");
const { default: mongoose } = require("mongoose");

exports.createTable = async (id, maxPlayers, name, limit) => {
  let newTable = new gametable({
    id,
    maxPlayers,
    name,
    limit,
  });

  newTable.save((err, user) => {
    if (err) {
    } else {
    }
  });
};

exports.getTableList = async () => {
  try {
    const tableList = await gametable.find();
    return {
      status: true,
      tables: tableList,
    };
  } catch (err) {
    return {
      state: false,
    };
  }
};

exports.playerState = async (player, table) => {
  let newPlayer = new joinplayer({
    playerName: player.name,
    // bankroll: player.bankroll,
    tableId: table.id,
  });
  newPlayer.save((err) => {
    if (err) {
    } else {
    }
  });
};

exports.gameresultState = async (player, winAmount) => {
  let newPlayer = new gameresult({
    player: "player",
    winBet: "winAmount",
  });
  newPlayer.save((err) => {
    if (err) {
    } else {
    }
  });
};

// exports.tournamentregister = async (req, res) => {
//     let { id } = req.body
//     let rdata = await tournamentregister(id, req.user.id)
//     if (rdata.status) {
//         res.send({
//             status: true,
//             data: rdata.data
//         })
//     } else {
//         res.send({
//             status: false,
//             data: rdata.message
//         })
//     }
// }

// exports.tournamentJoin = async (req, res, next) => {
//     let sh = await tournamentjoin(req.user.id, req.body.id)
//     if (sh) {
//         res.send({
//             status: true,
//             data: sh
//         })
//     } else {
//         res.send({
//             status: false,
//             data: "error"
//         })
//     }
// }

// exports.tournamentLeft = async (req, res, next) => {
//     let sh = await tournamentleft(req.user.id, req.body.tournamentid)
//     if (sh) {
//         res.send({
//             status: true,
//             data: sh
//         })
//     } else {
//         res.send({
//             status: false,
//             data: "error"
//         })
//     }
// }

// exports.createTournament = async (req, res, next) => {
//     let {
//         matchname, matchtext, starttime, registtime, temptype, templimit, sb, bb, tdata, gspeed, gmax, gmin, gchip, gseat, goption, gpassword, contract, prizeAmount, prizeContract, prizetype, username, endtime, tournamentID, tournamenttype
//     } = req.body

//     const gametype = templimit + temptype
//     console.log(tournamenttype)
//     let ptype = prizetype === "ERC-20 Token" ? "ERC20" : prizetype === "NFT" ? "NFT" : prizetype === "Combo" ? "Combo" : "None"

//     let st = starttime
//     let rt = registtime
//     // let st = parseInt(new Date(starttime).valueOf() / 1000)
//     // let rt = parseInt(new Date(registtime).valueOf() / 1000)

//     let findTournament = await newTournament.findOne({ name: matchname })
//     if (findTournament) {
//         return res.status(200).json({
//             status: false,
//             error: "A tournament with the same name already exists."
//         });
//     } else {

//         let tournament = {
//             name: matchname,
//             matchtext: matchtext,
//             registtime: rt,
//             starttime: st,
//             endtime: endtime,
//             maxplayers: gmax,
//             minplayers: gmin,
//             gameVarient: gametype,
//             tableSeat: gseat,
//             blindAmount: sb,
//             gameSpeed: gspeed,
//             started: false,
//             firstround: true,
//             owner: username,
//             gpassword: gpassword,
//             prizePercent: tdata,
//             prizeType: ptype,
//             prize: prizeAmount,
//             players: [],
//             joinplayers: {
//                 p: false
//             },
//             totalChip: gchip,
//             option: goption,
//             prizeContract: prizeContract,
//             image: req.images['image'],
//             tournamentID,
//             tournamenttype
//         }

//         let newMatch = await dbSave(newTournament,
//             tournament)
//         if (newMatch) {
//             console.log(newMatch, "-newMatch--")
//             res.send({
//                 status: true,

//                 error: "Your tournament has been created successfully."
//             })
//         } else {
//             res.send({
//                 status: false,
//                 error: "Tournament Creation Failed."
//             })
//         }
//     }
// }

// exports.joinTournament = async (req, res) => {
//     let { tournamentID, tournamentName, username } = req.body

//     let ID = tournamentID.split("/")
//     let tid = ID.length === 4 ? ID[3] : ID.length === 3 ? ID[2] : ""
//     if (tournamentID && !tournamentName) {
//         let tournament = await newTournament.findOne({ tournamentID: tid })
//         if (tournament) {
//             if (tournament.clubName) {
//                 let isjoin = await usermodel.findOne({ username, 'club.clubID': { $regex: tournament.clubName, $options: 'i' } })
//                 if (isjoin) {
//                     return res.status(200).json({
//                         status: true,
//                         data: tournament,
//                         error: ""
//                     });
//                 } else {
//                     return res.status(200).json({
//                         status: false,
//                         error: "You didn't join this club."
//                     });
//                 }
//             } else {
//                 return res.status(200).json({
//                     status: true,
//                     data: tournament,
//                     error: ""
//                 });
//             }
//         } else {
//             return res.status(200).json({
//                 status: false,
//                 error: "There is no such tournament."
//             });
//         }
//     } else if (tournamentName && !tournamentID) {
//         let tournament = await newTournament.findOne({ name: tournamentName })
//         if (tournament) {
//             if (tournament.clubName) {
//                 let isjoin = await usermodel.findOne({ username, 'club.clubID': { $regex: tournament.clubName, $options: 'i' } })
//                 if (isjoin) {
//                     return res.status(200).json({
//                         status: true,
//                         data: tournament,
//                         error: ""
//                     });
//                 } else {
//                     return res.status(200).json({
//                         status: false,
//                         error: "You didn't join this club."
//                     });
//                 }
//             } else {
//                 return res.status(200).json({
//                     status: true,
//                     data: tournament,
//                     error: ""
//                 });
//             }
//         } else {
//             return res.status(200).json({
//                 status: false,
//                 error: "There is no such tournament."
//             });
//         }
//     } else if (tournamentID && tournamentName) {
//         let tournament = await newTournament.findOne({ name: tournamentName, tournamentID: tid })
//         if (tournament) {
//             if (tournament.clubName) {
//                 let isjoin = await usermodel.findOne({ username, 'club.clubID': { $regex: tournament.clubName, $options: 'i' } })
//                 if (isjoin) {
//                     return res.status(200).json({
//                         status: true,
//                         data: tournament,
//                         error: ""
//                     });
//                 } else {
//                     return res.status(200).json({
//                         status: false,
//                         error: "You didn't join this club."
//                     });
//                 }
//             } else {
//                 return res.status(200).json({
//                     status: true,
//                     data: tournament,
//                     error: ""
//                 });
//             }
//         } else {
//             return res.status(200).json({
//                 status: false,
//                 error: "There is no such tournament."
//             });
//         }
//     } else {
//         return res.status(200).json({
//             status: false,
//             error: "There is no such tournament."
//         });
//     }
// }

// exports.getminplayers = async (req, res) => {
//     let { id } = req.body
//     let tournament = await newTournament.findOne({ _id: id })
//     if (tournament) {
//         let players = await tournamentJoinplayers.find({ tournamentid: id }).count()
//         if (players >= tournament.minplayers) {
//             res.send({
//                 status: true,
//                 error: "The tournament will start in a few seconds."
//             })
//         } else {
//             res.send({
//                 status: false,
//                 error: `This tournament can only start when there are at least ${tournament.minplayers} players in the lobby.`
//             })
//         }
//     } else {
//         return res.status(200).json({
//             status: false,
//             error: "A tournament with the same name already exists."
//         });
//     }
// }

// exports.rewardjoinmoney = async (req, res) => {
//     let { id } = req.body
//     let tournament = await newTournament.findOne({ _id: id })
//     let players = await tournamentJoinplayers.aggregate([
//         {
//             $match: {
//                 tournamentid: Mongoose.Types.ObjectId(id)
//             }
//         },
//         {
//             "$lookup": {
//                 "from": "players",
//                 "localField": "playerid",
//                 "foreignField": "_id",
//                 "as": "players"
//             }
//         },
//         {
//             $unwind: "$players"
//         },
//         {
//             "$lookup": {
//                 "from": "users",
//                 "localField": "players.id",
//                 "foreignField": "_id",
//                 "as": "users"
//             }
//         },
//         {
//             $unwind: "$users"
//         },
//     ])
//     for (let i in players) {
//         await usermodel.findOneAndUpdate({ _id: players[i].users._id }, { $inc: { chipsAmount: tournament.totalChip } }, { new: true })
//     }
//     res.send({
//         state: true,
//         msg: "Sorry. The tournament has already started. You got your admission fee back."
//     })
// }

exports.changejoinstate = async (req, res) => {
  let { id } = req.body;
  let playeritem = await newplayer.findOne({ id });
  let players = await tournamentJoinplayers.findOneAndUpdate(
    { playerid: playeritem._id },
    { joinstate: true }
  );
  if (players) {
    res.send({
      state: true,
      msg: "success",
    });
  } else {
    res.send({
      state: true,
      msg: "fail",
    });
  }
};

// exports.getTournamentInformation = async (req, res) => {
//     let { id } = req.body
//     console.log(id)
//     let tournament = await tournamentJoinplayers.find({ tournamentid: id })
//     console.log(tournament.length)
//     if(tournament) {

//     }else{
//         res.send({
//             state: false,
//             msg: "No Tournament"
//         })
//     }
// }
