import fs from 'fs/promises';
import path from 'path';

const notesDir = path.join(__dirname, '../../../../notes/');

export default class FlashcardsAPIHandlers {
  //get'/flashcards'  
  static async getFlashcards(req, res) {
    
    const finalArr = [];
  
    await recursiveSearch(notesDir, 'study');
    
    async function recursiveSearch (directory: string, dirInc: string) {
      console.log(directory)
      console.log(dirInc)
      const notesDir = path.join(directory, dirInc);
      const content = await fs.readdir(notesDir);
    
      for await (let item of content) {
        if (item.match(/\.md$/)){
          const {page, match, scoreStatus} = await getPageQuestionsBlock(path.join(notesDir, item));
          
          if (page === null) continue;
  
          if (scoreStatusCheck(scoreStatus))
            finalArr.push({
              pageDir: dirInc+'/'+item,
              questions: await getQuestionsFromNotes(match)
            });
        }
        else
          await recursiveSearch(directory, dirInc+'/'+item);
      }
    }
    console.log(finalArr);
    
    return {
      body: finalArr
    }
  }

  //post'/flashcards/answer'
  static async answerFlashcard(req, res) {
    const {score, pageDir} = req.body;
  
    const {page, match, scoreStatus } = await getPageQuestionsBlock(path.join(notesDir,pageDir));
    let updatedPage: string, updatedScoreStatus: number[];
    
    if (score >= 3 && score > scoreStatus[1]){
      //1 ponto
      updatedScoreStatus = [
        new Date().getTime(),
        score,
        scoreStatus[2]+1
      ];
      updatedPage = page.replace(/\?\?\[.*\]\?/, "??"+JSON.stringify(updatedScoreStatus)+"?")
    }
    else if (score === 5) {
      updatedScoreStatus = [
        new Date().getTime(),
        score,
        scoreStatus[2]+1
      ]
      updatedPage = page.replace(/\?\?\[.*\]\?/, "??"+JSON.stringify(updatedScoreStatus)+"?")
    }
    else if (score === 4) {
      updatedScoreStatus = [
        new Date().getTime(),
        score,
        scoreStatus[2]+0.5
      ]
      updatedPage = page.replace(/\?\?\[.*\]\?/, "??"+JSON.stringify(updatedScoreStatus)+"?")
    }
    else if (score === 0 || score < scoreStatus[1]-1) {
      // -1ponto
      updatedScoreStatus = [
        new Date().getTime(),
        score,
        scoreStatus[2]-1
      ];
  
      updatedPage = page.replace(/\?\?\[.*\]\?/, "??"+JSON.stringify(updatedScoreStatus)+"?");
    }
    else{
      // nothing
      res.json({ok: true})
      return
    }
  
    if(updatedPage)
      fs.writeFile(path.join(notesDir,pageDir), updatedPage)
  
    return {
      status: 202,
      message: 'Flash-card answered'
    }
  }
}


//==========================
async function getPageQuestionsBlock(directory: string): Promise<{  page: string;
  match: string;
  scoreStatus: number[];
}> 
{
const page = await fs.readFile(directory, 'utf-8');

let match: RegExpMatchArray|string|null = page.match(/\?\?\[.*\]\?\n?((?!\?\?\?).\n?)+\?\?\?/)

if (match === null) return {page:null, match: null, scoreStatus: null}

match = match[0];

const scoreStatus: number[] = JSON.parse(match.match(/\?\?\[.*\]\?/)[0].match(/\[.*\]/)[0]);

return {
page, match, scoreStatus
}
}

async function getQuestionsFromNotes(blockMatch: string): Promise<string[]> {
const questions = blockMatch.replace(/\?\?(\[.*\])?\?/g, '').split('\n').filter(i => i !== '');

return questions
}

function scoreStatusCheck(scoreStatus: number[]): boolean {
const [timestamp, lastScore, totalScore] = scoreStatus;
const hourML = 60 * 60 * 1000;

if (totalScore <= 0) {
return true
}
else if (totalScore <= 8) {
const dayAfterLastScore = new Date(timestamp + (20*hourML)).getTime();

return Date.now() > dayAfterLastScore ? true : false
}
else if (totalScore <= 13) {
const weekAfterLastScore = new Date(timestamp + (20*hourML) + (20*6*hourML)).getTime();

return Date.now() > weekAfterLastScore ? true : false
}
else if (totalScore <= 20) {
const monthAfterLastScore = new Date(timestamp + (20*hourML) + (20*29*hourML)).getTime();

return Date.now() > monthAfterLastScore ? true : false
}
else if (totalScore <= 24) {
const semesterAfterLastScore = new Date(timestamp + (20*hourML) + (20*180*hourML)).getTime();

return Date.now() > semesterAfterLastScore ? true : false
}
else if (totalScore <= 30) {
const semesterAfterLastScore = new Date(timestamp + (20*hourML) + (20*360*hourML)).getTime();

return Date.now() > semesterAfterLastScore ? true : false
}
else {
return false
}    
}  