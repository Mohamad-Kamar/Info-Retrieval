const fs = require('fs');
const sw = require('stopword')
const stemmer = require('./stemmer').stemmer;
function getText(fileName){
    try {
        const data = fs.readFileSync(`./SampleTexts/${fileName}.txt`, 'utf8')
        // console.log(data)
        return data;
    }
    catch (err) {
        throw Error("Error at Reading the txt file")
    }
}

function textToStpArray(text){
    try{
        const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const pureTextArray = text.split(/\W+/g);
        const stopTextArray = sw.removeStopwords(pureTextArray);
        return stopTextArray;
    }
    catch(error){
        console.log(error);
    }

}

function writeToStpFile(fileName,content){
    try {
        const data = fs.writeFileSync(`./StpFiles/${fileName}.stp`, content,{ flag: 'w+' })
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}
function writeToSfxFile(fileName,content){
    try {
        const data = fs.writeFileSync(`./SfxFiles/${fileName}.sfx`, content,{ flag: 'w+' })
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}
function main(originalFilename){
    let fileName = originalFilename;
    
    const text = getText(fileName);
    const stpArray = textToStpArray(text);

    const stpText = stpArray.join("\n");
    writeToStpFile(fileName,stpText);

    const stemmedWords = stpArray.map(word => stemmer(word)).filter(word => word).join('\n');
    writeToSfxFile(fileName,stemmedWords);

}
main('myaw');






// let s = `! @ # % ^ & * ( ) _ + | \ = - { 
// } ] [ : ” ’ ; ? > < , . /`
// let newS = s.trim().split(" ").join("");
// console.log(newS);

