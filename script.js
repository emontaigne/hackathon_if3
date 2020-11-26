import './style.scss';
import $ from 'jquery';
import { perFace, setVal } from './src/de';
import {
  allQuestions,
} from './src/questions_test';

// import axios from 'axios';

var h = window.innerHeight;
var style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(`body {height: ${h}px}`);

// valeurs de rotation pour chaque face du dé
$('body').prepend('<div class="overlay"></div>');
$('body').prepend('<div class="modal-case-special"><img class="modal-img" src="" alt=""><p class="modal-txt"></p><button>Ok</button></div>');

let newCase;
let diceVal;
const ponts = [];
const tri = (arr, str) => (arr.filter((elt) => elt.hasClass(str)))
  .map((elt) => parseInt(((elt.attr('id')).split('-')[1]), 10))
  .sort((a, b) => a - b);

// choisir au hasard un groupe de questions (wad ou web)
const chosenGroup = allQuestions[Math.floor(Math.random() * allQuestions.length)];

// parmi les questions, chercher celles qui ont le niveau de difficulté de la case
const easy = chosenGroup.filter((el) => el.difficulty === '1');
const medium = chosenGroup.filter((el) => el.difficulty === '2');
const hard = chosenGroup.filter((el) => el.difficulty === '3');

// fonction qui recharge le plateau de jeu pour faire avancer de case
const render = (actualCase, val) => {
  newCase = parseInt(actualCase, 10) + val;
  let i = parseInt(actualCase, 10);
  setTimeout(() => {
    const avancer = setInterval(() => {
      if (i === newCase) {
        clearInterval(avancer);
        if (!$(`#case-${i}`).hasClass('action')) {
          $('#throw').removeAttr('disabled');
        }
      }
      $('.case').removeClass('actual');
      $(`#case-${i}`).addClass('actual');
      i = (newCase > actualCase) ? i + 1 : i - 1;
    }, 200);
  }, 1200);
};
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const actionsCase = (oneCase, val) => {
  let time;
  let newVal;
  let nextCase;
  let question;
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
      $('.case').removeClass('actual');
      $('.modal-txt').html('Oh non... rendez-vous à la case départ!');
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'tete.png');
      $('.overlay').css({ display: 'block' });
      $('#throw').removeAttr('disabled');
      nextCase = 0;
      newVal = 1;
    }
    // si c'est un puit
    if ($(`#case-${oneCase}`).hasClass('puit')) {
      $('.modal-txt').html('Oh non, un puit... reculez de 5 cases');
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'puits.png');
      $('.overlay').css({ display: 'block' });
      render(oneCase, -5);
      newVal = 2;
      nextCase = oneCase - 5;
    }
    // si c'est une oie
    if ($(`#case-${oneCase}`).hasClass('oie')) {
      $('.modal-txt').html(`Eh, voilà Balise Man ! Vous pouvez de nouveau avancer de ${diceVal} !`);
      $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
      $('.modal-img').attr('src', 'baliseman.png');
      $('.overlay').css({ display: 'block' });
      render(oneCase, val);
      newVal = val;
      nextCase = oneCase + val;
    }
    // si c'est un pont
    if ($(`#case-${oneCase}`).hasClass('pont')) {
      const arrPont = ($(`#case-${oneCase}`).hasClass('pont1')) ? tri(ponts, 'pont1') : tri(ponts, 'pont2');
      //   vérifier si ce n'est pas le dernier pont du jeu
      if (arrPont.indexOf(oneCase) !== arrPont.length - 1) {
        $('.modal-txt').html('Chouette ! Rendez-vous au prochain pont !');
        $('.modal-case-special').css({ display: 'flex', width: '600px', height: '400px' });
        $('.modal-img').attr('src', 'pont.png');
        $('.overlay').css({ display: 'block' });
        const nbrCase = arrPont[1] - oneCase;
        render(oneCase, nbrCase);
        newVal = nbrCase;
        nextCase = oneCase + nbrCase;
      } else {
        $('#throw').removeAttr('disabled');
      }
    }
    if ($(`#case-${oneCase}`).hasClass('color1')) {
      $('#card').toggleClass('flipped');
      question = random(easy);
      $('body').prepend(`<div class="modal-question">
                          <p>${question.question}</p>
                          <div class="modal-answers"></div>
                          <button class="modal-qst-btn">Valider</button>
                        </div>`);
      (question.answers).forEach(function (answer) {
        $('.modal-answers').append(`<input class="radio-ipt" name="answer" value="${answer}" type="radio"><label>${answer}</label>`);
      });
    }
    if ($(`#case-${oneCase}`).hasClass('color2')) {
      $('#card').toggleClass('flipped');
      question = random(medium);
    }
    if ($(`#case-${oneCase}`).hasClass('color3')) {
      $('#card').toggleClass('flipped');
      question = random(hard);
    }
    actionsCase(nextCase, newVal);
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

// mettre les id des != cases 'pont' dans un tableau + tri par ordre croissant
$('.pont').each(function () {
  ponts.push($(this));
});

$('.modal-case-special').on('click', 'button', function () {
  $('.modal-case-special').css({ display: 'none' });
  $('.overlay').css({ display: 'none' });
});
$('.color1').append('<img class="img-card" src="card1.png" alt="carte turquoise">');
$('.color2').append('<img class="img-card" src="card2.png" alt="carte mauve">');
$('.color3').append('<img class="img-card" src="card3.png" alt="carte rose">');

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

$('body').on('click', '.modal-qst-btn', function () {
  let wichArray;
  if ($('.actual').hasClass('color1')) {
    wichArray = easy;
  }
  if ($('.actual').hasClass('color2')) {
    wichArray = medium;
  }
  if ($('.actual').hasClass('color3')) {
    wichArray = hard;
  }

  console.log($('.radio-ipt:checked').val());
  console.log($('.actual'));
});
