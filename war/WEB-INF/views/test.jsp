<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory" %>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<title>Heartyoh</title>

		<link rel="stylesheet" href="resources/css/ext-heartyoh.css"></link>
		<link rel="stylesheet" href="resources/css/heartyoh.css"></link>
		
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&region=KR&language=KO"></script>
		<script src="lib/uploader/fileuploader.js"></script>
		<script src="lib/label/label.js"></script>
		<script src="lib/locale/locale.js"></script>
		
		<script>
		var login = {
			username : '<sec:authentication property="principal.nickname"/>',
			company : '<sec:authentication property="principal.company"/>',
			locale : 'ko'
		};
		
		var System = System || {};
		System.props = {
			lattitude : 37.55,
			longitude : 126.97
		};

		InitLocale(this, login.locale);
		</script>
		
		<script src="ext-all-dev.js"></script>

		<script src="app/application.js"></script>

	</head>
	<body>
	</body>
	<body>
	</body>
</html>
