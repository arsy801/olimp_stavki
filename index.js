import axios from "axios";

const HUITA_1 =
  "https://www.olimp.bet/api/v4/0/line/sports-with-categories-with-competitions?vids%5B%5D=";

function calc(kef1, kef2, left, right, target = 23700) {
  if (kef1 == 0 || kef2 == 0) {
    return;
  }

  let sum1, sum2;

  if (kef1 > kef2) {
    sum1 = (target / kef1) * kef2;
    sum2 = ((target + 10500) / kef2) * kef1;
  } else {
    sum1 = target / kef1;
    sum2 = (target + 10500) / kef2;
  }

  while (sum1 + sum2 > 30500) {
    if (kef1 > kef2) {
      sum1 = (target / kef1) * kef2;
      sum2 = ((target + 10500) / kef2) * kef1;
    } else {
      sum1 = target / kef1;
      sum2 = (target + 10500) / kef2;
    }

    target -= 1;
  }

  const result1 = Math.round(sum1 * kef1);
  const result2 = Math.round(sum2 * kef2 - 10500);

  if (result1 < 23250) {
    return false;
  }

  console.log(left + " - " + right + ":");
  console.log(
    `Ставка на ${left} ${Math.round(sum1)} рублей | Ставка на ${right}: ${
      Math.round(sum2) - 10500
    } рублей + 10500 фрибет`
  );
  console.log(
    `Вывод ставки на ${left}: ${Math.round(
      sum1 * kef1
    )} рублей | Вывод ставки на ${right}: ${Math.round(
      sum2 * kef2 - 10500
    )} рублей`
  );

  return true;
}

async function main() {
  const { data } = await axios.get(HUITA_1);

  let a = null;

  data.forEach(({ payload }) => {
    const asd = payload.categoriesWithCompetitions.find(
      ({ name }) => name === "CS2"
    );

    if (asd) {
      a = asd;
    }
  });

  const ids = a.competitions.map(({ id }) => id);

  ids.forEach(async (id) => {
    const a = `https://www.olimp.bet/api/v4/0/line/competitions-with-events?vids%5B%5D=${id}%3A`;

    const { data } = await axios.get(a);

    data.forEach(({ payload }) => {
      payload.events.forEach(({ outcomes, competitionName, name }) => {
        const P1 = Number(
          outcomes.find(({ shortName }) => shortName === "П1")?.probability || 0
        );
        const P2 = Number(
          outcomes.find(({ shortName }) => shortName === "П2")?.probability || 0
        );
        const TotM = Number(
          outcomes.find(({ shortName }) => shortName === "ТотМ")?.probability ||
            0
        );
        const TotB = Number(
          outcomes.find(({ shortName }) => shortName === "ТотБ")?.probability ||
            0
        );

        let abobus = false;

        if (P1 <= 2 && P2 <= 2) {
          abobus = abobus || calc(P1, P2, "P1", "P2");
          abobus = abobus || calc(P2, P1, "P2", "P1");
        }

        if (TotM <= 2 && TotB <= 2) {
          abobus = abobus || calc(TotM, TotB, "TotM", "TotB");
          abobus = abobus || calc(TotB, TotM, "TotB", "TotM");
        }

        if (abobus) {
          console.log({ P1, P2, TotM, TotB });
          console.log(competitionName, "|", name);
          console.log(
            "Дата: ",
            new Date(payload.competition.startDateTime).toLocaleString()
          );
          console.log("\n_____________________\n");
        }
      });
    });
  });
}

main();
