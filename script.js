import './style.scss';
import $ from 'jquery';
import { perFace, setVal } from './src/de';
import {
  allQuestions, questionsWAD,
} from './src/questions_test';

// objet sauvegarde local Storage

let saved;
const save = function () {
  localStorage.setItem('save', JSON.stringify(saved));
};
const updateSave = function () {
  return JSON.parse(localStorage.getItem('save'));
};
const removeSaved = function () {
  localStorage.removeItem('save');
};

// create object if it doesn't exist yet
saved = updateSave()
?? {
  usedColor1: [],
  usedColor2: [],
  usedColor3: [],
  goodAnswers: 0,
  badAnswers: 0,
  currentCase: 0,
};
$('.actual').toggleClass('actual');
$(`#case-${saved.currentCase}`).toggleClass('actual');
const usedColor1 = function (indexQuestion) {
  if (saved.usedColor1.find((i) => i === indexQuestion) === undefined) { saved.usedColor1.push(indexQuestion); }
  save();
};
const usedColor2 = function (indexQuestion) {
  if (saved.usedColor2.find((i) => i === indexQuestion) === undefined) { saved.usedColor2.push(indexQuestion); }
  save();
};
const usedColor3 = function (indexQuestion) {
  if (saved.usedColor3.find((i) => i === indexQuestion) === undefined) { saved.usedColor3.push(indexQuestion); }
  save();
};
const haveGoodAnswer = function () {
  saved.goodAnswers++;
  save();
};
const haveBadAnswer = function () {
  saved.badAnswers++;
  save();
};
const haveCase = function (caseNumber) {
  saved.currentCase = caseNumber;
  save();
};

// import axios from 'axios';

var h = window.innerHeight;
var w = window.innerWidth;
var style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(`body {height: ${h}px}`);

const widthCarts = $('.contenu-carte').css('width');
const widthPlateau = $('.plateau-container').css('width');
const widthDice = $('.diceWrap').css('width');
const widthGame = parseInt(widthCarts, 10) + parseInt(widthDice, 10) + parseInt(widthPlateau, 10);
const espaceVide = (parseInt(w, 10) - widthGame) / 2;
const reference = espaceVide + parseInt(widthCarts, 10);
const d = parseInt(w, 10) / 2 - reference;
const marginCart = d + 172.75;

// ajouter les images de cartes sur le plateau
$('.color1').append('<img class="img-card" src="card1.png" alt="carte turquoise">');
$('.color2').append('<img class="img-card" src="card2.png" alt="carte mauve">');
$('.color3').append('<img class="img-card" src="card3.png" alt="carte rose">');

// valeurs de rotation pour chaque face du dé
$('body').prepend('<div class="overlay"></div>');
$('body').prepend('<div class="modal-case-special"><img class="modal-img" src="" alt=""><p class="modal-txt"></p><button>Ok</button></div>');
$('body').prepend('<div class="modal-case-arrivee"><img class="modal-img" src="baliseman.png" alt="balise man"><p class="modal-txt">Bravo, vous avez réussi !</p><button>Recommencer</button></div>');
$('body').prepend('<div class="modal-pont"><img class="modal-pont-img" src="pont.png" alt="pont suivant"><p class="modal-pont-txt">Il n\'y a plus de pont de cette couleur, relance le dé!</p><button>Ok</button></div>');

let newCase;
let diceVal;
const ponts = [];
let chosenQst;
let chosenGroup;
let qstRandom;
let otherCase;
let otherVal;
let newVal;
let nextCase;
let category;

// fonction qui filtre un tableau, prend uniquement l'id et le trie par ordre croissant
const tri = (arr, str) => (arr.filter((elt) => elt.hasClass(str)))
  .map((elt) => parseInt(((elt.attr('id')).split('-')[1]), 10))
  .sort((a, b) => a - b);

// mettre les id des != cases 'pont' dans un tableau + tri par ordre croissant
$('.pont').each(function () {
  ponts.push($(this));
});

// choisir au hasard un groupe de questions (wad ou web)

