<?
$traffic_msg	= json_encode(array("type"=>"serve", "data"=>array("ntw_id"=>$ntw_id,"geo"=>array("latitude"=>$geo['latitude'], "longitude"=>$geo['longitude']))));
$fp = fsockopen("udp://{$GLOBALS['udp_traffic_server']['ip']}", $GLOBALS['udp_traffic_server']['port']);
if ($fp) {
	fwrite($fp, $traffic_msg);
	fclose($fp);
}
?>