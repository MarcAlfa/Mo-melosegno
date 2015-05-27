<?php

/**
 * @author MarcAlfa 2014
 * CLASS MyGlobal
 */
 

class MyGlobal {

	// credenziali per accesso database. poi andranno messe in posto piu sicuro//
	// **sviluppo**
	// private static $DB_SERVER = 'localhost';
	// private static $DB_USER = 'marcalfa';
	// private static $DB_PASS = 'alpha999';
	// private static $DB_SCHEMA = 'marcalfa_alphalist';

	// **produzione**
	private static $DB_SERVER = 'localhost';
	private static $DB_USER = 'vmarcalw';
	private static $DB_PASS = 'ryks8wrorjEuka';
	private static $DB_SCHEMA = 'vmarcalw_db';

	/************************************************************
	 * DB CONNECT
	 * funzione per connessione al DB mysql, ritorna la connessione stessa
	************************************************************/
	public function DB_connect () {

		// connessione a MySQL con l'estensione MySQLi
		$mysqli = new mysqli($this::$DB_SERVER,$this::$DB_USER,$this::$DB_PASS,$this::$DB_SCHEMA);

		// ERRORE connessione
		if (mysqli_connect_errno()) {
			// $this->MyLog("Errore in connessione al DBMS: " . mysqli_connect_error(), __CLASS__, __FILE__, __LINE__);
           	// interruzione delle esecuzioni in caso di errore
        	return -1;
		}

		// OK connessione		
		else {
        	// $this->MyLog("Connessione avvenuta con successo", __CLASS__, __FILE__, __LINE__);
        	// ritorno connessione
        	return $mysqli;
		}
  
		// chiusura della connessione   // va fatta dal chiamante
		// $mysqli->close();
	}



	/************************************************************
	 * LOG
	************************************************************/
	public function MyLog($imessage, $iclass, $ifile, $iline )
	{
		if (isset($imessage)) {
	    	$m = htmlentities($imessage);
	  	}
	  	else {  
	    	$m = 'Unknown error!';
	  	}
	  	if (isset($m)) {
	  		echo '<p>' . $m . '</p>';	  
	  	}
	  	if (isset($ifile)) {
	  		echo '<pre> &nbsp &nbsp &nbsp(' . $iclass . '-' . $ifile . '-' .  $iline . ') </pre>';
		}
	}


}
// FINE Class MyGlobal




?>