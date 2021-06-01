let latestFound = [
    {
        name: "doc2"
    },
    {
        name: "doc1"
    },
    {
        name: "doc3"
    }
];
let releventNames = new Set(["doc1", "doc3"]);

let relevantRetrieved = 0;
let retrieved = 0;
let returnedArray = latestFound.map((doc, idx) => {
    let docName = doc["name"];
    console.log(docName);
    if (releventNames.has(docName)) {
        relevantRetrieved++;
        retrieved++;
        let precision = relevantRetrieved / retrieved;
        let recall = relevantRetrieved / releventNames.size;
        return {
            Rank: idx + 1,
            Recall: Number.parseFloat(recall).toPrecision(4),
            Precision: Number.parseFloat(precision).toPrecision(4)
        };
    } else {
        retrieved++;
        return {
            Rank: idx + 1,
            Recall: 0,
            Precision: 0
        };
    }
});

console.log(returnedArray);
