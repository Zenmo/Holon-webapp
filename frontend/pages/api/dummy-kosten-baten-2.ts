export default function handler(req, res) {
    const data = {
        Huishouden: {
          Afschrijving: "-60",
          Huishouden: null,
          "Commercieel bedrijf": "0",
          Overheidsinstelling: "0",
          Energieleverancier: "-200",
          Netbeheerder: "-200",
          Overheid: "125",
          "Netto kosten": "-335",
        },
        "Commercieel bedrijf": {
          Afschrijving: "0",
          Huishouden: "0",
          "Commercieel bedrijf": null,
          Overheidsinstelling: "0",
          Energieleverancier: "-200",
          Netbeheerder: "-100",
          Overheid: "-50",
          "Netto kosten": "-350",
        },
        Overheidsinstelling: {
          Afschrijving: "-20",
          Huishouden: "0",
          "Commercieel bedrijf": "0",
          Overheidsinstelling: null,
          Energieleverancier: "-100",
          Netbeheerder: "-200",
          Overheid: "-75",
          "Netto kosten": "-395",
        },
      };

    res.status(200).json(data);
  }
  