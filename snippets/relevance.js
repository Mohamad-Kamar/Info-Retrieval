const relevance = (retrievedDocs, relevantDocs) => {
    let releventNames = new Set(relevantDocs);
    let relevantRetrieved = 0;
    let retrieved = 0;
    let returnedArray = retrievedDocs.map((docName, idx) => {
        if (releventNames.has(docName)) {
            relevantRetrieved++;
        }
        retrieved++;
        let precision = relevantRetrieved / retrieved;
        let recall = relevantRetrieved / releventNames.size;
        return {
            Rank: idx + 1,
            Recall: Number.parseFloat(recall).toPrecision(4),
            Precision: Number.parseFloat(precision).toPrecision(4)
        };
    });
    return returnedArray;
};

const getRelevance = (relevance) => {
    let newArr = [
        {
            Recall: relevance[0]["Recall"],
            Precision: [+relevance[0]["Precision"]]
        }
    ];

    for (let i = 1; i < relevance.length; i++) {
        const currElem = relevance[i];

        if (currElem["Recall"] === newArr[newArr.length - 1]["Recall"]) {
            newArr[newArr.length - 1]["Precision"].push(+currElem["Precision"]);
        } else {
            newArr.push({
                Recall: relevance[i]["Recall"],
                Precision: [+relevance[i]["Precision"]]
            });
        }
    }
    return newArr.map(({ Recall, Precision }) => {
        return {
            Recall,
            Precision:
                Precision.reduce((prev, curr) => prev + curr) / Precision.length
        };
    });
};

const retrievedDocs = [
    "doc1",
    "doc2",
    "doc3",
    "doc4",
    "doc5",
    "doc6",
    "doc7",
    "doc8",
    "doc9",
    "doc10"
];
const relevantDocs = ["doc1", "doc2", "doc5", "doc9"];

//Array of objects [{ Rank: 1, Recall: '0.2500', Precision: '1.000' }]
const res = relevance(retrievedDocs, relevantDocs);
// res.forEach((elem) => console.log(elem));
const newTable = getRelevance(res);
newTable.forEach((elem) => console.log(elem));
