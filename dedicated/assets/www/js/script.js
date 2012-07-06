/* Author:

 */
var ip = conf.ip;
var url = ip+ conf.url;
var hostname = conf.hostname;
$("#button1").click(function(){
    $("#button1").html("Sending...");
    $.ajax({
        url: url + hostname + "/power",
        type: "POST",
        data: {
            value: "on"
        },
	success: function(){
		//location.reload(true);
	}
    });
});
$("#button2").click(function(){
    $("#button2").html("Sending...");
    $.ajax({
        url: url+ hostname +"/power",
        type: "POST",
        data: {
            value: "off"
        },
	success: function(){
		location.reload(true);
	}
    });
});

$("#button3").click(function(){
    $("#button3").html("Sending...");
    $.ajax({
        url: url + hostname + "/status",
        type: "POST",
        data: {
            value: "reload"
        },
	success: function(){
		location.reload(true);
	}
    });
});


$("#button4submit").click(function(){
    $("#button4submit").html("Sending...");
    var msg = $("#custommessage").val();
    $.ajax({
        url: url+hostname+"/status",
        type: "POST",
        data: {
            message: msg,
            value: "message"
        },
	success: function(){
		location.reload(true);
	}
    });
});
$("#buttontest").click(function(){
    $("#buttontest").html("Sending...");
    var msg = $("#image_url").val();
    $.ajax({
        url: url+hostname+"/image",
        type: "POST",
        data: {
            message: msg,
            value: "message"
        },
	success: function(){
		location.reload(true);
	}
    });
})
$("#button_url").click(function(){
    $("#button_url").html("Sending...");
    var msg = $("#page_url").val();
    $.ajax({
        url: url+hostname+"/url",
        type: "POST",
        data: {
            message: msg,
            value: "message"
        },
        success: function(){
            location.reload(true);
        }
    });
});
