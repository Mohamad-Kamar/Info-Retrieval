const getTermFrequency = (term, doc) => {
    return doc.filter((elem) => elem === term).length;
};

const getDocumentFrequency = (term, documents) => {
    return documents.filter((doc) => doc.find((elem) => elem === term)).length;
};

const getBaseLog = (x, y) => {
    return Math.log(y) / Math.log(x);
};
const getInverseDocumentFrequency = (term, documents) => {
    let quotient = documents.length / getDocumentFrequency(term, documents);
    return getBaseLog(10, quotient);
};

const getTFIDF = (term, doc, documents) => {
    return (
        getTermFrequency(term, doc) *
        getInverseDocumentFrequency(term, documents)
    );
};

//Example
const doc0 = ["pen", "cat", "cow", "horse"];
const doc1 = ["dog", "cow", "horse", "tv", "tv", "book"];
const doc2 = ["dog", "house", "cup"];
const doc3 = ["pen", "house", "horse", "tv", "tv"];
const doc4 = ["dog", "cat", "horse", "girl"];
const doc5 = ["pen", "girl", "book", "tv", "tv", "book"];
const doc6 = ["dog", "carpet", "carpet", "girl"];
const doc7 = ["pen", "cat", "house", "boy", "tv", "tv", "horse"];

let documents = [doc0, doc1, doc2, doc3, doc4, doc5, doc6, doc7];

let allWords = new Set();
documents.forEach((doc) => doc.forEach((elem) => allWords.add(elem)));

const mapped = Array.from(allWords).map((term) => {
    let newObj = { term, scores: {} };
    documents.forEach((doc, idx) => {
        newObj.scores["doc" + idx] = getTFIDF(term, doc, documents);
    });
    return newObj;
});

mapped.forEach(console.log);