// parmi les questions, chercher celles qui ont le niveau de difficulté de la case

const random = (arr, str) => {
  const indexRandom = Math.floor(Math.random() * arr.length);
  if (str === 'color1') {
    usedColor1(indexRandom);
  } else if (str === 'color2') {
    usedColor2(indexRandom);
  } else {
    usedColor3(indexRandom);
  }
  return arr[indexRandom];
};
const chosenDifficulty = (str) => {
  chosenGroup = allQuestions[Math.floor(Math.random() * allQuestions.length)];
  if (str === 'color1') {
    chosenQst = chosenGroup.filter((el) => el.difficulty === '1');
  }
  if (str === 'color2') {
    chosenQst = chosenGroup.filter((el) => el.difficulty === '2');
  }
  if (str === 'color3') {
    chosenQst = chosenGroup.filter((el) => el.difficulty === '3');
  }
  qstRandom = random(chosenQst, str);
  if (qstRandom.used === true) {
    qstRandom = random(chosenQst, str);
  } else {
    qstRandom.used = true;
  }
  return qstRandom;
};

// fonction qui recharge le plateau de jeu pour faire avancer de case
const render = (actualCase, val) => {
  newCase = parseInt(actualCase, 10) + val;
  let i = parseInt(actualCase, 10);
  setTimeout(() => {
    const avancer = setInterval(() => {
      if (i === 63) {
        $('.overlay').toggleClass('d-flex');
        $('.modal-case-arrivee').css({ display: 'flex', width: '600px', height: '400px' });
        clearInterval(avancer);
        $('#case-63').addClass('actual');
      }
      if (i === newCase) {
        clearInterval(avancer);
        haveCase(newCase);
        if (!$(`#case-${i}`).hasClass('action')) {
          setTimeout(() => {
            $('#throw').removeAttr('disabled');
          }, 1000);
        }
      }
      $('.case').removeClass('actual');
      $(`#case-${i}`).addClass('actual');
      i = (newCase > actualCase) ? i + 1 : i - 1;
    }, 200);
  }, 1200);
};

