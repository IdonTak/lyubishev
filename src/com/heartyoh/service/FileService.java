package com.heartyoh.service;

import java.util.ArrayList;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

/**
 * Handles requests for the application home page.
 */
@Controller
public class FileService {

	private static final Logger logger = LoggerFactory.getLogger(FileService.class);
	private DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();
	
	@RequestMapping(value = "/data/files.json", method = RequestMethod.GET)
	public @ResponseBody ArrayList<Map<String, Object>> getFiles() {
		Query query = new Query("__BlobInfo__");
		
//		q.addFilter("lastName", Query.FilterOperator.EQUAL, lastNameParam);
//		q.addFilter("height", Query.FilterOperator.LESS_THAN, maxHeightParam);
		
		PreparedQuery pq = datastoreService.prepare(query);

		ArrayList<Map<String, Object>> entities = new ArrayList<Map<String, Object>>();
				
		for (Entity result : pq.asIterable()) {
			entities.add(result.getProperties());
		}
		
		return entities;
	}
	
}