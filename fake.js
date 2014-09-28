var fake = exports;

fake.randomGeo = function() {

	/*
	+48.987386 is the northern most latitude
	+18.005611 is the southern most latitude
	-124.626080 is the west most longitude
	-62.361014 is a east most longitude
	*/

	var from;
	var to;

	from = 18.005611;
	to = 48.987386;
	var lat = (Math.random() * (to - from) + from).toFixed(3) * 1;

	from = 62.361014;
	to = 124.626080;
	var long = (Math.random() * (to - from) + from).toFixed(3) * -1;

	from = 1;
	to = 10;
	var id = (Math.random() * (to - from) + from).toFixed(0) * 1;

	//http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png

var images = [
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_purple.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_white.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_black.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png",
	"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_brown.png"
];

	return {
		"id":id,
		"image":images[id-1],
		"lat":lat,
		"long":long
	};

}


