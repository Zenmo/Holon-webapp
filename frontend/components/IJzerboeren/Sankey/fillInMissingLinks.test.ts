import {sortByLengthDesc, uniqueZeroLinks} from "@/components/IJzerboeren/Sankey/fillInMissingLinks"
import {SankeyLink} from "@/components/IJzerboeren/Sankey/link"

describe(sortByLengthDesc.name, () => {
    test("can sort", () => {
        const input: number[][] = [
            [1,2],
            [1],
            [1,2,3,4],
        ]

        const output = sortByLengthDesc(input)

        expect(output).toStrictEqual([
            [1,2,3,4],
            [1,2],
            [1],
        ])
    })
})

describe(uniqueZeroLinks.name, () => {
    test("works on one element", () => {
        const input: SankeyLink[][] = [
            [
                {source: "a", target: "b", value: 1},
            ],
            [
                {source: "a", target: "b", value: 2},
            ],
        ]

        const output = uniqueZeroLinks(input)

        expect(output).toStrictEqual([
            {source: "a", target: "b", value: 0},
        ])
    })
})