// fonction pour trouver un elt random dans un tableau
const actionsCase = (oneCase, val) => {
  let time;
  let question;
  let idxQst;

  // générer le temps du settimeout en fonction du nombre de case à passer
  if (val === 1) {
    time = val * 2000;
  } else if (val <= 3) {
    time = val * 1000;
  } else if (val < 8) {
    time = val * 650;
  } else {
    time = val * 450;
  }
  setTimeout(() => {
    //   si c'est la mort
    if ($(`#case-${oneCase}`).hasClass('mort')) {
      $('.overlay').toggleClass('d-flex');
      $('.case').removeClass('actual');
      $('.modal-txt').html('Oh non... rendez-vous à la case départ!');
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'tete.png');
      $('#throw').removeAttr('disabled');
      $('#case-0').addClass('actual');
      nextCase = 0;
      newVal = 1;
      otherCase = oneCase;
    }
    // si c'est un puit
    if ($(`#case-${oneCase}`).hasClass('puit')) {
      $('.overlay').toggleClass('d-flex');
      $('.modal-txt').html('Oh non, un puit... reculez de 5 cases');
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'puits.png');
      // render(oneCase, -5);
      newVal = 5;
      nextCase = oneCase - 5;
      otherVal = -5;
      otherCase = oneCase;
    }
    // si c'est un baliseman
    if ($(`#case-${oneCase}`).hasClass('oie')) {
      $('.overlay').toggleClass('d-flex');
      $('.modal-txt').html(`Eh, voilà Balise Man ! Vous pouvez de nouveau avancer de ${diceVal} !`);
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'baliseman.png');
      newVal = val;
      nextCase = oneCase + val;
      otherVal = val;
      otherCase = oneCase;
    }
    // si c'est un pont
    if ($(`#case-${oneCase}`).hasClass('pont')) {
      const arrPont = ($(`#case-${oneCase}`).hasClass('pont1')) ? tri(ponts, 'pont1') : tri(ponts, 'pont2');
      //   vérifier si ce n'est pas le dernier pont du jeu
      if (arrPont.indexOf(oneCase) !== arrPont.length - 1) {
        $('.overlay').toggleClass('d-flex');
        $('.modal-txt').html('Chouette ! Rendez-vous au prochain pont !');
        $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
        $('.modal-img').attr('src', 'pont.png');
        const nbrCase = arrPont[1] - oneCase;
        newVal = nbrCase;
        nextCase = oneCase + nbrCase;
        otherVal = nbrCase;
        otherCase = oneCase;
      } else {
        $('.modal-pont').css({ display: 'flex', width: '600px', height: '400px' });
        $('.overlay').toggleClass('d-flex');

        $('#throw').removeAttr('disabled');
      }
    }
    // si c'est une case mauve
    if ($(`#case-${oneCase}`).hasClass('color2')) {
      $('.modal-question').remove();
      $('#card1').toggleClass('flipped');
      $('#card1').parent('.container1').addClass('show');
      $('.overlay').toggleClass('d-flex');
      $('.card-color2>.face-back').css({ left: -marginCart });
      question = chosenDifficulty('color2');
      idxQst = chosenGroup.indexOf(question);
      category = chosenGroup === questionsWAD ? 'WAD' : 'WEB';
      $('.card-color2>.face-back').html(`<div class="modal-question"id="qst-${idxQst}">
                          <p class="category">${category}</p>
                          <p>${question.question}</p>
                          <div class="modal-answers"></div>
                          <button class="modal-qst-btn">Valider</button>
                          <p class="erreur"></p>
                        </div>`);
      (question.answers).forEach(function (answer, i) {
        $('.modal-answers').append(`<div><input class="radio-ipt" id="ipt-${i}" name="answer" value="${answer}" type="radio"><label for="ipt-${i}">${answer}</label></div>`);
      });
      newVal = 2;
      nextCase = oneCase - 2;
    }
    // si c'est une case rose
    if ($(`#case-${oneCase}`).hasClass('color3')) {
      $('.modal-question').remove();
      $('#card').toggleClass('flipped');
      $('#card').parent('.container1').addClass('show');
      $('.card-color3>.face-back').css({ left: -marginCart });
      $('.overlay').toggleClass('d-flex');
      question = chosenDifficulty('color3');
      idxQst = chosenGroup.indexOf(question);
      category = chosenGroup === questionsWAD ? 'WAD' : 'WEB';
      $('.card-color3>.face-back').html(`<div class="modal-question"id="qst-${idxQst}">
                          <p class="category">${category}</p>
                          <p>${question.question}</p>
                          <div class="modal-answers"></div>
                          <button class="modal-qst-btn">Valider</button>
                          <p class="erreur"></p>
                        </div>`);
      (question.answers).forEach(function (answer, i) {
        $('.modal-answers').append(`<div><input class="radio-ipt" id="ipt-${i}" name="answer" value="${answer}" type="radio"><label for="ipt-${i}">${answer}</label></div>`);
      });
      newVal = 2;
      nextCase = oneCase - 2;
    }
    // si c'est une case turquoise
    if ($(`#case-${oneCase}`).hasClass('color1')) {
      $('.modal-question').remove();
      $('#card2').toggleClass('flipped');
      $('#card2').parent('.container1').addClass('show');
      $('.card-color1>.face-back').css({ left: -marginCart });
      $('.overlay').toggleClass('d-flex');
      question = chosenDifficulty('color1');
      idxQst = chosenGroup.indexOf(question);
      category = chosenGroup === questionsWAD ? 'WAD' : 'WEB';
      $('.card-color1>.face-back').html(`<div class="modal-question"id="qst-${idxQst}">
                          <p class="category">${category}</p>
                          <p>${question.question}</p>
                          <div class="modal-answers"></div>
                          <button class="modal-qst-btn">Valider</button>
                          <p class="erreur"></p>
                        </div>`);
      (question.answers).forEach(function (answer, i) {
        $('.modal-answers').append(`<div><input class="radio-ipt" id="ipt-${i}" name="answer" value="${answer}" type="radio"><label for="ipt-${i}">${answer}</label></div>`);
      });
      newVal = 2;
      nextCase = oneCase - 2;
    }
  }, time);
};

