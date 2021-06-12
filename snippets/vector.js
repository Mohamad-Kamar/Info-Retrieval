//Documents and queries are compared using the cosine similarity measure
//Similarity varies between +1 and 0
// +1 => Highly similar
// 0 => not similar

const vector = (doc, query) => {
    let numerator = 0;
    let denominator = 0;
    //numerator is the sum of product of the elements
    for (let i = 0; i < doc.length; i++) {
        numerator += doc[i] * query[i];
    }

    //denominator is the squar root of: product of the squar of the sums of each element
    let sumDoc = 0;
    let sumQuery = 0;
    for (let i = 0; i < doc.length; i++) {
        sumDoc += Math.pow(doc[i], 2);
        sumQuery += Math.pow(query[i], 2);
    }
    denominator = Math.sqrt(sumDoc * sumQuery);
    return numerator / denominator;
};

//First example
/*
const doc1 = [1, 1];
const doc2 = [0, 1];
const query = [1, 0];

console.log(vector(doc1, query));
console.log(vector(doc2, query));
*/

//Second example
/*
const doc1 = [1, 0, 1, 0];
const query = [1, 1, 0, 1];
console.log(vector(doc1, query));
*/

//Third example
/*
const doc1 = [1, 1, 0, 0];
const doc2 = [0, 0, 1, 1];
const doc3 = [1, 0, 0, 0];
const doc4 = [1, 0, 1, 0];
const doc5 = [0, 1, 0, 1];
const query = [1, 0, 1, 0];
console.log(vector(doc1, query));
console.log(vector(doc2, query));
console.log(vector(doc3, query));
console.log(vector(doc4, query));
console.log(vector(doc5, query));
*/
