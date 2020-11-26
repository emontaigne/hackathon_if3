import './style.scss';
import $ from 'jquery';
// import axios from 'axios';

// valeurs de rotation pour chaque face du dé
const perFace = [
  [0, 0, 0, '180deg'],
  [500, 1, 0, '270deg'],
  [0, 1, 0, '90deg'],
  [0, 1, 0, '270deg'],
  [500, 1, 0, '90deg'],
  [0, 1, 0, '180deg'],
];
const idPont = [];
let time;
let newVal;
let nextCase;
let newCase;
let diceVal;
// fonction a laquelle on passe un nombre qui correspond à une face du dé
// en fonction du nombre, on va prendre les valeurs de rotation
//  de cette face là dans le tableau (-1 pour l'index)
// on fait tourner le dé de cette valeur là pour afficher la bonne face vers le haut.
const setVal = (num) => {
  $('.dice').css('transform', `rotate3d(${perFace[num - 1]}`);
};

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
          console.log('disabled');
        }
      }
      $('.case').removeClass('actual');
      $(`#case-${i}`).addClass('actual');
      i = (newCase > actualCase) ? i + 1 : i - 1;
    }, 200);
  }, 1200);
};
// action sur les cases
const actionsCase = (oneCase, val) => {
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
      alert('oh non, recommencez à la case départ');
      nextCase = 0;
      newVal = 1;
    }
    // si c'est un puit
    if ($(`#case-${oneCase}`).hasClass('puit')) {
      alert('oh non, reculez de 2 cases');
      render(oneCase, -2);
      newVal = 2;
      nextCase = oneCase - 2;
    }
    // si c'est une oie
    if ($(`#case-${oneCase}`).hasClass('oie')) {
      alert(`Chouette ! vous pouvez encore avancer de ${val}`);
      render(oneCase, val);
      newVal = val;
      nextCase = oneCase + val;
    }
    // si c'est un pont
    if ($(`#case-${oneCase}`).hasClass('pont')) {
      const idxNewCase = idPont.indexOf(oneCase) + 1;
      //   vérifier si ce n'est pas le dernier pont du jeu
      if (idPont.indexOf(oneCase) !== idPont.length - 1) {
        alert('Chouette ! Rendez-vous au prochain pont !');
        const nbrCase = idPont[idxNewCase] - oneCase;
        render(oneCase, nbrCase);
        newVal = nbrCase;
        nextCase = oneCase + nbrCase;
      }
    }
    if ($(`#case-${oneCase}`).hasClass('color3')) {
      $('#card').toggleClass('flipped');
    }

    /* if ($(`#case-${oneCase}`).hasClass('color3')) {
      $('#card').flip(
        { trigger: 'hover' },
      );
    } */
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

// faire les cases en js pour petit plateau
// $('#case-15').addClass('mort');
$('#case-10').addClass('action puit');
$('#case-6').addClass('action puit');
$('#case-12').addClass('action oie');
$('#case-5').addClass('action pont');
$('#case-16').addClass('action pont');

// mettre les id des != cases 'pont' dans un tableau + tri par ordre croissant
$('.pont').each(function () {
  idPont.push(parseInt((($(this).attr('id')).split('-')[1]), 10));
});
idPont.sort(function (a, b) {
  return a - b;
});
