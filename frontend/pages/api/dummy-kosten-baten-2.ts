export default function handler(req, res) {
    const data = {
        "Type A": {
            Afschrijving: "-60",
            Huishouden: null,
            "Commercieel bedrijf": "50",
            Overheidsinstelling: "70",
            Energieleverancier: "-200",
            Netbeheerder: "-200",
            Overheid: "125",
            "Netto kosten": "-335",
        },
        "Type B": {
            Afschrijving: "20",
            Huishouden: "-40",
            "Commercieel bedrijf": "25",
            Overheidsinstelling: "15",
            Energieleverancier: "-200",
            Netbeheerder: "-100",
            Overheid: "-50",
            "Netto kosten": "-350",
        },
    }

    res.status(200).json(data)
}
