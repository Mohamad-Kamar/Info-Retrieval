const getRelevantDocs = (docs) => docs.filter((elem) => elem.R);
const getNonRelevantDocs = (docs) => docs.filter((elem) => !elem.R);
const getTermsSum = (termsArr, size) => {
    let newArr = [];
    for (let i = 0; i < size; i++) {
        let total = 0;
        termsArr.forEach((terms) => (total += terms[i]));
        newArr.push(total);
    }
    return newArr;
};
const getRelevanceFeedback = (
    docs,
    query,
    iters,
    alpha = 1,
    beta = 1,
    gamma = 1
) => {
    let newQuery = [...query];
    for (let i = 0; i < iters; i++) {
        const relDocs = getRelevantDocs(docs).map((elem) => elem.terms);
        const nonRelDocs = getNonRelevantDocs(docs).map((elem) => elem.terms);
        let firstTerm = getTermsSum(relDocs, newQuery.length).map(
            (elem) => elem / relDocs.length
        );
        let secondTerm = getTermsSum(nonRelDocs, newQuery.length).map(
            (elem) => elem / nonRelDocs.length
        );
        for (let j = 0; j < newQuery.length; j++) {
            newQuery[j] =
                alpha * newQuery[j] +
                beta * firstTerm[j] -
                gamma * secondTerm[j];
        }
    }
    return newQuery;
};

const D1 = { name: "D1", R: true, terms: [4, 1, 1] };
const D2 = { name: "D1", R: true, terms: [3, 0, 2] };
const D3 = { name: "D1", R: false, terms: [0, 0, 1] };
const docs = [D1, D2, D3];
const query = [0, 1, 0];

const results = getRelevanceFeedback(docs, query, 1, 2, 1, 1);
results.forEach((elem) => console.log(elem));
