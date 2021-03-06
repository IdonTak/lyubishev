Ext.define('Heartyoh.view.MainMenu', {
	extend : 'Ext.toolbar.Toolbar',
	cls : 'appMenu',
	alias : 'widget.main_menu',

	defaults : {
		handler : function(button) {
			var content = Ext.getCmp('content');
			var closables = content.query('[closable=true]');
			for ( var i = 0; i < closables.length; i++) {
				content.remove(closables[i]);
			}

			var first = null;
			for (i = 0; i < button.submenus.length; i++) {
				button.submenus[i]['listeners'] = {
					activate : function(item) {
						var menutab = Ext.getCmp('menutab');
						var tab = menutab.getComponent(item.itemId);

						menutab.setActiveTab(tab);
					}
				};
				var item = content.add(button.submenus[i]);
				first = first || item;
			}

			if (first)
				Heartyoh.doMenu(first.itemId);
		}
	},

	items : [ {
		text : 'Dashboard',
		submenus : [ {
			title : 'File',
			xtype : 'filemanager',
			itemId : 'filemanager',
			closable : true
		} ]
	}, {
		text : 'Company',
		submenus : [ {
			title : T('company'),
			xtype : 'management_company',
			itemId : 'company',
			closable : true
		}, {
			title : 'Users',
			xtype : 'management_user',
			itemId : 'user',
			closable : true
		}, {
			title : 'Code Mgmt.',
			xtype : 'management_code',
			itemId : 'code',
			closable : true
		} ]
	}, {
		text : 'Vehicle',
		submenus : [ {
			title : T('vehicle'),
			xtype : 'management_vehicle',
			itemId : 'vehicle',
			closable : true
		} ]
	} ]
});