<?
$traffic_msg	= json_encode(array(
	"type"=>"serve",
	"channel"=>"/", // Default channel
	"data"=>array(
		"site_id"=>$site_id,
		"post_id"=>$post_id,
		"geo"=>array(
			"lat"=>$geo['latitude'],
			"long"=>$geo['longitude']
		)
	)
));
$fp = fsockopen("udp://{$GLOBALS['udp_traffic_server']['ip']}", $GLOBALS['udp_traffic_server']['port']);
if ($fp) {
	fwrite($fp, $traffic_msg);
	fclose($fp);
}
?>