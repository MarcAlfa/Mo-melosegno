'use strict';

/**
 *	MarcAlfa - Angular controller
 *	author    : Marco Alfano (MarcAlfa)
 *	website   : 
 *	year      : 2014
 * 	copyright : All right reserved
 */

var AlphaSuperListControllers = angular.module('AlphaSuperListControllers', []);

// MAIN controller
AlphaSuperListControllers.controller('ctrlMain', 
    ['$scope', '$rootScope', '$route', '$window', '$location', '$alert', '$modal', 'localStorageService', 'AlphaSuperList_config', 
	function($scope, $rootScope, $route, $window, $location, $alert, $modal, localStorageService, AlphaSuperList_config) {

		// console.log('ctrlMain - inizio');


    //     $rootScope.$on("$routeChangeStart", function (event, next, current) {
    //         console.info('Loading...');
    //         $scope.alertType = "";
    //         $scope.alertMessage = "Loading...";
    //         $scope.active = "progress-striped active progress-warning";
    //     });
    //     $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
    //         console.info('Successfully changed routes :)');
    //         $scope.alertType = "alert-success";
    //         $scope.alertMessage = "Successfully changed routes :)";
    //         $scope.active = "progress-success";

    //         $scope.newLocation = $location.path();
    //     });
    //     $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    //         console.info('Failed to change routes :(');
    //         alert("ROUTE CHANGE ERROR: " + rejection);
    //         $scope.alertType = "alert-error";
    //         $scope.alertMessage = "Failed to change routes :(";
    //         $scope.active = "";
    //     });


        $scope.listGo = function(iurl) {
            // console.info('iurl= ' + iurl);
            // $window.location.href = '#/list/' + xurl;
            // $window.location.reload();
            $location.path('/list/' + iurl);
        };    


        // ALERT
        $scope.AlertShow = function(itype, imsg) {
            // itype: info, danger, success, warning
            angular.element(document.querySelector('.alert')).remove(); // rimuovo eventuale alert precedente...
            var myAlert = $alert({
                // title: AlphaSuperList_config.description, 
                type: itype,
                content: imsg,
                container: '#msg_alert',
                placement: 'bottom', 
                animation: 'alert_animation',
                duration: 2.5,
                show: true,
                dismissable: false
            });

        };

        // **** SLIDE ****
        // $scope.slide = '';
        // $rootScope.back = function() {
        //  $scope.slide = 'slide-right';
        //  $window.history.back();
        // }
        // $rootScope.go = function(path){
        //  $scope.slide = 'slide-left';
        //  $location.url(path);
        // }


        // ***********************************
        // **** INIZIALIZZAZIONI generali ****
        $scope.app_description = AlphaSuperList_config.description;
        $scope.app_version = AlphaSuperList_config.version;
        // **** APP OK ****
        // console.info('app_is_ok = false');
        $scope.app_is_ok = false; // true quando tutto sara' ok
        // ***********************************


        // CONTROLLI 
        // **** controllo x LocalStorage ****
        if (Modernizr.localstorage) {

            // controllo meglio se si può fare un SET nel localStorage
            try {
                localStorageService.set('test','test');
                localStorageService.remove('test');
            } catch(err) {
                if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    $scope.app_no_ok = 'SORRY, YOU CAN\'T USE THIS APP --> MAX QUOTA EXCEEDED ON LOCAL STORAGE';
                    return;
                }
                else {
                     $scope.app_no_ok = 'SORRY, YOU CAN\'T USE THIS APP --> NO VALID LOCAL STORAGE PERMISSIONS';
                    return;                   
                }
            }
            // si puo proseguire... 

            // LOCAL STORAGE ************************************
            var xLocalStorageList = [];
            // console.info('cancello local storage');
            // localStorageService.clearAll();
            // console.info('get dal localStorage');
            xLocalStorageList = localStorageService.get('lists');
            // non c'e' nessuna lista, ne creo una di default
            if (!f_array_check_valid(xLocalStorageList)) {
                xLocalStorageList = [];
                xLocalStorageList.push({ listId: '99999999'});  // list di default
                var xLocalStorageList_json = JSON.stringify(xLocalStorageList);
                localStorageService.set('lists',xLocalStorageList_json); // la scrivo nel localstorage
                xLocalStorageList = localStorageService.get('lists');            
            }
            // LOCAL STORAGE ************************************

            // console.info('app_is_ok TRUE!');
            $scope.app_is_ok = true;
            $scope.app_no_ok = '';
        } 
        else {
            console.info('localstorage non supportato (da Modernizr)');
            $scope.app_no_ok = 'SORRY, YOU CAN\'T USE THIS APP --> NO VALID LOCAL STORAGE';
            return;
        }

	}]
);



