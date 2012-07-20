package com.project.example;

import java.lang.Thread.UncaughtExceptionHandler;

import org.apache.cordova.DroidGap;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import com.flatturtle.R;

public class MainActivity extends DroidGap {
    public static Activity act;
    private String password;
    
    /*
     * (non-Javadoc)
     * @see org.apache.cordova.DroidGap#onCreate(android.os.Bundle)
     * startup of application
     */

    @Override
    public void onCreate(Bundle savedInstanceState) {
        act = this;
        super.onCreate(savedInstanceState);
        
        //get password from android cache
        SharedPreferences settings = getPreferences(2);
	    password = settings.getString("password",getResources().getString(R.string.password));
	    
	    //force fullscreen
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        super.loadUrl(getResources().getString(R.string.url_InfoScreenController));
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
                        | WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
        
        
        /*
         * override the default exception handling
         * This ensures the app restarts when it has crashed.
         */
        final PendingIntent intent = PendingIntent.getActivity(this
                .getApplication().getBaseContext(), 0, new Intent(getIntent()),
                getIntent().getFlags());
        Thread.setDefaultUncaughtExceptionHandler(new UncaughtExceptionHandler() {

            public void uncaughtException(Thread thread, Throwable ex) {
                // TODO Auto-generated method stub
                AlarmManager mgr = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
                mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 2000,
                        intent);
                System.exit(2);
            }
        });
    }
    
    /*
     * (non-Javadoc)
     * @see android.app.Activity#onKeyDown(int, android.view.KeyEvent)
     * override the back button, home button and menu button
     * Only back button overriding works for the moment
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d("KEYCODE", keyCode + "");
        if ((keyCode == KeyEvent.KEYCODE_HOME)) {
            System.out.println("KEYCODE_HOME");
            Log.d("HOME", "HOME");
            return true;
        }
        if ((keyCode == KeyEvent.KEYCODE_BACK)) {
            System.out.println("KEYCODE_BACK");
            Log.d("BACK", "BACK");
            
            /*
             * build dialog that prevents the user from leaving the turtlescreen without providing a password
             */
            AlertDialog.Builder alert = new AlertDialog.Builder(this);

            alert.setTitle("Give password");
            alert.setMessage("password:");

            // Set an EditText view to get user input
            final EditText input = new EditText(this);
            alert.setView(input);
            SharedPreferences settings = getPreferences(2);
    	    password = settings.getString("password",getResources().getString(R.string.password));
            alert.setPositiveButton("Ok",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog,
                                int whichButton) {
                            Editable value = input.getText();
                            if(value.toString().compareTo(password) == 0){
                            	loadUrl(getResources().getString(R.string.url_InfoScreenController)+"#admin");
                            }
                        }
                    });

            alert.setNegativeButton("Cancel",
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog,
                                int whichButton) {
                            // Canceled.
                        }
                    });

            alert.show();
            return true;
        }
        if ((keyCode == KeyEvent.KEYCODE_MENU)) {
            System.out.println("KEYCODE_MENU");
            Log.d("MENU", "MENU");
            return true;
        }
        return false;
    }

}
