package com.heartyoh.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;

@Controller
public class LifeLogService extends EntityService {
	private static final Logger logger = LoggerFactory.getLogger(LifeLogService.class);

	@Override
	protected String getEntityName() {
		return "LifeLog";
	}

	//server side filtering
	@Override
	protected boolean useFilter() {
		return true;
	}

	
	@Override
	protected String getIdValue(Map<String, Object> map) {
//		return (String) map.get("id");
		return null;
	}

	// 사용자가 수정하면 안되는 필드 처리. 나머지는 OnSave에서 처리.
	@Override
	protected void onCreate(Entity entity, Map<String, Object> map, DatastoreService datastore) throws Exception {
//		entity.setProperty("id", map.get("id"));

		super.onCreate(entity, map, datastore);
	}

	@Override
	protected void postMultipart(Entity entity, Map<String, Object> map, MultipartHttpServletRequest request)
			throws IOException {
		entity.setProperty("image_clip", saveFile((MultipartFile) map.get("image_file")));

		super.postMultipart(entity, map, request);
	}

	@Override
	protected void onSave(Entity entity, Map<String, Object> map, DatastoreService datastore) throws Exception {
		//entity.setProperty("user_id", map.get("user_id"));
		entity.setProperty("from", map.get("from"));
		entity.setProperty("to", map.get("to"));
		entity.setProperty("category", map.get("category"));
		entity.setProperty("contents", map.get("contents"));
		
		super.onSave(entity, map, datastore);
	}

	@RequestMapping(value = "/lifelog/import", method = RequestMethod.POST)
	public @ResponseBody
	String imports(MultipartHttpServletRequest request, HttpServletResponse response) throws Exception {
		return super.imports(request, response);
	}

	@RequestMapping(value = "/lifelog/save", method = RequestMethod.POST)
	public @ResponseBody
	String save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return super.save(request, response);
	}

	@RequestMapping(value = "/lifelog/delete", method = RequestMethod.POST)
	public @ResponseBody
	String delete(HttpServletRequest request, HttpServletResponse response) {
		return super.delete(request, response);
	}

	@RequestMapping(value = "/lifelog", method = RequestMethod.GET)
	public @ResponseBody
	List<Map<String, Object>> retrieve(HttpServletRequest request, HttpServletResponse response) {
		return super.retrieve(request, response);
	}

}
