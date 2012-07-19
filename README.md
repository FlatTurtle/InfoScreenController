InfoScreenControlelr
=========
InfoscreenController is an Android application that makes use of [Phonegap](http://phonegap.com/) and [Jquery Mobile](http://jquerymobile.com/)
Writing started on the 2nd of July, 2012, during the [iRail summer of code](http://hello.irail.be/irail-summer-of-code/)[(#iSoc12)](https://twitter.com/search/realtime/iSoc12).

* [Glenn Bostoen](http://twitter.com/glennbostoen)

This application is designed to provide a secure way to communicate with the [controlbay](https://github.com/FlatTurtle/ControlBay)
and [infoscreen](https://github.com/FlatTurtle/InfoScreen).

InfoScreen assets/www can be placed on a remote server so it can be updated without recompiling the Android App. This can be configured in the res/values/config.xml where you can chane the url. There you can also change the password to exit the turtlescreen.

The url to the controlbay has to be defined in the config.js found in assets/www/js/
Dependencies
============

Android 2.1 needed

Copyright and license
=====================

© 2012 - Flatturtle
