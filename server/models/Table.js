const { model, Schema, createConnection } = require("mongoose");
const conf = require("../config");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(createConnection(conf.MONGO_URI));

const gameSchema = () => {
  const gameSchema = new Schema(
    {
      id: { type: String, required: true },
      maxPlayers: { type: String, required: true },
      name: { type: String, required: true },
      limit: { type: Number, required: true },
      players: {
        type: Array,
        default: [],
      },
      seats: {
        type: Object,
        default: null,
      },
      board: Array,
      deck: {
        type: Object,
        default: null,
      },
      button: Number,
      turn: Number,
      pot: {
        type: Number,
        default: 0,
      },
      mainPot: {
        type: Number,
        default: 0,
      },
      callAmount: Number,
      minBet: {
        type: Number,
        default: 0,
      },
      minRaise: {
        type: Number,
        default: 0,
      },
      smallBlind: Number,
      bigBlind: Number,
      handOver: {
        type: Boolean,
        default: true,
      },
      winMessages: {
        type: Array,
        default: [],
      },
      wentToShowdown: {
        type: Boolean,
        default: false,
      },
      sidePots: {
        type: Array,
        default: [],
      },
      history: {
        type: Array,
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

  return model("gameTable", gameSchema);
};

const playerSchema = () => {
  const playerSchema = new Schema(
    {
      playerName: {
        type: String,
        required: true,
      },
      // bankroll: {
      //   type: Number,
      //   required: true,
      // },
      tableId: {
        type: String,
        require: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return model("players", playerSchema);
};

const gameResultSchema = () => {
  const gameResultSchema = new Schema(
    {
      player: {
        type: String,
        require: true,
      },
      winBet: {
        type: Number,
        require: true,
      },
      // loseBet: {
      //   type: Number,
      //   require: true,
      // },
    },
    {
      timestamps: true,
    }
  );
  return model("gameresult", gameResultSchema);
};

const tournamentSchema = () => {
  const userschema = new Schema(
    {
      maxplayers: {
        type: String,
        required: true,
      },
      minplayers: {
        type: String,
        default: 0,
      },
      matchtext: {
        type: String,
        default: "",
      },

      registtime: {
        type: Date,
        default: "",
      },
      starttime: {
        type: Date,
        required: true,
      },
      endtime: {
        type: Date,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      gameVarient: {
        type: String,
        default: "NLHoldem",
      },
      tableSeat: {
        type: Number,
        default: 0,
      },
      blindAmount: {
        type: Number,
        default: 50,
      },
      gameSpeed: {
        type: Number,
        default: 20,
      },
      started: {
        type: Boolean,
        default: false,
      },
      firstround: {
        type: Boolean,
        default: true,
      },
      owner: {
        type: String,
        default: "",
      },
      clubName: {
        type: String,
        default: "",
      },
      club: {
        type: String,
        default: "",
      },
      gpassword: {
        type: String,
        default: "",
      },
      prizePercent: {
        type: String,
        default: "",
      },
      prizeType: {
        type: String,
        default: "",
      },
      prize: {
        type: Number,
        default: 5,
      },
      players: {
        type: Object,
        default: [],
      },
      joinplayers: {
        type: Object,
        required: true,
      },
      totalChip: {
        type: Number,
        default: 0,
      },
      option: {
        type: String,
        default: "",
      },
      prizeContract: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: "",
      },
      tournamentID: {
        type: String,
        default: "",
      },
      tournamenttype: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

  userschema.plugin(autoIncrement.plugin, {
    model: "tournament",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  });

  return model("tournament", userschema);
};

const tournamentJoinplayers = () => {
  const userschema = new Schema(
    {
      playerid: {
        type: Schema.Types.ObjectId,
        ref: "players",
      },
      tournamentid: {
        type: Schema.Types.ObjectId,
        ref: "tournaments",
      },
      chip: {
        type: Number,
        default: 0,
      },
      joinstate: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  userschema.plugin(autoIncrement.plugin, {
    model: "tournamentJoinplayer",
    field: "id",
    startAt: 1,
    incrementBy: 1,
  });
  return model("tournamentjoinplayers", userschema);
};

module.exports = {
  gametable: gameSchema(),
  gameresult: gameResultSchema(),
  joinplayer: playerSchema(),
  newTournament: tournamentSchema(),
  tournamentJoinplayers: tournamentJoinplayers(),
};
