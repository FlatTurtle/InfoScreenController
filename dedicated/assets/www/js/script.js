/*
 * User: gbostoen
 * This file contains all the main functionality
 */
var token;
var turtles;
$(document).bind("mobileinit", function() {
    $.mobile.allowCrossDomainPages = true;
});
/*
 * check error codes and react accordingly
 */
function checkStatus(xhr, ajaxOptions, thrownError) {
    console.log(xhr.status + ' ' + thrownError + ' ' + xhr.responseText);
    if (xhr.status == 403) {
        alert(xhr.responseText);
        $.mobile.changePage("#authentication", {
            reverse : false,
            changeHash : false
        });
    } else if (xhr.status == 400) {
        $('#lists').html('<a id=\'refresh\' data-role=\'button\'>refresh</a>');
        $('#refresh').live('click', getTurtles());
    }
}


function checkConnection() {
    $.ajax({
        url : 'http://wwww.google.be',
        success : function(data) {
            return true;
        },
        error : function(data) {
            return false;
        }
    });
}


/*
 * removes token so you can request a new token with a specified pincode
 */
function clearToken() {
    token = '';
}

/*
 * starts up a phonegap plugin so you can access the appsettings
 */
function appSettings() {
    window.plugins.Plugin.get("startSettings", "nothing", function(r){
        console.log(r);
            }, function(e){console.log(e)});
}

/*
 * change the password to exit the turtlescreen, phonegap plugin needed because it's accessed by android
 */
function changePass() {
    var newPass = $('#newPass').val();
    window.plugins.Plugin.get("change", newPass, function(r) {
        console.log(r);
        goto('#main');
    }, function(e){
        console.log(e);
    });
}

/*
 * change the current page
 */

function goto(url) {
    console.log(url);
    $.mobile.changePage(url, {
        reverse : false,
        changeHash : false
    });
}

/*
 * lookup the token in localstorage and initialize the turtles
 */
function initiate() {
    try {
        token = localStorage.getItem("token");
        getTurtles();
    } catch (e) {
    }
}

/*
 * mapping of the modules on images
 */
function getImage(i) {
    switch (turtles[i].module) {
        case "nmbs":
            return 'images/train_icon.svg';
        case "map":
            return 'images/map_icon.svg';
        case "delijn":
            return 'images/bus_icon.svg';
        case "twitter":
            return 'images/news_icon.svg';
        case "airport":
            return 'images/plane_icon.svg';
        case "mivbstib":
            return 'images/subway_icon.svg';
        default:
            return 'images/bike_icon.svg';
    }
}

/*
 * retrieve turtles
 */
function getTurtles() {
    $.ajax({
        url : url_controlbay + "api/turtles",
        type : "GET",
        dataType : 'json',
        headers : {
            Authorization : token
        },
        success : function(response) {
            // create a table with the given response
            var i = 0, html = '';
            turtles = response;
            $.each(response, function(key) {
                if (i % 3 === 0) {
                    html += '<tr>';
                }
                html += '<td id =\'listel-' + i + '\' style=\'width:33%\'><div><img style=\'\' src=\'' + getImage(i) + '\'></div></td>';
                if (i % 3 === 2) {
                    html += '</tr><tr valign=\'top\'><td><p>' + turtles[key-2]['value'] + '</p></td><td><p>' + turtles[key-1]['value'] + '</p></td><td><p>' + turtles[key]['value'] + '</p></td></tr>';
                }
                $('#lists').html(html);
                //define the action for a given turtle
                $('#listel-' + i).live('click', function() {
                    var index = $(this).attr('id').replace('listel-', '');
                    $('#listel-' + index + ' img').attr('src', $('#listel-' + index + ' img').attr('src').replace('.svg','_pressed.svg'));
                    $.ajax({
                        url : url_controlbay + "plugin/magnify/turtle",
                        type : "POST",
                        headers : {
                            Authorization : token
                        },
                        data : {
                            turtle : turtles[index]['id']
                        },
                        success : function(data, textStatus, xhr) {
                            console.log(xhr.status + ' ' + textStatus);
                            $('#listel-' + index + ' img').attr('src', getImage(index));
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            checkStatus(xhr, ajaxOptions, thrownError);
                            $('#listel-' + index + ' img').attr('src', getImage(index));
                        }
                    });

                });
                i++;
            });
            //complex construction just to get the labels of the last turtles
            if ((i - 1) % 3 !== 2) {
                var tot = i - 1;
                html += '</tr><tr>';
                while ((i - 1) % 3 == 0) {
                    html += '<td><p>' + turtles[tot-(i-1)%3]['value'] + '</p></td>';
                    i--;
                }
                html += '</tr>';
                $('#lists').html(html);
            }
            //myScroll = new iScroll('wrapper', { scrollbarClass: 'myScrollbar' });
            goto('#main');
        },
        error : function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + ' ' + thrownError + ' ' + xhr.responseText);
            if (xhr.status == 403) {
                $.mobile.changePage("#authentication", {
                    reverse : false,
                    changeHash : false
                });
            } else if (xhr.status == 400) {
                $('#lists').html('<a id=\'refresh\' data-role=\'button\'>refresh</a>');
                $('#refresh').live('click', getTurtles());
            }
        }
    });
}

/*
 * verify if the given pincode is valid
 */

function authenticate() {
    var pincode = $('#pincode').val();
    //no dedicated key found on external storage
    if (pincode !== 0 && !localkey) {
        console.log('pin given but no localkey');
        $.ajax({
            url : url_controlbay + "auth/mobile",
            type : "POST",
            data : {
                pin : pincode
            },
            success : function(data, textStatus, xhr) {
                console.log(xhr.status + ' ' + textStatus);
                token = data;
                try {
                    //store the token for later use
                    localStorage.setItem("token", token);
                } catch (e) {
                }
                getTurtles();
            },
            error : function(xhr, ajaxOptions, thrownError) {
                checkStatus(xhr, ajaxOptions, thrownError);
            }
        });
    }
    //localkey is the dedicated key stored on the external storage of the phone.
    //gives special permissions
    else if (pincode !== 0 && localkey) {
        console.log('pin given and a localkey');
        console.log('localkey '+localkey);
        $.ajax({
            url : url_controlbay + "auth/mobile",
            type : "POST",
            data : {
                dedicated_key : localkey,
                pin : pincode
            },
            success : function(data, textStatus, xhr) {
                console.log(xhr.status + ' ' + textStatus);
                token = data;
                console.log('data authentication response: '+ data);
                try {
                    localStorage.setItem("token", token);
                } catch (e) {
                }
                getTurtles();
            },
            error :function (xhr, ajaxOptions, thrownError){
                checkStatus(xhr, ajaxOptions, thrownError);
            }
        });
    } else {
        console.log('pincode invalid');
    }
}

/*
 * measures idle time and triggers event (eg. reloads the site) when the phone has been idle for quiet some time.
 *
 */
idleTimer = null;
idleState = false;
idleWait = 60000;

(function($) {

    $(document).ready(function() {

        $('*').bind('mousemove keydown scroll', function() {

            clearTimeout(idleTimer);

            if (idleState === true) {

                // Reactivated event
                console.log('welcome back');
            }

            idleState = false;

            idleTimer = setTimeout(function() {

                // Idle Event
                console.log('you\'ve been idle for quit some time');
                if (checkConnection()) location.reload(true);

                idleState = true;
            }, idleWait);
        });

        $('body').trigger('mousemove');

    });
})(jQuery)

