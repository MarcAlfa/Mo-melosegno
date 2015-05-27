<?php

/*
 * @author MarcAlfa
 * CLASS --> AlphaList
*/


class AlphaList {

	// VARIABILI INIZIALI
	// class GLOBAL
	private $MyGlobal;
	// connessione al db
	private $MyConnDB;
	// risultati dal db
	private $MyResult;


	// CONSTRUCTOR	
	public function __construct() {
		// CLASS AlphaGlobal
		require_once ("inc/alphalist-global.inc");
		$this->MyGlobal = new MyGlobal;
		// creo anche connessione al DB che verra' esguita poi dalle funzioni richiamate
		$this->MyConnDB = $this->MyGlobal->DB_connect();
		// autocommit off
		mysqli_autocommit($this->MyConnDB,FALSE);
		// $this->MyGlobal->MyLog('costruzione classe AlphaList', __CLASS__, __FILE__, __LINE__ );		
	}

	// DETRUCTOR	
	public function __destruct() {
		// $this->MyGlobal->MyLog('distruzione classe AlphaList', __CLASS__, __FILE__, __LINE__ );		
		// Commit transaction
		// mysqli_commit($this->MyConnDB);		
		// autocommit on		
		mysqli_autocommit($this->MyConnDB,TRUE);	
   		// liberazione delle risorse occupate dal risultato
   		// if(isset($this::MyResult)) {$this::MyResult::close();}
   		if(isset($this->MyResult)) {
   			if ($this->MyResult) {
   				$this->MyResult = '';
   			}
   			else {
   				mysqli_free_result($this->MyResult);
   			}
   		}
		// chiusura della connessione
		if(isset($this->MyConnDB)) (mysqli_close($this->MyConnDB));
	}


