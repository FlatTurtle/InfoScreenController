package com.project.example;


import org.apache.cordova.DroidGap;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

/**
 * WebIntent is a PhoneGap plugin that bridges Android intents and web
 * applications:
 * 
 * 1. web apps can spawn intents that call native Android applications. 2.
 * (after setting up correct intent filters for PhoneGap applications), Android
 * intents can be handled by PhoneGap web applications.
 * 
 * @author boris@borismus.com
 * 
 */
public class ChangePass extends Plugin {

	/**
	 * Executes the request and returns PluginResult.
	 * 
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArray of arguments for the plugin.
	 * @param callbackId
	 *            The callback id used when calling back into JavaScript.
	 * @return A PluginResult object with a status and message.
	 */
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		if (action.equals("change")) {
			try {
				Log.e("passValue",args.get(0).toString());
				SharedPreferences settings = ((DroidGap) this.ctx).getPreferences(2);
			    SharedPreferences.Editor editor = settings.edit();
			    editor.putString("password", args.get(0).toString());
			    editor.commit();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new PluginResult(PluginResult.Status.OK);
		}
		else if(action.equals("startSettings")){
			Intent myintent= new Intent(android.provider.Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS);
			((DroidGap) this.ctx).startActivity(myintent);
			return new PluginResult(PluginResult.Status.OK);
		}
		return new PluginResult(PluginResult.Status.INVALID_ACTION);
	}
}