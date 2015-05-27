'use strict';

/**
 *  MarcAlfa - Angular services
 *  author    : Marco Alfano (MarcAlfa)
 *  website   : 
 *  year      : 2014
 *  copyright : All right reserved
 */

var AlphaSuperListServices = angular.module('AlphaSuperListServices', ['ngResource']);


// LIST service
AlphaSuperListServices.factory('srvList', 
    ['$resource', '$cacheFactory', 'AlphaSuperList_config',
    function($resource, $cacheFactory, AlphaSuperList_config) {
        var dataFactory = {};
        // __________________________________________________________
        dataFactory.getLists = function (ilistArray) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'getLists',
                    listArray: JSON.stringify(ilistArray)  // in formato json
                },
                {
                start: 
                    {
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                        // ,timeout: 1000
                    }
                }
            );
        };
        // __________________________________________________________
        dataFactory.loadList = function (ilistId, ilistPsw) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'loadList',
                    listId: ilistId,
                    listPsw: ilistPsw
                },
                {
                start: 
                    {
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                    }
                }
            );
        };
        // __________________________________________________________
        dataFactory.addList = function (ilistName, ilistPsw) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'addList',
                    listName: ilistName,
                    listPsw: ilistPsw
                },
                {
                start: 
                    {
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                    }
                }
            );
        };
        // __________________________________________________________
        return dataFactory;
        // __________________________________________________________
    }]
);



// ITEM service
AlphaSuperListServices.factory('srvItem', 
    ['$resource', '$cacheFactory', 'AlphaSuperList_config',
    function($resource, $cacheFactory, AlphaSuperList_config) {
        // console.log($scope.list_id);
        // var url = "api/alphalist-api.php?callback=JSON_CALLBACK";
        // var url = 'api/alphalist-api.php/list/:listId';
        // __________________________________________________________
        var dataFactory = {};
        // __________________________________________________________
        dataFactory.getListItems = function (ilistId) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'getListItems',
                    listId: ilistId
                },
                {
                start: 
                    {
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                    }
                }
            );
        };
        // __________________________________________________________
        dataFactory.putListItem = function(ilistId, iitemDesc, iitemNote) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'putListItem',
                    listId: ilistId,
                    itemDesc: iitemDesc,
                    itemNote: iitemNote                       
                },
                {
                start: 
                    {  
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                    }
                }
            );
        };
        // __________________________________________________________
        dataFactory.delListItem = function(ilistId, iitemDesc) {
            return $resource(
                AlphaSuperList_config.url_php,  // URL api php
                {
                    operation: 'delListItem',
                    listId: ilistId,
                    itemDesc: iitemDesc                      
                },
                {
                start: 
                    {  
                        method: 'POST',
                        isArray: true,
                        headers: {'Content-Type': 'application/json'},
                        cache: false
                    }
                }
            );
        };
        // __________________________________________________________
        return dataFactory;
        // __________________________________________________________
    }]
);




// ALTRO servizio....
AlphaSuperListServices.factory('srvList2', ['$resource', function($resource) {
    return $resource('data/items.json', {}, {
            query: {method:'GET', params:{}, isArray:true }
    });
}]);






// AlphaSuperListServices.factory('srvViews', ['$http', function($http) {
//     var dataFactory = {};
//     dataFactory.getListView = function() {
//         var promise = $http({ method: 'GET', url: 'partials/list.html' }).success(function(data, status, headers, config) {return data;});
//         return promise;
//     }
//     return dataFactory;
// }]);


