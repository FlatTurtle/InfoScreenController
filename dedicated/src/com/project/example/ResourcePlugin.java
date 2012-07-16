package com.project.example;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Environment;
import android.util.Log;

import com.phonegap.api.Plugin;

public class ResourcePlugin extends Plugin {

	@Override
	public PluginResult execute(String action, JSONArray data, String callback) {
		// TODO Auto-generated method stub
		Log.d("resourcePlugin", "Plugin Called");
		PluginResult result = null;
		if (true) {
			File sdcard = Environment.getExternalStorageDirectory();

			//Get the text file
			File file = new File(sdcard,"conf.json");

			//Read text from file
			StringBuilder text = new StringBuilder();

			try {
			    BufferedReader br = new BufferedReader(new FileReader(file));
			    String line;

			    while ((line = br.readLine()) != null) {
			        text.append(line);
			    }
			    result = new PluginResult(Status.OK,new JSONObject(text.toString()));
			}
			catch (IOException e) {
				//result = new PluginResult(Status.OK, new JSONObject());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			result = new PluginResult(Status.INVALID_ACTION);
			Log.d("DirectoryListPlugin", "Invalid action : " + action
					+ " passed");
		}
		return result;
	}

}
