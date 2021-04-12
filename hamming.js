const { textToStpArray, stpToStemmer, getText } = require('./utils');

function main(){
    //getting  query text
    let query = 'Some number of words';


    //creating daata structure to calculate hamming distance
    const stpArray = textToStpArray(query);
    const stemmedArray = stpToStemmer(stpArray);
    let allWords = Object.keys(require('./allWords/allWords'));
    let allDocNameCounts = require('./JSON/Counts');
    let newStruct = {}
    allWords.forEach(word=>{
        newStruct[word] = {}
        let tempStruct = newStruct[word]
        allDocNameCounts.forEach(docCount=>{
            let docName = docCount.name;
            let docObj = docCount.wordObj;
            if(word in docObj){
                tempStruct[docName] = docObj[word];
            }
            else{
                tempStruct[docName] = 0;
            }
        })
        newStruct[word] = tempStruct;
    })

    let hammingObj = {}
    stemmedArray.forEach(word=>{
        hammingObj[word]={}
    })
    allDocNameCounts.forEach(doc=>{
        const { name, wordObj } = doc;
        if (wordObj[word])
            hammingObj[word][name] = wordObj[word]
        else{
            hammingObj[word][name] = 0;
        }
    })
    stemmedArray.forEach(word=>{

    })
    console.log(newStruct)
}

main()