import Axios from "axios";

const useGameState = () => {

  const loadGameState = async () => {
    try {
      const res = await Axios.get("/api/gamestate");
      console.log("data", res.data);
      return res.data;

    } catch (error) {
      console.log(error);
    }
  };


  return [loadGameState];
};

export default useGameState;