	// ****
	// getLists --> ritorna ARRAY con LIST
	public function getLists ($iList_array) {
		// variabile da tornare
		$return = array();

		if (isset($iList_array)) {
			// stringa per query
			$query_in = '';
			$xcount = count($iList_array);
			// esempio: '99999999','88888888',.....
			for ($i = 0; $i < $xcount; ++$i) {
				if ($i === ($xcount - 1)) { // ultimo giro
        			$query_in = $query_in . "'" . $iList_array[$i]['listId'] . "'";
        		}
        		else {
        			$query_in = $query_in . "'" . $iList_array[$i]['listId'] . "',";
        		}
        	}
        	if (isset($query_in)) {
				$query = ' SELECT list_cod, list_desc, list_date, (select count(*) from item as i where i.list_cod = l.list_cod) conteggio ';
				$query = $query . ' FROM list as l WHERE list_cod IN (' . $query_in . ') ';
				$query = $query . ' ORDER BY field(list_cod,' . $query_in . ') desc; ';

				$this->MyResult = mysqli_query($this->MyConnDB,$query);
				// OK!! TROVATA LISTA
				// generazione array con risposta
				if(mysqli_num_rows($this->MyResult) > 0) {
					$list_lists = array();
					// generazione array con risposta
					while ($item = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {
						$list_date = strftime("%d.%m.%Y", strtotime($item['list_date']));
 						$lists = array(
 							'listId' => $item['list_cod'] 
 							,'listDesc' => $item['list_desc'] 
 							,'listDate' => $list_date
 							,'itemsCount' => $item['conteggio'] 
 						);
 						array_push($list_lists, $lists);
 					}
 					$return = array( 'lists' => $list_lists );
				}
			}
        }
		return $return;

	}
	// fine getLists


	// ****
	// getListItem --> ritorna ARRAY con ITEM di una specifica LIST
	public function getListItems ($iList_cod) {
		// variabile da tornare
		$return = array();

		// List - TESTATA
		$query = ' SELECT list_cod, list_desc, list_date FROM list WHERE list_cod = "' . $iList_cod . '";';           // and list_psw = '0' ORDER by list_date;
		$this->MyResult = mysqli_query($this->MyConnDB,$query);
		// OK!! TROVATA LISTA
		// generazione array con risposta
		if(mysqli_num_rows($this->MyResult) == 1) {
			while ($list = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {
	        	$list_cod = $list['list_cod']; 
	            $list_desc = $list['list_desc'];
	           	$list_date = $list['list_date'];           	
			}
		}
		else {
			return $return;  // vuoto	
		}

		// List - ITEMS -> $list_items
		$query = ' SELECT item_id, item_desc, item_note, item_date FROM item WHERE list_cod = "' . $iList_cod . '" ORDER BY item_date desc;';
		$this->MyResult = mysqli_query($this->MyConnDB,$query);
		// OK!! TROVATI ITEMS
		if(mysqli_num_rows($this->MyResult) > 0) {
			// generazione array con risposta
			$list_items = array();
			while ($item = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {
				// $item_date = date('d.m.y', strtotime($item['item_date']));
				//$item_date = strftime("%d.%m.%Y %H:%M", strtotime($item['item_date']));
				$item_date = strftime("%d.%m.%Y", strtotime($item['item_date']));
				$items = array
            	(
              		'itemId'   => $item['item_id'], 
              		'itemDesc' => $item['item_desc'],
              		'itemNote' => $item['item_note'],
              		'itemDate' => $item_date
            	);
  				array_push($list_items, $items);            	
			}
 		}
 		$return = array( 
 						'listId' => $list_cod,
 						'listDesc' => $list_desc, 
 						'listDate' => $list_date, 
 						'items' => $list_items 
 						);
		return $return;
	}
	// fine getListItems


	// putListItem --> per creare/aggiornare ITEM nella lista corrente
	// ritorna:
	//           >0 --> item id appena creato
	//           <0 --> errore 
	public function putListItem ($iList_cod, $iItem_desc, $iItem_note ) {
		// variabile da tornare 
		$return = -1;
		if (isset($iList_cod) && isset($iItem_desc) ) {
			// chiamata a funzione MySql che restituisce ID item appena creato/aggiornato
			$query = ' SELECT f_item_put ( "' . $iList_cod . '","' . $iItem_desc . '","' . $iItem_note . '");';
			$this->MyResult = mysqli_query($this->MyConnDB,$query);
			if(mysqli_num_rows($this->MyResult) > 0) {
				$return = $this->MyResult; // id dell'item appena creato
			}
		}
		return $return;		
	}
	// fine putListItem


	// delListItem --> per cancellare ITEM nella lista corrente
	// ritorna:
	//           >0 --> item cancellato correttamente
	//           <0 --> errore
	public function delListItem ($iList_cod, $iItem_desc) {
		// variabile da tornare
		$return = -1;
		if (isset($iList_cod) && isset($iItem_desc) ) {
			// chiamata a funzione MySql che restituisce ID item appena creato/aggiornato
			// $query = ' DELETE FROM item WHERE list_cod = "' . $iList_cod . '" AND item_desc = "' . $iItem_desc . '"';
			$query = ' SELECT f_item_del ( "' . $iList_cod . '","' . $iItem_desc . '") as item_del;';
			$this->MyResult = mysqli_query($this->MyConnDB,$query);
			if($this->MyResult) {
				while ($item = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {  // e' sempre solo 1, cmq loop
					if (isset($item['item_del'])) {
  						// $return = array('item_del' => $item['item_del'] );  // ritorna 1=true, 0=false
						if ($item['item_del'] > 0 ) {
							$return = 1;
						}
						else {
							$return = -1;
						}
  					}
				}
			}
		}
		return $return;
	}
	// fine delListItem


	// loadList --> per caricare una LISTA (tramite KEY+PSW)
	// ritorna:
	//           array --> nome lista caricata
	//           array vuoto --> altrimenti 
	public function loadList ($iList_cod, $iList_psw) {
		// variabile da tornare 
		$return = array();
		// echo 'iList-cod' . $iList_cod . ' iList_pws' . $iList_psw;
		if (isset($iList_cod) && isset($iList_psw) ) {
			// chiamata a funzione MySql
			$query = ' SELECT f_list_load ( "' . $iList_cod . '","' . $iList_psw . '") as list_desc;';
			$this->MyResult = mysqli_query($this->MyConnDB,$query);
			if($this->MyResult) {
				while ($item = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {  // e' sempre solo 1, cmq loop
					if (isset($item['list_desc'])) {
  						$return = array('list_desc' => $item['list_desc'] );
  					}
				}
			}
		}
		return $return;		
	}
	// fine loadList


	// AddList --> per creare una nuova LISTA (tramite NAME+PSW)
	// ritorna:
	//           array --> KEY lista creata
	//           array vuoto --> altrimenti 
	public function addList ($iList_desc, $iList_psw) {
		// variabile da tornare 
		$return = array();
		if (isset($iList_desc) && isset($iList_psw) ) {
			// chiamata a funzione MySql
			$query = ' SELECT f_list_put ( "' . $iList_desc . '","' . $iList_psw . '") as list_cod;';
			$this->MyResult = mysqli_query($this->MyConnDB,$query);
			if($this->MyResult) {
				while ($item = mysqli_fetch_array($this->MyResult, MYSQLI_ASSOC)) {  // e' sempre solo 1, cmq loop
					if (isset($item['list_cod'])) {
  						$return = array('list_cod' => $item['list_cod'] );
  					}
				}
			}
		}
		return $return;		
	}
	// fine addList


     // Cycle through results
    // while ($row = $result->fetch_object()){
        // $user_arr[] = $row;

}
// **** FINE AlphaList **//


function debug_to_console( $data ) {

    if ( is_array( $data ) )
        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    else
        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

    echo $output;
}

?>