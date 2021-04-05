const fs = require('fs');
const sw = require('stopword')
const stemmer = require('./stemmer').stemmer;
const SAMPLE_TEXT_FOLDER_NAME = './SampleTexts';
const STP_FOLDER_NAME = './StpFiles'
const SFX_FOLDER_NAME = './SfxFiles'
const JSON_FOLDER_NAME = './JSONFiles'

function main(){

    let fileNames = fs.readdirSync(SAMPLE_TEXT_FOLDER_NAME)
        .filter(file=>file.substring(file.lastIndexOf('.')+1) == 'txt')
        .map(file=>file.substring(0,file.lastIndexOf('.')));

    fileNames.forEach(fileName => console.log(fileName))

    for(let fileName of fileNames){
        const text = getText(fileName);


        const stpArray = textToStpArray(text);
        const stemmedArray = stpArray.map(word => stemmer(word)).filter(word => word);


        const stpText = stpArray.join("\n");
        const stemmedWords = stemmedArray.join('\n');

        const wordCountsObj = countWords(stemmedArray);

        const wordCountsStr = JSON.stringify(wordCountsObj,null,2)

        writeToStpFile(fileName,stpText);
        writeToSfxFile(fileName,stemmedWords);
        writeToJSONFile(fileName,wordCountsStr);   
    }

}
function getText(fileName){
    try {
        if (!fs.existsSync(SAMPLE_TEXT_FOLDER_NAME)){
            fs.mkdirSync(SAMPLE_TEXT_FOLDER_NAME);
        }
        const data = fs.readFileSync(`${SAMPLE_TEXT_FOLDER_NAME}/${fileName}.txt`, 'utf8')
        // console.log(data)
        return data;
    }
    catch (err) {
        throw Error("Error at Reading the txt file")
    }
}


function textToStpArray(text){
    try{
        const pureTextArray = text.split(/\W+/g);
        const stopTextArray = sw.removeStopwords(pureTextArray);
        return stopTextArray;
    }
    catch(error){
        console.log(error);
    }

}


function countWords(stemmedArray){
    let wordCountsObj = {};
    stemmedArray.forEach(word=>{
        if (word in wordCountsObj)
            wordCountsObj[word] += 1
        else
            wordCountsObj[word] = 1
    })
    return wordCountsObj;
}

function writeToStpFile(fileName,content){
    try {
        if (!fs.existsSync(STP_FOLDER_NAME)){
            fs.mkdirSync(STP_FOLDER_NAME);
        }
        const data = fs.writeFileSync(`${STP_FOLDER_NAME}/${fileName}.stp`, content,{ flag: 'w+' })
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}
function writeToSfxFile(fileName,content){
    try {
        if (!fs.existsSync(SFX_FOLDER_NAME)){
            fs.mkdirSync(SFX_FOLDER_NAME);
        }
        const data = fs.writeFileSync(`${SFX_FOLDER_NAME}/${fileName}.sfx`, content,{ flag: 'w+' });
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}



function writeToJSONFile(fileName,wordCounts){
    try {
        if (!fs.existsSync(JSON_FOLDER_NAME)){
            fs.mkdirSync(JSON_FOLDER_NAME);
        }
        const data = fs.writeFileSync(`${JSON_FOLDER_NAME}/${fileName}.json`, wordCounts,{ flag: 'w+' });
        //file written successfully
        } catch (err) {
            console.error(err)
        }     
}


main()

// let s = `! @ # % ^ & * ( ) _ + | \ = - { 
// } ] [ : ” ’ ; ? > < , . /`
// let newS = s.trim().split(" ").join("");
// console.log(newS);

