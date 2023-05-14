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
  points?: number;
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
        const { score, team1, team2 } = curr;

        const { ft } = score ?? {};

        const [team1Score = 0, team2Score = 0] = ft ?? [];

        acc[team1] = acc[team1] ?? {};

        acc[team2] = acc[team2] ?? {};

        const {
          gamesDrawn: gamesDrawnTeam1 = 0,
          gamesLost: gamesLostTeam1 = 0,
          gamesPlayed: gamesPlayedTeam1 = 0,
          gamesWon: gamesWonTeam1 = 0,
          goalDifference: goalDifferenceTeam1 = 0,
          goalsConceded: goalsConcededTeam1 = 0,
          goalsScored: goalsScoredTeam1 = 0,
          points: pointsTeam1 = 0,
        } = acc[team1];

        const {
          gamesDrawn: gamesDrawnTeam2 = 0,
          gamesLost: gamesLostTeam2 = 0,
          gamesPlayed: gamesPlayedTeam2 = 0,
          gamesWon: gamesWonTeam2 = 0,
          goalDifference: goalDifferenceTeam2 = 0,
          goalsConceded: goalsConcededTeam2 = 0,
          goalsScored: goalsScoredTeam2 = 0,
          points: pointsTeam2 = 0,
        } = acc[team2];

        if (score !== undefined) {
          acc[team1].gamesPlayed = gamesPlayedTeam1 + 1;
          acc[team2].gamesPlayed = gamesPlayedTeam2 + 1;
        }

        if (ft !== undefined) {
          const goalDifference = team1Score - team2Score;

          if (goalDifference === 0) {
            acc[team1].gamesDrawn = gamesDrawnTeam1 + 1;

            acc[team2].gamesDrawn = gamesDrawnTeam2 + 1;

            acc[team1].points = pointsTeam1 + 1;

            acc[team2].points = pointsTeam2 + 1;
          } else if (goalDifference > 0) {
            acc[team1].gamesWon = gamesWonTeam1 + 1;

            acc[team2].gamesLost = gamesLostTeam2 + 1;

            acc[team1].points = (acc[team1].points ?? 0) + 3;

            acc[team1].goalDifference = goalDifferenceTeam1 + goalDifference;

            acc[team2].goalsConceded = goalsConcededTeam2 + team1Score;

            acc[team1].goalsScored = goalsScoredTeam1 + team1Score;
          } else {
            acc[team1].gamesLost = gamesLostTeam1 + 1;

            acc[team2].gamesWon = gamesWonTeam2 + 1;

            acc[team2].points = (acc[team2].points ?? 0) + 3;

            acc[team1].goalDifference = goalDifferenceTeam2 + goalDifference;

            acc[team1].goalsConceded = goalsConcededTeam1 + team2Score;

            acc[team2].goalsScored = goalsScoredTeam2 + team2Score;
          }
        }

        return acc;
      }, {});

      console.log(stat);
    }

    const url =
      "https://raw.githubusercontent.com/openfootball/football.json/master/2020-21/en.1.json";

    fetch(url)
      .then(async (res) => {
        const actualRes = (await res.json()) as ResFromAPI;

        formatStat(actualRes);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return <></>;
}

export default App;
