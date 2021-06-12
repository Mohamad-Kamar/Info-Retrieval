let hamming = (arr1, arr2) => {
    let dist = 0;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] == arr2[i]) dist += 1;
    }
    return dist;
};
const doc1 = [1, 1, 0];
const doc2 = [0, 1, 0];

console.log(hamming(doc1, doc2));
