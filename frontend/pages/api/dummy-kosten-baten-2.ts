export default function handler(req, res) {
    const data = {
        "Type A": {
          "Sociaal-cultureel": "-60",
          Wederik: null,
          "Netbeheerder": "110",
          "Romanist": "140",
          Energieleverancier: "-200",
          "Netto kosten": "-150",
        },
        "Commercieel bedrijf": {
          "Cociaal-cultureel": "60",
          Wederik: "25",
          "Netbeheerder": "225",
          "Romanist": "400",
          Energieleverancier: "-200",
          "Netto kosten": "150",
        },
      };

    res.status(200).json(data);
  }
  