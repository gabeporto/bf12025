import * as xlsx from "xlsx";
import * as fs from "fs";

import { BF1_DRIVERS, F1_DRIVERS } from "@/lib/constants";
const workbook = xlsx.readFile("lib/F1_LAST_BET.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

const BF1_BETS = data.map((row: any, index: number) => {
  const driver = row["Driver"].toUpperCase();

  const driverFiltered = BF1_DRIVERS.find((d) => d.nickname === driver);

  if (driverFiltered) {
    const p0 = F1_DRIVERS.find((d) => d.nickname === row["Pole"])?.id;
    const positions = [
      F1_DRIVERS.find((d) => d.nickname === row["P1"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P2"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P3"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P4"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P5"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P6"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P7"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P8"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P9"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P10"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P11"])?.id,
      F1_DRIVERS.find((d) => d.nickname === row["P12"])?.id,
    ];

    const positionCounts: Record<string, number> = {};
    positions.forEach((position) => {
      if (position) {
        positionCounts[position] = (positionCounts[position] || 0) + 1;
      }
    });

    const validatedPositions = positions.map((position) => {
      if (position && positionCounts[position] > 1) {
        return "-";
      }
      return position || "-";
    });

    return {
      id: driverFiltered.id,
      betterName: driverFiltered.betterName,
      nickname: driverFiltered.id,
      photo: `/drivers/${driverFiltered.nickname.toLowerCase()}.png`,
      team: driverFiltered.team,
      teamPhoto: `/teams/${driverFiltered.team}.png`,
      polePosition: p0,
      positions: {
        0: validatedPositions[0],
        1: validatedPositions[1],
        2: validatedPositions[2],
        3: validatedPositions[3],
        4: validatedPositions[4],
        5: validatedPositions[5],
        6: validatedPositions[6],
        7: validatedPositions[7],
        8: validatedPositions[8],
        9: validatedPositions[9],
        10: validatedPositions[10],
        11: validatedPositions[11],
      },
    };
  }
});

//console.log(JSON.stringify(BF1_BETS, null, 2));
fs.writeFileSync("BF1_BETS.json", JSON.stringify(BF1_BETS, null, 2));

console.log("Array BF1_BETS gerado com sucesso!");