// au clic sur le bouton lancer le dé
// supprime classe throw qui lance le dé en l'air
// on trouve un nombre au hasard entre 1 et 6
$('#throw').on('click', () => {
  $('#throw').attr('disabled', 'disabled');
  $('.dice').removeClass('throw');
  diceVal = Math.round(Math.random() * 5) + 1;
  setTimeout(() => {
    $('.dice').addClass('throw');
    setVal(diceVal, perFace);
  }, 10);
  const actualCase = $('.actual').length > 0 ? (($('.actual').attr('id')).split('-'))[1] : 0;
  //   render les cases
  render(actualCase, diceVal);
  //   vérifier si c'est une case spéciale
  actionsCase(newCase, diceVal);
});

// Bouton pour fermer la modal case spéciale
$('.modal-case-special').on('click', 'button', function () {
  $('.modal-case-special').css({ display: 'none', height: '0px', width: '0px' });
  $('.overlay').toggleClass('d-flex');
  if (!$(`#case-${otherCase}`).hasClass('mort')) {
    render(otherCase, otherVal);
    actionsCase(nextCase, newVal);
  }
});

// Bouton pour fermer la modal case arrivée
$('.modal-case-arrivee').on('click', 'button', function () {
  $('.modal-case-arrivee').css({ display: 'none', height: '0px', width: '0px' });
  $('.overlay').toggleClass('d-flex');
  $('#throw').removeAttr('disabled');
  $('.case').removeClass('actual');
  $('#case-0').addClass('actual');
  removeSaved(); // suppression local storage
});

// Bouton pour fermer la modal pont
$('.modal-pont').on('click', 'button', function () {
  $('.modal-pont').css({ display: 'none', height: '0px', width: '0px' });
  $('.overlay').toggleClass('d-flex');
});

// clic pour répondre à la question sur la carte
$('body').on('click', '.modal-qst-btn', function () {
  const idCase = $('.actual').attr('id').split('-')[1];
  const idInArray = ($(this).closest($('.modal-question'))).attr('id').split('-')[1];

  // verifier si la personne a répondu
  if ($('.radio-ipt:checked').val() !== undefined) {
    // verifier si la réponse est exacte
    if ($('.radio-ipt:checked').val() === chosenGroup[idInArray].bonneReponse) {
      $('.modal-question').html('<p>Bravo, c\'est la bonne réponse.</p><button class="continue-to-play">Continuer</button>');
      haveGoodAnswer();
    } else {
      $('.modal-question').html(`<p>Oh non, ce n'est pas la bonne réponse.</p><p>La bonne réponse était <strong>${chosenGroup[idInArray].bonneReponse}.</strong></p><p>Vous devez reculer de deux cases</p><button class="continue-to-play">Ok</button>`);
      haveBadAnswer();
      render(idCase, -2);
      if ($(`#case-${nextCase}`).hasClass('action')) {
        actionsCase(nextCase, newVal);
      }
    }
    //  clic pour fermer la carte avec la question
    $('.continue-to-play').on('click', function () {
      $('.modal-question').parent().parent().toggleClass('flipped');
      $('.modal-question').closest('.container1').removeClass('show');
      $('.overlay').toggleClass('d-flex');
    });
  } else {
    $('.erreur').html('Vous devez répondre à la question');
  }
});

// clic pour voir les != vues sur la page
$('.ul-header').on('click', 'li', function () {
  $('.views').css({ display: 'none' });
  $('.ul-header>li').removeClass('active');
  if ($(this).attr('id') === 'jeu') {
    $('.view-jeu').css({ display: 'flex' });
  }
  if ($(this).attr('id') === 'regles') {
    $('.view-regles').css({ display: 'flex' });
  }
  if ($(this).attr('id') === 'about') {
    $('.view-about').css({ display: 'block' });
  }
  $(this).addClass('active');
});
