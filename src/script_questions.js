// import './style.scss';
// import $ from 'jquery';
// import axios from 'axios';

import {
  allQuestions,
} from './questions_test';

// choisir au hasard un groupe de questions (wad ou web)
const chosenGroup = allQuestions[Math.floor(Math.random() * allQuestions.length)];
console.log(chosenGroup);

// parmi les questions, chercher celles qui ont le niveau de difficulté de la case
export const easy = chosenGroup.filter((el) => el.difficulty === '1');
console.log(easy);
export const medium = chosenGroup.filter((el) => el.difficulty === '2');
console.log(medium);
export const hard = chosenGroup.filter((el) => el.difficulty === '3');
console.log(hard);

let levelDifficulty = [];
const actualCase = '';
if (actualCase.className('color1')) {
  levelDifficulty = easy;
} else if (actualCase.className('color2')) {
  levelDifficulty = medium;
} else if (actualCase.className('color3')) {
  levelDifficulty = medium;
}

console.log(levelDifficulty);

// au hasard choisir une de ces questions

const chosenQuestion = levelDifficulty[Math.floor(Math.random() * levelDifficulty.length)];
console.log(chosenQuestion);
// afficher question + reponses possibles (radio button)

// après click, si la reponse est la bonne

// sinon, si c'est la mauvaise

// faire en sorte que la question lue ne se represente plus
