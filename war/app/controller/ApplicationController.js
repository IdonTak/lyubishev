Ext.define('Heartyoh.controller.ApplicationController', {
	extend : 'Ext.app.Controller',

	stores : [ 'CompanyStore', 'UserStore', 'CodeGroupStore', 'CodeStore', 'VehicleStore', 'TimeZoneStore', 'FileStore' ],
	models : [ 'Code', 'File' ],
	views : [ 'viewport.Center', 'viewport.North', 'viewport.West', 'viewport.East', 'Brand', 'MainMenu', 'SideMenu', 'common.CodeCombo', 'form.TimeZoneCombo',
			'form.SearchField', 'common.EntityFormButtons', 'common.ProgressColumn', 'file.FileManager', 'management.Company', 'management.User',
			'management.Code', 'management.Vehicle' ],

	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportRendered
			}
		});
	},

	onViewportRendered : function() {
	}
});
