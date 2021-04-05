const fs = require('fs');
const sw = require('stopword')
const stemmer = require('./stemmer').stemmer;


function main(originalFilename){
    let fileName = originalFilename;
    
    const text = getText(fileName);
    const stpArray = textToStpArray(text);

    const stpText = stpArray.join("\n");
    writeToStpFile(fileName,stpText);

    const stemmedWords = stpArray.map(word => stemmer(word)).filter(word => word).join('\n');
    writeToSfxFile(fileName,stemmedWords);

}
function getText(fileName){
    try {
        const sampleTextFolderName = './SampleTexts';
        if (!fs.existsSync(sampleTextFolderName)){
            fs.mkdirSync(sampleTextFolderName);
        }
        const data = fs.readFileSync(`${sampleTextFolderName}/${fileName}.txt`, 'utf8')
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



function writeToStpFile(fileName,content){
    try {
        const stpFolderName = './StpFiles'
        if (!fs.existsSync(stpFolderName)){
            fs.mkdirSync(stpFolderName);
        }
        const data = fs.writeFileSync(`${stpFolderName}/${fileName}.stp`, content,{ flag: 'w+' })
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}
function writeToSfxFile(fileName,content){
    try {
        const sfxFolderName = './SfxFiles'
        if (!fs.existsSync(sfxFolderName)){
            fs.mkdirSync(sfxFolderName);
        }
        const data = fs.writeFileSync(`${sfxFolderName}/${fileName}.sfx`, content,{ flag: 'w+' });
        //file written successfully
      } catch (err) {
        console.error(err)
      }    
}


main('myaw');






// let s = `! @ # % ^ & * ( ) _ + | \ = - { 
// } ] [ : ” ’ ; ? > < , . /`
// let newS = s.trim().split(" ").join("");
// console.log(newS);

