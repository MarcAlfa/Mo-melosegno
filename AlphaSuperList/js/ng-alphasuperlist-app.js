'use strict';

/**
 *	MarcAlfa - Angular APP
 *  ***************************************************
 *	version   : below in code
 *	author    : Marco Alfano (MarcAlfa)
 *	website   : 
 *	year      : 2014
 * 	copyright : All right reserved
 *  ***************************************************
 *  descr     : Create and Share all the list you want !!!
 *
 *
 *	licence	  : 
 *
 * 
 *  #thanks2:
 *
 *
 */

// NOME APP + injection
var AlphaSuperList = angular.module('AlphaSuperList', [
    // 'ngResource'  // angular resource  (gia' di default)
  	'ngRoute'    // angular route
    ,'ngAnimate'  // angular animation
    ,'ngTouch'  // angular touch
    // ,'ui.bootstrap'   // bootstrap by angular
    ,'mgcrea.ngStrap'   // AngularStrap (http://mgcrea.github.io/angular-strap/)
    ,'LocalStorageModule'  // angular local storage (https://github.com/grevory/angular-local-storage)
  	,'AlphaSuperListControllers'
  	// ,'AlphaSuperListFilters'
  	,'AlphaSuperListServices'
  	,'AlphaSuperListAnimations'
]);

// CONSTANT
AlphaSuperList.constant(
    'AlphaSuperList_config', 
    { 
        description: 'AlphaSuperList'
        ,version: 'v0.9.b'
        ,lastUpdate: 'mag-2015'
        // ,url_php: 'api/alphalist-api.php'                                                       // **sviluppo**
        ,url_php: 'http://www.marcalfa.com/features/alphasuperlist/api/alphalist-api.php'        // **produzione**
    }
);

// CONFIG
AlphaSuperList.config(['$routeProvider', '$locationProvider',
	function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/list.html',
                controller: 'ctrlList'
                // ,resolve: {
                //     getListsResolved: function($q, localStorageService, srvList) { // Inject resources (x multi servizi basta usare function($q, servizio1, servizio2, servizio3))
                //         var xLocalStorageList = [];
                //         xLocalStorageList = localStorageService.get('lists');
                //         // Set up a promise to return
                //         var deferred = $q.defer(); 
                //         // Set up our resource calls
                //         var getLists = srvList.getLists(xLocalStorageList).start();
                //         // Wait until both resources have resolved their promises, then resolve this promise
                //         $q.all([getLists.$promise]).then(function(response) {   // (per multi: $q.all([servizio1.$promise, servizio2.$promise]).then(function(response) {) 
                //             console.info('resolve of getLists');
                //             deferred.resolve(response); 
                //         }); 
                //         return deferred.promise;
                //     }
                // }
            })
            .when('/list/:listId', {
                templateUrl: 'partials/item.html',
                controller: 'ctrlItem'
            })
            .when('/about', {
                templateUrl: 'partials/about.html',
                controller: 'AboutCtrl',
                resolve: {
          		    // I will cause a delay
                    delay: function ($q, $timeout) {
                        var delay = $q.defer();
                        $timeout(delay.resolve, 500);
                        return delay.promise;
                    }
          		}
          	})
          	.otherwise({
                redirectTo: '/'
          	});

            // enable html5Mode for pushstate ('#'-less URLs)
            // $locationProvider.html5Mode(true);
            // $locationProvider.hashPrefix('!');
            // $locationProvider.html5Mode(true).hashPrefix('!');
    }
]);

/*
To set the prefix of your **localStorage** name, you can use the setPrefix method available on the localStorageServiceProvider
*/
AlphaSuperList.config(['localStorageServiceProvider', 
    function (localStorageServiceProvider){
        localStorageServiceProvider.setPrefix("AlphaSuperList");
    }
]);


// APP onload
// app.run(function(globals, $rootScope) {
   // Your code here....  
// });

// AlphaSuperList.run(function($templateCache,$http,$rootScope){
      // console.info('RUN start');
      // $templateCache.put('partials/list.html', 'partials/list.html');
      // $http.get('partials/list.html', {cache:$templateCache});
      // $http.get('partials/item.html', {cache:$templateCache});
      // console.info('RUN stop');
// });

/*
you can disable **DEBUG MODE** in production for a significant performance boost with:
*/
// AlphaSuperList.config(['$compileProvider', 
//     function ($compileProvider) {
//         $compileProvider.debugInfoEnabled = false;
//     }
// ]);



// *************************************************
// ******* DIRETTIVE *******************************
// *************************************************

// disattiva il touchmove su un DIV (ad esempio su barra in alto) (non serve molto in granche' per il problema elastic scroll on safari, ma qualcosina fa...))
AlphaSuperList.directive('alphaNoTouchMove', function () {
    return {
        // restrict: 'A',
        link: function (scope, elm, attr) {
            // document.getElementById(attr.id).addEventListener('touchmove', function(e){e.preventDefault()}, false);  // commentato al momento
        }
    };       
});

// applica alla riga corrente le giuste classi (anche per animazioni quando di cancella o si archivia)
AlphaSuperList.directive('alphaRigaCurrent', function () {
    return {
        restrict: 'A',
        // transclude: true,
        replace: 'true',
        link: function (scope, elem, attr) {

            scope.$on('$destroy', function () {
                // elem.off();            
                // console.info('destroy->scope= ' + scope.current.item + ' attr= ' + attr.alphaRigaCurrent + ' operation= ' + scope.current.operation);
                if (scope.current.item == attr.alphaRigaCurrent) {
                    elem.addClass('rigaCurrent');
                    if (scope.current.operation == "del") {
                        elem.addClass('rigaCurrentDelete');
                    }
                    else if  (scope.current.operation == "ark") {
                        elem.addClass('rigaCurrentArchive');                        
                    }
                };
            
            });

        }
    };       
});


// AlphaSuperList.directive('alphaTopMenuAnimate', function ($animate) {
//      console.info('click su alphaTopMenuAnimate');
//     return {
//         // restrict: 'A',
//         link: function (scope, elem, attrs) {
//             elem.on('click', function () {
//                 console.info('click su ' + elem);
//                 console.info('top2= ' + scope.top2);
//                 $animate.addClass(elem, "alpha-anim-topMenu");
//                 // elem.addClass('alpha-anim-topMenu');
//             });
//         }
//     };

    // scope.$watch(attrs.hideMe, function (newVal) {
    //   if (newVal) {
    //     $animate.addClass(element, "fade");
    //   } else {
    //     $animate.removeClass(element, "fade");
    //   }

// });




// from: http://www.pseudobry.com/building-large-apps-with-angular-js/
// Lazy-load dependencies on a per-route basis:

// $routeProvider.when('/items', {
//     templateUrl: 'partials/items.html',
//     resolve: {
//         load: ['$q', '$rootScope', function ($q, $rootScope) {
//             var deferred = $q.defer();
//             // At this point, use whatever mechanism you want 
//             // in order to lazy load dependencies. e.g. require.js
//             // In this case, "itemsController" won't be loaded
//             // until the user hits the '/items' route
//             require(['itemsController'], function () {
//                 $rootScope.$apply(function () {
//                     deferred.resolve();
//                 });
//             });
//             return deferred.promise;
//         }]
//     }
// });


