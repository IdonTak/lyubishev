package com.heartyoh.service;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.heartyoh.security.AppRole;

@Controller
public class UserService extends EntityService {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	@Override
	protected String getEntityName() {
		return "CustomUser";
	}

	@Override
	protected String getIdValue(Map<String, Object> map) {
		return (String) map.get("email");
	}

	@Override
	protected void onCreate(Entity entity, Map<String, Object> map, DatastoreService datastore) throws Exception {
		super.onCreate(entity, map, datastore);
	}

	@Override
	protected void onSave(Entity entity, Map<String, Object> map, DatastoreService datastore) throws Exception {
		String email = (String) map.get("email");
		String nickname = (String) map.get("nickname");
		String forename = (String) map.get("forename");
		String surname = (String) map.get("surname");
		String company = (String) map.get("company");
		String admin = (String) map.get("admin");
		String enabled = (String) map.get("enabled");

		Set<AppRole> roles = EnumSet.of(AppRole.USER);

		if (admin != null && (admin.equals("true") || admin.equals("on"))) {
			roles.add(AppRole.ADMIN);
		}

		if (email != null)
			entity.setProperty("email", email);
		if (nickname != null)
			entity.setProperty("nickname", nickname);
		if (forename != null)
			entity.setProperty("forename", forename);
		if (surname != null)
			entity.setProperty("surname", surname);
		if (company != null)
			entity.setProperty("company", company);
		if (enabled != null)
			entity.setUnindexedProperty("enabled", booleanProperty(map, "enabled"));
		if (admin != null)
			entity.setUnindexedProperty("admin", booleanProperty(map, "admin"));

		long binaryAuthorities = 0;

		for (AppRole r : roles) {
			binaryAuthorities |= 1 << r.getBit();
		}

		entity.setUnindexedProperty("authorities", binaryAuthorities);

		super.onSave(entity, map, datastore);
	}

	@RequestMapping(value = "/user/save", method = RequestMethod.POST)
	public @ResponseBody
	String save(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return super.save(request, response);
	}

	@RequestMapping(value = "/user/delete", method = RequestMethod.POST)
	public @ResponseBody
	String delete(HttpServletRequest request, HttpServletResponse response) {
		return super.delete(request, response);
	}

	@RequestMapping(value = "/user", method = RequestMethod.GET)
	public @ResponseBody
	List<Map<String, Object>> retrieve(HttpServletRequest request, HttpServletResponse response) {
		return super.retrieve(request, response);
	}

}
