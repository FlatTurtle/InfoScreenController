//the token will be verified with every request so the screen_id or hostname will be known not needed here
var token;
var turtles;
$(document).bind("mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
});

function checkStatus(status){
    if(status == 403){
        $.mobile.changePage("#authentication", {
            reverse : false,
            changeHash : false
        });
    }
    else if(status == 400){
    	$('#lists').html('');
    	$('#lists').append('<a id=\'refresh\' data-role=\'button\'>refresh</a>');
    	$('#refresh').live('click', function() {
    		getTurtles();
    	});
    }
}

function clearToken(){
    token = '';
}

function changePass(){
    var newPass = $('#newPass').val();
    window.plugins.Plugin.get(newPass,function(r) {
            console.log(r);
            goto('#main');
        }, function(e) {
            console.log(e)
        });
}


function goto(url) {
    console.log(url);
    $.mobile.changePage(url, {
        reverse : false,
        changeHash : false
    });
}


function initiate() {
    try {
        token = localStorage.getItem("token");
        getTurtles();
    } catch (e) {
    }
}

function getImage(i) {
	switch (turtles[i].module) {
	case "nmbs":
		// alert("still at school")
		return 'images/train_icon.png';
	case "map":
		// alert("still young")
		return 'images/map_icon.png';
	case "delijn":
		// alert("start lying")
		return 'images/bus_icon.png';
	case "twitter":
		// alert("start saving")
		return 'images/news_icon.png';
	case "airport":
		return 'images/plane_icon.png';
	case "mivbstib":
		return 'images/subway_icon.png';
	default:
		return 'images/bike_icon.png';
	}
}

function getTurtles() {
    $.ajax({
        url : url_controlbay+"api/turtles",
        type : "GET",
        dataType : 'json',
        headers : {
            Authorization : token
        },
        success : function(response) {
            
            var i=0;
            turtles = response;
            var html = '';
            $.each(response, function(key) {
                if(i%3 == 0)html+='<tr>';
                html+= '<td id =\'listel-'+i+'\' style=\'width:33%\'><div><img style=\'\' src=\''+getImage(i)+'\'></div></td>';
                if (i%3 == 2){
                	html+= '</tr><tr valign=\'top\'><td><p>'+turtles[key-2]['value']+'</p></td><td><p>'+turtles[key-1]['value']+'</p></td><td><p>'+turtles[key]['value']+'</p></td></tr>';
                }
                $('#lists').html(html);
                
                $('#listel-' + i).live('click', function() {
                	var index = $(this).attr('id').replace('listel-','');
                  	$('#listel-' + index+' img').attr('src','images/turtle.gif');
                    $.ajax({
                        url : url_controlbay+"plugin/magnify/turtle",
                        type : "POST",
                        headers : {
                            Authorization : token
                        },
                        data : {
                            turtle : turtles[index]['id']
                        },
                        success : function(data, textStatus, xhr) {
                            console.log(xhr.status+' '+textStatus);
                            $('#listel-' + index+' img').attr('src',getImage(index));
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            checkStatus(xhr.status);
                            console.log(xhr.status+' '+thrownError);
                            $('#listel-' + index+' img').attr('src',getImage(index));
                        }
                    });

                });
                i++;
            });
            if((i-1)%3 != 2 ){
            	var tot=i-1;
            	html+= '</tr><tr>';
            	while((i-1)%3 == 0){
            		html+='<td><p>'+turtles[tot-(i-1)%3]['value']+'</p></td>';
            		i--;
            	}
            	html+= '</tr>';
            	$('#lists').html(html);
            }
            $.mobile.changePage("#main", {
                reverse : false,
                changeHash : false
            });
        },
        error : function(xhr, ajaxOptions, thrownError) {
            checkStatus(xhr.status);
            console.log(xhr.status+' '+thrownError);
        }
    });
}

function authenticate() {
    var pincode = $('#pincode').val();
    if (pincode != 0) {

        $.ajax({
            url : url_controlbay+"auth/mobile",
            type : "POST",
            data : {
                pin : pincode
            },
            success : function(data, textStatus, xhr) {
                console.log(xhr.status+' '+textStatus);
                token = data;
                try {
                    localStorage.setItem("token", token);
                } catch (e) {}
                getTurtles();
            },
            error : function(xhr, ajaxOptions, thrownError) {
                checkStatus(xhr.status);
                console.log(xhr.status+' '+thrownError);
            }
        });
    } else {
        console.log('pincode invalid');
    }
}