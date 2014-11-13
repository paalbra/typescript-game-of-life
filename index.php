<!DOCTYPE html>
<?php
$width  = ( isset($_GET['w']) && preg_match('/^\d{1,4}$/', $_GET['w']) ? $_GET['w'] : 1000 );
$height = ( isset($_GET['h']) && preg_match('/^\d{1,4}$/', $_GET['h']) ? $_GET['h'] : 400 );
?>
<html>
<head>
<title>Life</title>
<meta charset="utf-8" />
<script type="text/javascript" src="life.js"></script>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
window.onload = function() {
	l = new Life("life", <?php echo "$width, $height" ?>);
	l.randomizeImageData();
	window.setInterval(function() {
		l.tick();
		l.updateCanvas();
	}, 0);

	padBodyTop();
};

$(window).bind("resize", padBodyTop);

function padBodyTop() {
	var topPad = Math.round(($(window).height() - $('#life').height())/2);
	if (topPad < 0) topPad = 0;
	$('body').animate({paddingTop: topPad}, 200);
}
</script>
<style>
body {
	margin: 0;
	padding: 0;
	background: #000;
	color: #ccc;
	font-family: "Courier New", Courier, monospace;
}
#life {
	display: block;
	margin: 0 auto;
	background: #000;
	margin: 0 auto;
}
</style>
</head>

<body>

<canvas id="life"></canvas>

</body>

</html>
