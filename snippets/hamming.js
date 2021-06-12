let hamming = (arr1, arr2) => {
    let dist = 0;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] == arr2[i]) dist += 1;
    }
    return dist;
};
const doc1 = [1, 1, 0, 0];
const doc2 = [0, 0, 1, 1];
const doc3 = [1, 0, 0, 1];
const query = [1, 0, 1, 0];

console.log(hamming(doc1, query));
console.log(hamming(doc2, query));
console.log(hamming(doc3, query));