// LIST controller
AlphaSuperListControllers.controller('ctrlList', ['$scope', '$alert', '$modal', 'localStorageService', 'srvList', 
    function($scope, $alert, $modal, localStorageService, srvList) {
        
        // console.info('ctrlList');

        
        $scope.ListRefresh = function(imessaggio) {
            // console.info('ctrlList refresh');

            // ******** INIZIALIZZAZIONI GENERALI ************
            // loading
            $scope.loading = true;
            // 1!! svuoto array corrente .. quindi aggiorno DOM ******* (con animazione ci mette 0.6s .. vedere animations.css)
            if ( ($scope.lists) && $scope.lists.length > 0) {
                // console.info('svuoto array listItems');
                $scope.lists.splice(0,$scope.lists.length) || $rootScope.$apply();
            };
            // top2
            $scope.top2 = false; // false= non visibile
            // top3
            $scope.top3 = [];
            $scope.top3.visibile = false;
            $scope.top3.corrente = 'X';
            // $scope.top3.listTitle = '';
            $scope.top3.listTitlePlaceHolder = '';
            $scope.top3.listName = null;
            $scope.top3.listPassword = null;
            // rimuovo eventuale classe della animazione singola per le righe
            angular.element(document.querySelectorAll('.righe')).removeClass('rigaDelete');
            // ************************************************ 

            // LOCAL STORAGE ************************************
            var xLocalStorageList = [];
            // console.info('cancello local storage');
            // localStorageService.clearAll();
            // console.info('get dal localStorage');
            xLocalStorageList = localStorageService.get('lists');
            // non c'e' nessuna lista, ne creo una di default
            if (!f_array_check_valid(xLocalStorageList)) {
                xLocalStorageList = [];
                xLocalStorageList.push({ listId: '99999999'});  // list di default
                var xLocalStorageList_json = JSON.stringify(xLocalStorageList);
                localStorageService.set('lists',xLocalStorageList_json); // la scrivo nel localstorage
                xLocalStorageList = localStorageService.get('lists');            
            }
            // **************************************************

            // SERVIZIO *****************************************
            var xsrv_return = srvList.getLists(xLocalStorageList).start();
            xsrv_return.$promise.then(function(data) {
                // promise fulfilled
                $scope.success_cod = data[0].success_cod;
                $scope.success_msg = data[0].success_msg;
                // OK - API
                if ($scope.success_cod == 0) {
                    // setTimeout(function() {
                        // console.info('DOM -> aggiorno lista');
                        // $scope.lists = angular.copy(data[1].lists); // in questo modo aggiorna automaticamente soltanto eventuali "differenze"
                        $scope.lists = data[1].lists;
                        $scope.AlertShow('success', ( imessaggio ? imessaggio : $scope.success_msg ) ); // precedenza a quello passato come input, altrimenti quello da DB!!
                        $scope.loading = false;
                    // }, 1000);

                } 
                // KO - API
                else {
                    $scope.AlertShow('danger', $scope.success_msg);
                    $scope.loading = false;
                }
            }, 
                // promise rejected, could log the error with: console.log('error', error);
                function(error) {
                    $scope.AlertShow('danger', 'Data on server unavailable, sorry!');
                    $scope.loading = false;
                }
            );
            // **************************************************

            // SERVIZIO con resolve da routeProvider..... *****************************************
            // var xsrv_return = getListsResolved;  // promise already fulfilled from routeProvider (app.js)
            // $scope.success_cod = xsrv_return[0][0].success_cod;
            // $scope.success_msg = xsrv_return[0][0].success_msg;
            // // OK - API
            // if ($scope.success_cod == 0) {
            //     // console.info('DOM -> aggiorno lista');
            //     $scope.lists = xsrv_return[0][1].lists;
            //     $scope.AlertShow('success', ( imessaggio ? imessaggio : $scope.success_msg ) ); // precedenza a quello passato come input, altrimenti quello da DB!!
            //     $scope.loading = false;
            // } 
            // // KO - API
            // else {
            //     $scope.AlertShow('danger', $scope.success_msg);
            //     $scope.loading = false;
            // };
            // **************************************************


        };

        $scope.ListAddView = function() {
            // console.info('ListAdd premuto');
            // reset dei alcuni input...
            $scope.top3.listName = null;
            $scope.top3.listPassword = null;            
            if (!$scope.top3.visibile || ($scope.top3.corrente != "A") ) {
                // $scope.top3.listTitle = 'Create a new List:';
                $scope.top3.listTitlePlaceHolder = 'List Name';
                $scope.top3.corrente = "A";
                $scope.top3.visibile = true;
            }
            else {
                $scope.top3.visibile = false;                
            }
        };    

        $scope.ListLoadView = function() {
            // console.info('ListLoad premuto');
            // reset dei alcuni input...
            $scope.top3.listName = null;
            $scope.top3.listPassword = null;
            if (!$scope.top3.visibile || ($scope.top3.corrente != "L") ) {
                // $scope.top3.listTitle = 'Load a List:';
                $scope.top3.listTitlePlaceHolder = 'List Key';
                $scope.top3.corrente = "L";
                $scope.top3.visibile = true;
            }
            else {
                $scope.top3.visibile = false;                
            }
        };

        // CLICK tu TOP MENU
        $scope.TopMenuView = function() {
            // console.info('TopMenu premuto');
            if (!$scope.top2) {
                $scope.top2 = true;
                // visualizzo subito anche il Top3
                $scope.ListAddView();               
            }
            else {
                $scope.top2 = false;
                $scope.top3.visibile = false;
            }
        };



        // LIST LOAD & ADD
        $scope.Top3OK = function() {
            // console.info('Top3OK premuto');
            if ( !f_ngmodel_isUndefinedOrNull($scope.top3.corrente) && !f_ngmodel_isUndefinedOrNull($scope.top3.listName) && !f_ngmodel_isUndefinedOrNull($scope.top3.listPassword) )
            {
                var xLocalStorageList = [];
                xLocalStorageList = localStorageService.get('lists');
                // LOAD list....
                if ($scope.top3.corrente == "L") {
                    // console.info('LOAD LIST');
                    // controllo che la KEY non sia gia' registrata nel localStorage                    
                    var xarrayLength = xLocalStorageList.length;
                    for (var i = 0; i < xarrayLength; i++) {
                        if ( xLocalStorageList[i].listId === $scope.top3.listName ) {
                            $scope.AlertShow('warning', 'List already loaded');
                            $scope.top3.listName = null;
                            $scope.top3.listPassword = null;
                            return;        
                        }
                    }
                    // avvio servizio
                    var xsrv_return = srvList.loadList($scope.top3.listName,$scope.top3.listPassword).start();
                    xsrv_return.$promise.then(function(data) {
                        $scope.success_cod = data[0].success_cod;
                        $scope.success_msg = data[0].success_msg;
                        if ($scope.success_cod == 0) {
                            // OK - API
                            // aggiorno localStorage                            
                            xLocalStorageList.push({ listId: $scope.top3.listName});
                            var xLocalStorageList_json = JSON.stringify(xLocalStorageList);
                            localStorageService.set('lists',xLocalStorageList_json);
                            // aggiorno DOM
                            $scope.ListRefresh($scope.success_msg);
                        } 
                        else {
                            // KO - API NON sono riuscite a inserire\aggiornare item
                            $scope.AlertShow('danger', $scope.success_msg);
                            $scope.top3.listName = null;
                            $scope.top3.listPassword = null;
                        }
                    });
                }
                // ADD / create new list....
                else if ($scope.top3.corrente == "A") {
                    console.info('ADD new LIST');
                    // avvio servizio
                    var xsrv_return = srvList.addList($scope.top3.listName,$scope.top3.listPassword).start();
                    xsrv_return.$promise.then(function(data) {
                        $scope.success_cod = data[0].success_cod;
                        $scope.success_msg = data[0].success_msg;
                        if ($scope.success_cod == 0) {
                            // OK - API
                            // aggiorno localStorage
                            xLocalStorageList.push({ listId: data[1].list_cod});
                            var xLocalStorageList_json = JSON.stringify(xLocalStorageList);
                            localStorageService.set('lists',xLocalStorageList_json);
                            // aggiorno DOM
                            $scope.ListRefresh($scope.success_msg);
                        } 
                        else {
                            // KO - API NON sono riuscite a inserire\aggiornare item
                            $scope.AlertShow('danger', $scope.success_msg);
                            $scope.top3.listName = null;
                            $scope.top3.listPassword = null;
                        }
                    });

                }
            }

        };    




        // MODAL
        $scope.ModalDelListShow = function(ilistId, ilistDesc, index) {
            console.info('ModalShow - listId= ' + ilistId + ' listDesc= ' + ilistDesc + ' index= ' + index);
            if (!f_ngmodel_isUndefinedOrNull(ilistId)) {
                $scope.delList = [];
                $scope.delList.listId = ilistId;
                $scope.delList.listDesc = ilistDesc;
                $scope.delList.listIndex = index;
                // Show a basic modal from a controller
                var myModal = $modal({
                    template: 'partials/modalyesno.html',
                    // title: 'My Title', 
                    content: 'DELETE List: "' + ilistDesc + '" ?',
                    container: '#msg_modal',
                    placement: 'center',
                    backdrop: false,
                    scope: $scope,
                    // animation: 'alert_animation',
                    // backdropAnimation: 'alert_animation',
                    show: true
                });                
            };
        };


        // per CANCELLARE list
        $scope.listDel = function() {
            // console.info('Main DelList premuto');
            // console.info('ilistId= ' + ilistId);
            // console.info('delList.id= ' + $scope.delList.id);
            // console.info('delList.id= ' + $scope.delList.listId);
            // console.info('delList.desc= ' + $scope.delList.listDesc);
            if ( !f_ngmodel_isUndefinedOrNull($scope.delList.listId) ) {

                // aggiorno subito DOM...
                // rimuovo item corrente
                $scope.lists.splice($scope.delList.listIndex, 1 );

                // rimuovo da localStorage
                var xLocalStorageList = [];
                xLocalStorageList = localStorageService.get('lists');
                var xarrayLength = xLocalStorageList.length;
                var xcurrent = null;
                var xcurrent_index = -1;
                for (var i = 0; i < xarrayLength; i++) {
                    xcurrent = xLocalStorageList[i].listId;
                    if ( xcurrent === $scope.delList.listId ) {
                        xcurrent_index = i;
                    }
                }
                if ( xcurrent_index > -1) {
                    xLocalStorageList.splice(xcurrent_index, 1 );
                }
                var xLocalStorageList_json = JSON.stringify(xLocalStorageList);
                localStorageService.set('lists',xLocalStorageList_json);

                this.$hide();

                $scope.AlertShow('success', 'list ' + $scope.delList.listDesc + ' removed');

            };

        };





        // ************************
        // lancio refresh iniziale
        // ************************
        // console.info('lancio refresh da ctrlList');
        if ($scope.app_is_ok) {
            $scope.ListRefresh();
        }


    }]
);


