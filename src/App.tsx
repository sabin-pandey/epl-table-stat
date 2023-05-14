import { useEffect, useState } from "react";
import "./App.css";

type GameStatType = {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesDrawn: number;
  gamesLost: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
  points: number;
};

type Stat = Record<string, GameStatType>;

type ResFromAPI = {
  name: string;
  matches: {
    date: string;
    round: string;
    team1: string;
    team2: string;
    score?: {
      ft: number[];
    };
  }[];
};

function App() {
  const [gamesStat, setGamesStat] = useState<Stat | null | undefined>();

  useEffect(() => {
    function formatStat(res: ResFromAPI) {
      const stat = res.matches.reduce((acc: Stat, curr) => {
        acc[curr.team1] = acc[curr.team1] ?? {};

        const {
          gamesDrawn = 0,
          gamesLost = 0,
          gamesPlayed = 0,
          gamesWon = 0,
          goalDifference = 0,
          goalsConceded = 0,
          goalsScored = 0,
          points = 0,
        } = acc[curr.team1];

        acc[curr.team1] = acc[curr.team1].gamesPlayed ?? 0 + 1;
      }, []);

      console.log(stat);
    }

    const url =
      "https://raw.githubusercontent.com/openfootball/football.json/master/2020-21/en.1.json";

    fetch(url).then(async (res) => {
      const actualRes = (await res.json()) as ResFromAPI;

      formatStat(actualRes);
    });
  }, []);

  return <></>;
}

export default App;
