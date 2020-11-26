import $ from 'jquery';

export const perFace = [
  [0, 0, 0, '180deg'],
  [500, 1, 0, '270deg'],
  [0, 1, 0, '90deg'],
  [0, 1, 0, '270deg'],
  [500, 1, 0, '90deg'],
  [0, 1, 0, '180deg'],
];

// fonction a laquelle on passe un nombre qui correspond à une face du dé
// en fonction du nombre, on va prendre les valeurs de rotation
//  de cette face là dans le tableau (-1 pour l'index)
// on fait tourner le dé de cette valeur là pour afficher la bonne face vers le haut.
export const setVal = (num) => {
  $('.dice').css('transform', `rotate3d(${perFace[num - 1]}`);
};
