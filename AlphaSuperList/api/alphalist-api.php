<?php
/*
 * @author MarcAlfa
 * pagina in php - controller per API 
 * restituisce tutto in JSON
*/


// imposto header di risposta per formato JSON + evitare CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');	


//http://blog.brunoscopelliti.com/xhr-interceptor-in-an-angularjs-web-app
// if(stripos($_SERVER["CONTENT_TYPE"], "application/json") === 0) {
//     $data = json_decode(file_get_contents("php://input"), true);
// }

// parametri http request
$operation = $_GET["operation"];

// controllo parametri
if(!isset($operation)) (RETURN_EXIT('-2','operation null not allowed',null));



// OPERATION
switch ($operation) {

    case 'getLists':
        // INPUT
        $list_array = stripslashes($_GET["listArray"]);
        if(!isset($list_array)) (RETURN_EXIT('-3','lists empty',null));
        $list_array_array = json_decode($list_array,true);  // trasforma in array
        // class AlphaList
        require_once( "alphalist-list.php" );
        $AlphaList = new AlphaList();
        $Lists = $AlphaList->getLists($list_array_array);
        if (count($Lists) > 0) {
            RETURN_EXIT('0','loaded from server',$Lists);
        }
        RETURN_EXIT('-11','lists not found on server',null);

	case 'getListItems':
        // INPUT
        $list_cod = $_GET["listId"];
        if(!isset($list_cod)) (RETURN_EXIT('-3','list ID null not allowed',null));
		// class AlphaList
		require_once( "alphalist-list.php" );
		$AlphaList = new AlphaList();
		$ListItems = $AlphaList->getListItems($list_cod);
        if (count($ListItems) > 0) {
            RETURN_EXIT('0','loaded from server',$ListItems);
        }
        RETURN_EXIT('-21','no lists found on server',null);

    case 'putListItem':
        // INPUT
        $list_cod = $_GET["listId"];
        if(!isset($list_cod)) (RETURN_EXIT('-3','list ID null not allowed',null));
        $item_desc = $_GET["itemDesc"];
        if(!isset($item_desc)) (RETURN_EXIT('-3','Title item null not allowed',null));
        $item_note = $_GET["itemNote"];
        // class AlphaList
        require_once( "alphalist-list.php" );
        $AlphaList = new AlphaList();
        $return = $AlphaList->putListItem($list_cod,$item_desc,$item_note);
        if ($return > 0) {
            RETURN_EXIT('0','item added on server',$return);
        }
        RETURN_EXIT('-31','error inserting item on server',null);

    case 'delListItem':
        // INPUT
        $list_cod = $_GET["listId"];
        if(!isset($list_cod)) (RETURN_EXIT('-3','list ID null not allowed',null));
        $item_desc = $_GET["itemDesc"];
        if(!isset($item_desc)) (RETURN_EXIT('-3','Title item null not allowed',null));

        // class AlphaList
        require_once( "alphalist-list.php" );
        $AlphaList = new AlphaList();
        $return = $AlphaList->delListItem($list_cod,$item_desc);
        if ($return > 0) {
            RETURN_EXIT('0','item deleted from server',$return);
        }
        RETURN_EXIT('-41','error deleting item from server',null);

    case 'loadList':
        // INPUT
        $list_cod = $_GET["listId"];
        if(!isset($list_cod)) (RETURN_EXIT('-3','list ID null not allowed',null));
        $list_psw = $_GET["listPsw"];
        if(!isset($list_psw)) (RETURN_EXIT('-3','Password null not allowed',null));
        // class AlphaList
        require_once( "alphalist-list.php" );
        $AlphaList = new AlphaList();
        $return = $AlphaList->loadList($list_cod,$list_psw);
        if (count($return) > 0) {
            RETURN_EXIT('0',$return['list_desc'] . ' loaded from server',$return);
        }
        RETURN_EXIT('-51','list not found, sorry!',null);

    case 'addList':
        // INPUT
        $list_desc = $_GET["listName"];
        if(!isset($list_desc)) (RETURN_EXIT('-3','list Name null not allowed',null));
        $list_psw = $_GET["listPsw"];
        if(!isset($list_psw)) (RETURN_EXIT('-3','Password null not allowed',null));
        // class AlphaList
        require_once( "alphalist-list.php" );
        $AlphaList = new AlphaList();
        $return = $AlphaList->addList($list_desc,$list_psw);
        if (count($return) > 0) {
            RETURN_EXIT('0',$return['list_cod'] . ' created!',$return);
        }
        RETURN_EXIT('-61','list not created, sorry!',null);

	default:
		RETURN_EXIT('-101','operation not allowed on server',null);
}
exit();
// FINE operation


// funzione per OUTPUT in json
// input: 
function RETURN_EXIT ($icode, $imsg, $idata) {
    $return = array();
	$success = array ('success_cod' => $icode, 'success_msg' => $imsg);
    if (count($idata) > 0) {
        $return = array( 
                        $success,
                        $idata
                        );

    }
    else {
        $return = array($success);
    }
	echo json_encode($return);
    exit(); // ESCO
}




/*
try {
    $API = new MyAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}
*/



?>