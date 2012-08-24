<?php
/**
 * © 2012 iRail npo - Some rights reserved
 * The resulting icon is licensed under CC BY SA
 * Attribute http://mapicons.nicolasmollet.com/
 *
 * This script is available under the WTFPL
 * and comes without any waranty
 */

//1. process GET parameters
if(!isset($_GET["color"])){
    echo "Please add a color parameter in your url";
    exit(0);
}
$color = urldecode($_GET["color"]);

//2. transfer the hex color to rgb
function hex_to_rgb($color){
    preg_match('/[#]?([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)([0-9a-fA-F][0-9a-fA-F]?)/smi', $color, $chars);
    $color = array();
    $color[0] = hexdec($chars[1]);
    $color[1] = hexdec($chars[2]);
    $color[2] = hexdec($chars[3]);
    return $color;
}
function rgb_to_rgb($color){
    preg_match('/(\d\d?\d?), (\d\d?\d?), (\d\d?\d?)/smi', $color, $chars);
    $color = array();
    $color[0] = $chars[1];
    $color[1] = $chars[2];
    $color[2] = $chars[3];
    return $color;
}

if (stristr($color, '#')) {
	$color = hex_to_rgb($color);
} else if (stristr($color, ',')) {
	$color = rgb_to_rgb($color);
}

$fromcolor = hex_to_rgb("5781fc");

// Create image
$im = imagecreatefrompng("workoffice.png");
imagefilter($im,IMG_FILTER_GRAYSCALE);
//imagetruecolortopalette($im,false, 255);
//get the color to be changed: get it from somewhere in the middle
$index = imagecolorat($im, 20,10);
//$index= imagecolorclosest($im,$fromcolor[0],$fromcolor[1],$fromcolor[2]);
//$index= imagecolorclosest($im,255,255,255);
// Let's change color to a get parameter
imagecolorset($im,$index,$color[0],$color[1],$color[2]);
// Set alphablending to false and alpha save to true
// This will preserve transparency
imagealphablending( $im, false );
imagesavealpha( $im, true );
imagefilter($im, IMG_FILTER_COLORIZE, $color[0], $color[1], $color[2]);
//imagefilter($im, IMG_FILTER_BRIGHTNESS, 5);
//imagefilter($im, IMG_FILTER_CONTRAST, 10);



// Output
header('Content-type: image/png');

imagepng($im);
imagedestroy($im);
?>