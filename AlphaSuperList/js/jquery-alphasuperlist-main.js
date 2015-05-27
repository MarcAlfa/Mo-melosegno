/**
 *	MarcAlfa - JQuery plugin for "main" view of AlphaSuperList
 *	author    : Marco Alfano (MarcAlfa)
 *	website   : 
 *	year      : 2014
 * 	copyright : All right reserved
 */




window.AlphaSuperListMain = function(options)
{ 
     
	// ************************************************************
	// VERSIONE e data
	var pluginName = "AlphaSuperListMain"
 	var pluginVersion = "0.5";
	var pluginDate = "Ago.2014";
	// ************************************************************

	// ************************************************************
	// SETTINGS e options
	var settings = $.extend({}, 
	{
		debug: false, 		   //true = scrive log in console		
	}, 
	options || {});


	// ***********************************
	// log ******************
	// ***********************************
  	var miolog = (function (itext)
	{
		if (!settings.debug) return; // esce se non si vuole debug
		// nome funzione/plug-ing
		xlog_testo = 'jQuery-> ' + pluginName + ' ' + pluginVersion + ' ' + itext;
		// scrivo
    	if (window.console && window.console.log)
		{
			window.console.log(xlog_testo);				
		};  	
	});
    miolog('inizio');
	// ***********************************
	// FINE log ******************
	// ***********************************	



	// ************************************************************
	// INIT
	function init()
	// init = function() 
	{            
        // Put your initialization code here
		// miolog("init");

		// EVENTI
		eventi();

		// prova per liminare elastica scroll on iphones
		//$('top').on('touchmove', function(e) { e.preventDefault(); });		

		// $("#pagina1").addClass("pagina-current");

	};
				
	// ***********************************
	// FUNZIONI PRIVATE ******************
	// ***********************************
		
	
	// ***********************************
	// EVENTI ******************
	// ***********************************		
	// associazione eventi (click, mouse, hover, ecc....)
	var eventi = function ()
	{
		
		// RESIZE della finestra
	 	// $(window).on('resize', function(e){
		// 	console.log('evento RESIZE');
		// });
	
		// SCROLL della finestra	
		// $(window).scroll(function() {
		// 	console.log('evento SCROLL');
		// });

		// SWIPE
		$(document).on("swipeleft swiperight","#top", function(e){
			miolog("evento SWIPE");
			e.stopImmediatePropagation();
			e.preventDefault();
			alert("che fai swappi?");
		});

		// ***********************************************************			
		// CLICK su icona MENU #topMenu
		// ***********************************************************
		var xtopMenu = $("#topMenu");
		xtopMenu.on("click", function(e) {
			// miolog("click su col1");
			e.preventDefault();
			var xmenu = $("#menu");
			var xmenuWidth = xmenu.width();
			var xmenuIsVisible = xmenu.css("visibility");
			
			// **** gia' visibile -> lo nascondo
			if (xmenuIsVisible == "visible")
			{
				// muovo icona menu
				xtopMenu.animate(
					{
    					left: "0px",
  					}, 
  					600, 
  					function() {}
  				);
  				// muovo menu
				xmenu.animate(
					{
						opacity: 0,
    					left: (xmenuWidth) * -1,
  					}, 
  					600, 
  					function() 
  					{
    					// Animation complete.
  						xmenu.css({visibility: "hidden"});
  					}
  				);
			}
			// **** nascosto -> lo visualizzo			
			else 
			{
				xmenu.offset({left: (xmenuWidth * -1)});
				xmenu.css({visibility: "visible"});
				// muovo icona menu
				xtopMenu.animate(
					{
    					left: "-15px",
  					}, 
  					600, 
  					function() {}
  				);
  				// muovo menu				
				xmenu.animate(
				{
					opacity: 1,
    				left: 0,
  				}, 600, 
  					function() 
  					{
    					// Animation complete.
  					});			

			};
		});



						
    };
	// ***********************************
	// FINE EVENTI ******************
	// ***********************************


	// ***********************************
	// TIMER  ******************
	// ***********************************
	var Timer0 = function()
	{
		miolog("Timer0 inizio");
		// girotondo su logo studio
		// 	setTimeout(function()
		// 	{
		// 		if (xTimer0_count > 0) 
		// 		{
		// 			//miolog("Timer0 count="+xTimer0_count);
		// 			var xlogostudio = $("#toplogo2");
		// 			xlogostudio.stop();
		// 			xlogostudio.addClass("run-Girotondo");
		// 			var newone = xlogostudio.clone(true); // CLONO l'ORIGINALE
		// 			xlogostudio.before(newone);  // LO ATTACCO PRIMA DELL'ORIGINALE
		// 			$("." + xlogostudio.attr("class") + ":last").remove();  // ELIMINO l'ORIGINALE
		// 		};
		// 		xTimer0_count = xTimer0_count + 1;
		// 		Timer0();
		// 		},120000); // 2 min
		// 
	};
	// ***********************************
	// FINE TIMER  ******************
	// ***********************************		

		



	// ***********************************
	// FINE OK - RETURN ******************
	// ***********************************
	// miolog('fine-OK');
	return { 
		init: init
	};


};
