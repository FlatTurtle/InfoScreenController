//the token will be verified with every request so the screen_id or hostname will be known not needed here
var token;
var turtles;
$(document).bind("mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
});

function checkStatus(status){
    if(status === 403){
        $.mobile.changePage("#authentication", {
            reverse : false,
            changeHash : false
        });
        console.log('status message: '+status);
    }
    else{
        console.log('status message: '+status);
    }
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
        //alert("still at school")
        return 'images/nmbs.png';
    case "map":
        //alert("still young")
        return 'images/nmbs.png';
    case "delijn":
        //alert("start lying")
        return 'images/nmbs.png';
    case "4":
        //alert("start saving")
        return 'images/nmbs.png';
    default:
        return 'images/nmbs.png';
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
            console.log(response);
            turtles = response;
            $('#lists').html('');
            $.each(response, function(key) {
                if(i%3 == 0) $("#lists").append('<div class=\'ui-block-a\' id =\'listel-'+i+'\'><div style=\'height:100px\' ><img style=\'height:90%\' src=\''+getImage(i)+'\'></img></div>'+response[key].module+' '+response[key]['value']+'</div>');
                else if(i%3 == 1) $("#lists").append('<div class=\'ui-block-b\' id =\'listel-'+i+'\'><div style=\'height:100px\' ><img style=\'height:90%\' src=\''+getImage(i)+'\'></img></div>'+response[key].module+' '+response[key]['value']+'</div>');
                else $("#lists").append('<div class=\'ui-block-c\' id =\'listel-'+i+'\'><div style=\'height:100px\' ><img style=\'height:90%\' src=\''+getImage(i)+'\'></img></div>'+response[key].module+' '+response[key]['value']+'</div>');
                $('#listel-' + i).live('click', function() {
                    var index = $(this).index();
                    $.ajax({
                        url : url_controlbay+"plugin/magnify/turtle",
                        type : "POST",
                        headers : {
                            Authorization : token
                        },
                        data : {
                            turtle : turtles[index]['id']
                        },
                        success : function(response) {
                            //console.log(response);
                            //token = response;
                            //getTurtles();
                            console.log(turtles[index].module);
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            checkStatus(xhr.status);
                        }
                    });

                });
                i++;
            });
            $.mobile.changePage("#main", {
                reverse : false,
                changeHash : false
            });
        },
        error : function(xhr, ajaxOptions, thrownError) {
            checkStatus(xhr.status);
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
            success : function(response) {
                console.log(response);
                token = response;
                try {
                    localStorage.setItem("token", token);
                } catch (e) {}
                getTurtles();
            },
            error : function(xhr, ajaxOptions, thrownError) {
                checkStatus(xhr.status);
            }
        });
    } else {
        console.log('pincode invalid');
    }
}