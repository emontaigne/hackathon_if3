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
// fonction a laquelle on passe un nombre qui correspond à une face du dé
// en fonction du nombre, on va prendre les valeurs de rotation
//  de cette face là dans le tableau (-1 pour l'index)
// on fait tourner le dé de cette valeur là pour afficher la bonne face vers le haut.
const setVal = (num) => {
  $('.dice').css('transform', `rotate3d(${perFace[num - 1]}`);
};

let newCase;
let diceVal;

// fonction qui recharge le plateau de jeu pour faire avancer de case
const render = (actualCase, val) => {
  console.log(val);
  newCase = parseInt(actualCase, 10) + val;
  console.log(newCase);
  let i = actualCase;
  setTimeout(() => {
    const avancer = setInterval(() => {
      if (i === newCase) {
        clearInterval(avancer);
      }
      $('.case').removeClass('actual');
      $(`#case-${i}`).addClass('actual');
      if (newCase > actualCase) {
        i++;
      } else {
        i--;
      }
    }, 200);
  }, 800);
};

const specialCase = (oneCase) => {
  setTimeout(() => {
    if ($(`#case-${oneCase}`).hasClass('mort')) {
      $('.case').removeClass('actual');
      alert('oh non, recommencez à la case départ');
    }
    if ($(`#case-${oneCase}`).hasClass('puit')) {
      alert('oh non, reculez de 2 cases');
      render(oneCase, -2);
    }
    if ($(`#case-${oneCase}`).hasClass('oie')) {
      alert(`Chouette ! vous pouvez encore avancer de ${diceVal}`);
      render(oneCase, diceVal);
    }
    if ($(`#case-${oneCase}`).hasClass('pont')) {
      alert('Chouette ! Rendez-vous au prochain pont !');
      const idxNewCase = idPont.indexOf(oneCase) + 1;
      const nbrCase = idPont[idxNewCase] - oneCase;
      console.log(nbrCase);
      render(oneCase, nbrCase);
    }
    $('#throw').removeAttr('disabled');
  }, 1300);
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
    setVal(diceVal);
  }, 10);
  const actualCase = $('.actual').length > 0 ? (($('.actual').attr('id')).split('-'))[1] : 0;
  render(actualCase, diceVal);
  setTimeout(() => {
    specialCase(newCase);
  }, 1000);
});

// faire les cases en js pour petit plateau
// $('#case-15').addClass('mort');
$('#case-10').addClass('puit');
$('#case-6').addClass('puit');
$('#case-12').addClass('oie');
$('#case-4').addClass('oie');
$('#case-5').addClass('pont');
$('#case-2').addClass('pont');
$('#case-1').addClass('pont');
$('#case-3').addClass('pont');
$('#case-16').addClass('pont');
console.log($('.pont'));
$('.pont').each(function () {
  idPont.push(parseInt((($(this).attr('id')).split('-')[1]), 10));
});
idPont.sort(function (a, b) {
  return a - b;
});