// ITEM controller
AlphaSuperListControllers.controller('ctrlItem', ['$scope', '$alert', '$routeParams', 'srvItem', 
    function($scope, $alert, $routeParams, srvItem) {
        // console.info('ctrlItem');

        $scope.ListRefreshItem = function() {
            // console.info('ctrlItem refresh');
            // ******** INIZIALIZZAZIONI GENERALI ************                 
            // loading
            $scope.loading_item = true;
            // top2
            // $scope.top2 = false; // false= non visibile
            $scope.top2 = true; // true=visibile.... MarcAlfa dic.2014 lo rimetto sempre visibile qui
            // rimuovo eventuale classe della animazione singola per le righe
            // angular.element(document.querySelectorAll('.righe')).removeClass('rigaDelete');
            // $scope.deletingItem = false;
            // 1!! svuoto array corrente .. quindi aggiorno DOM ******* (con animazione ci mette 0.6s .. vedere animations.css)
            if ( ($scope.listItems) && $scope.listItems.length > 0) {
                // console.info('svuoto array listItems');
                $scope.listItems.splice(0,$scope.listItems.length) || $rootScope.$apply();
            };
            // current item non selezionato ancora
            $scope.current = [];
            $scope.current.operation = null;
            $scope.current.item = null;
            // ************************************************

            // SERVIZIO *****************************************
            var xsrv_return = srvItem.getListItems($scope.listId).start();  
            xsrv_return.$promise.then(function(data) {
                // promise fulfilled                
                $scope.success_cod = data[0].success_cod;
                $scope.success_msg = data[0].success_msg;
                // OK - API
                if ($scope.success_cod == 0) {
                    // OK - API
                    $scope.listDesc = data[1].listDesc;
                    // console.info('DOM -> aggiorno lista items');
                    // $scope.listItems = angular.copy(data[1].items); // in questo modo aggiorna automaticamente soltanto eventuali "differenze"
                    $scope.listItems = data[1].items;
                    $scope.AlertShow('success', $scope.success_msg);
                    $scope.loading_item = false;
                    // viene applicata l'animazione per la rimozione del singolo item
                    // $scope.deletingItem = true;
                } 
                else {
                    // KO - API
                    $scope.AlertShow('danger', $scope.success_msg);
                    $scope.loading_item = false;
                    // $scope.deletingItem = true;
                }
            }, 
                // promise rejected, could log the error with: console.log('error', error);
                function(error) {
                    $scope.AlertShow('danger', 'Data on server unavailable, sorry!');
                    $scope.loading_item = false;
                    // $scope.deletingItem = true;
                }
            );
            // **************************************************


        };


        // $scope.ListPrevious = function() {
        //     // console.info('precedente premuto');
        //     var xnew = $scope.listCurrent - 1;
        //     if (xnew < 0) {
        //         // ritorno all'ultima
        //         xnew = ($scope.listLocal.length - 1);
        //     }
        //     $scope.listCurrent = xnew;
        //     $scope.listId = $scope.listLocal[xnew].list_id;
        //     // refresh
        //     $scope.ListRefreshItem();
        // };    


        // $scope.ListNext = function() {
        //     // console.info('successivo premuto');
        //     var xnew = $scope.listCurrent + 1;
        //     if ( xnew > ($scope.listLocal.length - 1) ) {
        //         // ritorno alla zero
        //         xnew = 0;
        //     }
        //     $scope.listCurrent = xnew;
        //     $scope.listId = $scope.listLocal[xnew].list_id;            
        //     // refresh
        //     $scope.ListRefreshItem();
        // };


        $scope.AddItem = function() {
            // console.info('AddItem premuto');
            // if ($scope.listId && $scope.itemAddDesc && ($scope.itemAddDesc.length > 0)) {
            if ( !f_ngmodel_isUndefinedOrNull($scope.listId) && !f_ngmodel_isUndefinedOrNull($scope.itemAddDesc) ) {
                // controllo che ITEM non sia gia' nella lista corrente

                var xarrayLength = 0;
                if (f_array_check_valid($scope.listItems)) {
                    var xarrayLength = $scope.listItems.length;
                }
                var xitemAddDesc = $scope.itemAddDesc.toUpperCase();
                // console.info('arraylength= ' + xarrayLength + ' itemAddDesc= ' + xitemAddDesc);
                if (xarrayLength > 0) {
                    for (var i = 0; i < xarrayLength; i++) {
                        // console.info($scope.listItems[i].itemDesc);
                        if ( $scope.listItems[i].itemDesc === xitemAddDesc ) {
                            $scope.AlertShow('warning', 'item already exists');
                            $scope.itemAddDesc = '';
                            return;        
                        }
                    }
                };

                // adesso
                var xoggi = "";
                var d = new Date();
                var curr_date = d.getUTCDate();
                var curr_month = d.getUTCMonth() + 1;
                var curr_year = d.getUTCFullYear();
                var curr_hour = d.getUTCHours();
                var curr_min = d.getUTCMinutes();
                //xoggi = (curr_date<=9 ? '0' + curr_date : curr_date) + "." + (curr_month<=9 ? '0' + curr_month : curr_month) + "." + curr_year + " " + (curr_hour<=9 ? '0' + curr_hour : curr_hour) + ":" + (curr_min<=9 ? '0' + curr_min : curr_min);
                xoggi = (curr_date<=9 ? '0' + curr_date : curr_date) + "." + (curr_month<=9 ? '0' + curr_month : curr_month) + "." + curr_year;
                // riempio array lista se inesistente
                if (!f_array_check_valid($scope.listItems)) {
                    $scope.listItems = [];
                }
                // aggiorno DOM (ancora prima del DB, per velocita UX)
                $scope.listItems.splice(0,0,{
                    itemDesc: $scope.itemAddDesc.toUpperCase(),
                    itemDate: xoggi
                })

                // SERVIZIO *****************************************
                var xsrv_return = srvItem.putListItem($scope.listId,$scope.itemAddDesc,null).start();  
                xsrv_return.$promise.then(function(data) {
                    // promise fulfilled                
                    $scope.success_cod = data[0].success_cod;
                    $scope.success_msg = data[0].success_msg;
                    // OK - API
                    if ($scope.success_cod == 0) {
                        // ... non dico niente, tutto ok
                    } 
                    // KO - API
                    else {
                        $scope.AlertShow('danger', $scope.success_msg);
                    }
                }, 
                    // promise rejected, could log the error with: console.log('error', error);
                    function(error) {
                        $scope.AlertShow('danger', 'Data on server unavailable, sorry!');
                    }
                );
                // **************************************************
                $scope.itemAddDesc = '';

            };
        };


        $scope.DelItem = function( index, iitemDesc) {
            // console.info('DelItem premuto listId= ' + $scope.listId + ' iitemDesc= ' + iitemDesc);
            $scope.current.operation = "del";
            $scope.current.item = iitemDesc;
            
            if ( !f_ngmodel_isUndefinedOrNull($scope.listId) && !f_ngmodel_isUndefinedOrNull(iitemDesc) ) {
                // aggiorno subito DOM senza aspettare DB (per velocizzare UX)
                // console.info('rimuovo item corrente');
                $scope.listItems.splice(index, 1 );

                // SERVIZIO *****************************************
                var xsrv_return = srvItem.delListItem($scope.listId,iitemDesc).start();  
                xsrv_return.$promise.then(function(data) {
                    // promise fulfilled                
                    $scope.success_cod = data[0].success_cod;
                    $scope.success_msg = data[0].success_msg;
                    // OK - API
                    if ($scope.success_cod == 0) {
                        $scope.AlertShow('success', $scope.success_msg);
                        // $scope.deletingItem = false;  // || $rootScope.$apply();
                    } 
                    // KO - API
                    else {
                        $scope.AlertShow('danger', $scope.success_msg);
                    }
                }, 
                    // promise rejected, could log the error with: console.log('error', error);
                    function(error) {
                        $scope.AlertShow('danger', 'Data on server unavailable, sorry!');
                    }
                );
                // **************************************************                
            };
            
        };


        $scope.ArkItem = function( index, iitemDesc) {
            // console.info('ArkItem premuto listId= ' + $scope.listId + ' iitemDesc= ' + iitemDesc);
            $scope.current.operation = "ark";
            $scope.current.item = iitemDesc;

            if ( !f_ngmodel_isUndefinedOrNull($scope.listId) && !f_ngmodel_isUndefinedOrNull(iitemDesc) ) {
                // console.info('rimuovo item corrente');                
                $scope.listItems.splice(index, 1 );

                // SERVIZIO *****************************************
                // var xsrv_return = srvItem.delListItem($scope.listId,iitemDesc).start();  
                // xsrv_return.$promise.then(function(data) {
                //     // promise fulfilled                
                //     $scope.success_cod = data[0].success_cod;
                //     $scope.success_msg = data[0].success_msg;
                //     // OK - API
                //     if ($scope.success_cod == 0) {
                //         $scope.AlertShow('success', $scope.success_msg);
                //         // $scope.deletingItem = false;  // || $rootScope.$apply();
                //     } 
                //     // KO - API
                //     else {
                //         $scope.AlertShow('danger', $scope.success_msg);
                //     }
                // }, 
                //     // promise rejected, could log the error with: console.log('error', error);
                //     function(error) {
                //         $scope.AlertShow('danger', 'Data on server unavailable, sorry!');
                //     }
                // );
                // **************************************************
            };
            
        };


        $scope.setCurrentItem = function(iitem) {
            console.info('setCurrentItem start');
            $scope.current_item = iitem;
        };

        $scope.getCurrentItemClass = function(iitemDesc) {
            console.info('getCurrentItemClass start '  + ' $scope= ' + $scope.current_item + " iitemDesc= " + iitemDesc);
            return $scope.current_item == iitemDesc ? 'rigaCurrent' : "";
        };



        // ************************
        // lancio refresh iniziale
        // ************************
        $scope.listId = $routeParams.listId;
        $scope.ListRefreshItem();


    }]
);




// funzioni java generali
function f_array_check_valid (iarray)
{
    if (typeof iarray != "undefined" && iarray != null && iarray.length > 0) {
        return true;
    }
    return false;
};

function f_ngmodel_isUndefinedOrNull (val) {
    return angular.isUndefined(val) || val === null || val === ""
};


