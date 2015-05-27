'use strict';

/**
 *	MarcAlfa - Angular animations
 *	author    : Marco Alfano (MarcAlfa)
 *	website   : 
 *	year      : 2014
 * 	copyright : All right reserved
 */


var AlphaSuperListAnimations = angular.module('AlphaSuperListAnimations', ['ngAnimate']);


// AlphaSuperListAnimations.animation('.phone', function() {

//   var animateUp = function(element, className, done) {
//     if(className != 'active') {
//       return;
//     }
//     element.css({
//       position: 'absolute',
//       top: 500,
//       left: 0,
//       display: 'block'
//     });

//     jQuery(element).animate({
//       top: 0
//     }, done);

//     return function(cancel) {
//       if(cancel) {
//         element.stop();
//       }
//     };
//   }

//   var animateDown = function(element, className, done) {
//     if(className != 'active') {
//       return;
//     }
//     element.css({
//       position: 'absolute',
//       left: 0,
//       top: 0
//     });

//     jQuery(element).animate({
//       top: -500
//     }, done);

//     return function(cancel) {
//       if(cancel) {
//         element.stop();
//       }
//     };
//   }

//   return {
//     addClass: animateUp,
//     removeClass: animateDown
//   };
// });