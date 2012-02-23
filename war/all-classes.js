/*
Copyright(c) 2011 Company Name
*/
Ext.define('Heartyoh.mixin.Msg', function(){
	var msgCt;

	function createBox(t, s) {
		return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
	}
	
	function showMessage(t, s) {
		if (!msgCt) {
			msgCt = Ext.core.DomHelper.insertFirst(document.body, {
				id : 'msg-div'
			}, true);
		}
		var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		var m = Ext.core.DomHelper.append(msgCt, createBox(t, s), true);
		m.hide();
		m.slideIn('t').ghost("t", {
			delay : 1000,
			remove : true
		});
	}

	return {
		msg : showMessage
	};
}());

Ext.define('Heartyoh.mixin.User', function() {
	var current_user = login.username;

	function currentUser(user) {
		if (user !== undefined)
			current_user = user;
		return current_user;
	}

	return {
		login : {
			id : currentUser,
			name : currentUser
		}
	};
}());
Ext.define('Heartyoh.mixin.Mixin', {
	mixin : function(clazz, config) {
		try {
			switch (typeof (clazz)) {
			case 'string':
				Ext.apply(Ignite, Ext.create(clazz, config));
				return;
			case 'object':
				Ext.apply(Ignite, clazz);
			}
		} catch (e) {
			console.log(e.stack);
		}
	}
});
Ext.define('Heartyoh.mixin.UI', {
	addSystemMenu : function(view, config) {
		try {
			var system_menu = Ext.getCmp('system_menu');
			var menu = Ext.create(view, config);

			system_menu.insert(0, menu);

			var width = 6; // TODO should be more systemic.

			system_menu.items.each(function(el) {
				width += el.getWidth();
			});

			system_menu.setSize(width, system_menu.getHeight());
		} catch (e) {
			// console.log(e);
		}
	},

	addContentView : function(view) {
		this.showBusy();
		var comp;

		if (typeof (view) === 'string') {
			comp = Ext.create(view, {
				closable : true
			});
		} else {
			comp = view;
		}
		
		Ext.getCmp('content').add(comp).show();
		
		this.clearStatus();
	},

	getMenu : function(menu) {
		return Ext.getCmp('content').getComponent(menu);
	},
	
	doMenu : function(menu) {
		var content = Ext.getCmp('content');
		content.getLayout().setActiveItem(content.getComponent(menu));
	}
});

Ext.define('Heartyoh.mixin.State', function() {
	return {
		show_running_vehicle : true,
		show_idle_vehicle : true,
		show_incident_vehicle : true
	};
}());
Ext.define('Heartyoh.mixin.SubItem', function() {
	Ext.Container.implement({
		sub : function(id) {
			if(!this.subitems)
				this.subitems = {};
			if(!this.subitems[id])
				this.subitems[id] = this.down('[itemId=' + id + ']');
			return this.subitems[id];
		}
	});

	return {
	};
}());
Ext.define('Heartyoh.mixin.Import', function() {
	function importFile() {
		var contentContainer = Ext.getCmp('content');
		var view = contentContainer.getLayout().getActiveItem();
		if (view.importUrl) {
			Ext.create('Heartyoh.view.common.ImportPopup', {
				importUrl : view.importUrl,
				client : view,
				title : 'Import'
			}).show();
		}
	}
	
	function uploadIncidentLog() {
		Ext.create('Heartyoh.view.common.ImportPopup', {
			importUrl : 'incident/upload_log',
			title : 'Upload Incident Log'
		}).show();
	}

	function uploadIncidentVideo() {
		Ext.create('Heartyoh.view.common.ImportPopup', {
			importUrl : 'incident/upload_video',
			title : 'Upload Incident Video'
		}).show();
	}

	return {
		importData : importFile,
		uploadIncidentLog : uploadIncidentLog,
		uploadIncidentVideo : uploadIncidentVideo
	};
}());
Ext.define('Heartyoh.view.Viewport', {
	extend : 'Ext.container.Viewport',

	layout : 'border',
	cls :'wrap',

	defaults : {
		split : false,
		collapsible : false
	},

	items : [ {
		xtype : 'viewport.north',
		region : 'north',
		cls : 'header',
		height : 62
	}, {
		xtype : 'viewport.west',
		region : 'west',
		cls : 'tool',
		width : 50
	}, {
		xtype : 'viewport.east',
		region : 'east',
		cls : 'summaryBoard',
		width : 200
	}, {
		xtype : 'viewport.center',
		region : 'center'
	} ]
});

Ext.define('Heartyoh.model.Code', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'code', type: 'string'},
        {name: 'desc', type: 'number'}
    ]
});

Ext.define('Heartyoh.model.File', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'filename', type: 'string'},
        {name: 'creation', type: 'number'},
        {name: 'md5_hash', type: 'string'},
        {name: 'content_type', type: 'string'},
        {name: 'size', type: 'string'}
    ]
});

Ext.define('Heartyoh.view.viewport.Center', {

	extend : 'Ext.panel.Panel',

	id : 'content',

	alias : 'widget.viewport.center',

	layout : 'card',

	listeners : {
		add : function(panel, item) {
			if (panel !== this)
				return;

			var menutab = Ext.getCmp('menutab');
			menutab.add({
				text : item.title,
				itemId : item.itemId,
				tooltip : item.title,
				handler : function(tab) {
					var content = Ext.getCmp('content');
					var comp = content.getComponent(tab.itemId);
					content.getLayout().setActiveItem(comp);
				},
				closable : false
			}).setCard(item);
		},
		remove : function(panel, item) {
			if (panel !== this)
				return;

			var menutab = Ext.getCmp('menutab');
			menutab.remove(item.itemId);
		}
	},

	defaults : {
		listeners : {
			activate : function(item) {
				var menutab = Ext.getCmp('menutab');
				var tab = menutab.getComponent(item.itemId);
				menutab.setActiveTab(tab);
			}
		}
	},

	items : [ ]
});
Ext.define('Heartyoh.view.viewport.North', {
	extend : 'Ext.Container',

	alias : 'widget.viewport.north',

	layout : {
		type : 'hbox',
		align : 'stretch'
	},

	items : [ {
		xtype : 'brand',
		width : 135
	}, {
		xtype : 'container',
		flex : 1,
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'main_menu',
				flex : 1
			}, {
				xtype : 'side_menu',
				width : 180
			} ]
		}, {
			xtype : 'tabbar',
			id : 'menutab',
			height : 23
		} ]
	} ]
});

Ext.define('Heartyoh.view.viewport.West', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.viewport.west',
	cls : 'tool',

	layout : {
		type : 'vbox'
	},
	items : [ {
		xtype : 'button',
		cls : 'btnAdd',
		html : 'add'
	}, {
		xtype : 'button',
		cls : 'btnRemove',
		html : 'remove'
	}, {
		xtype : 'button',
		cls : 'btnRefresh',
		html : 'refresh'
	}, {
		xtype : 'button',
		cls : 'btnImport',
		html : 'import',
		handler : function() {
			Heartyoh.importData();
		}
	}, {
		xtype : 'button',
		cls : 'btnEvent',
		html : 'incident log',
		handler : function() {
			Heartyoh.uploadIncidentLog();
		}
	}, {
		xtype : 'button',
		cls : 'btnEvent',
		html : 'incident video',
		handler : function() {
			Heartyoh.uploadIncidentVideo();
		}
	}, {
		xtype : 'button',
		cls : 'btnSave',
		html : 'save'
	}, {
		xtype : 'button',
		cls : 'btnExport',
		html : 'export',
		
	} ]
});

Ext.define('Heartyoh.view.viewport.East', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.viewport.east',
	
	id : 'east',
	
	cls : 'summaryBoard',
	
	width : 200,

	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		this.callParent();
		
		var self = this;
		
		setInterval(function() {
			self.sub('time').update(Ext.Date.format(new Date(), 'D Y-m-d H:i:s'));
		}, 1000);
		
		this.on('afterrender', function() {
		});
	},
	
	items : [ {
		xtype : 'searchfield',
		cls : 'searchField',
		fieldLabel : 'Search',
		labelWidth : 50,
		labelSeparator : '',
		itemId : 'search'
	}, {
		xtype : 'component',
		cls : 'time',
		itemId : 'time',
		html : Ext.Date.format(new Date(), 'D Y-m-d H:i:s')
	} ]
});
Ext.define('Heartyoh.view.Brand', {
	extend : 'Ext.panel.Panel',
	
	alias : 'widget.brand',
	
	html : '<a></a>'
});
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
Ext.define('Heartyoh.view.SideMenu', {
	extend : 'Ext.toolbar.Toolbar',

	alias : 'widget.side_menu',
	cls : 'sideMenu',

	items : [ {
		type : 'help',
		text : login.username,
		handler : function() {
		}
	}, {
		itemId : 'home',
		type : 'home',
		cls : 'btnHome',
		handler : function() {
		}
	}, {
		itemId : 'report',
		type : 'report',
		cls : 'btnReport',
		handler : function() {
		}
	}, {
		itemId : 'setting',
		type : 'setting',
		cls : 'btnSetting',
		handler : function() {
		}
	}, {
		itemId : 'logout',
		type : 'logout',
		cls : 'btnLogout',
		handler : function() {
			Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do that?', function(confirm) {
				if (confirm === 'yes') {
					document.location.href = '/logout.htm';
				}

			});
		}
	} ]
});
Ext.define('Heartyoh.view.common.CodeCombo', {
	extend : 'Ext.form.field.ComboBox',

	alias : 'widget.codecombo',
	
	queryMode : 'local',
	
	displayField: 'code',
	
	matchFieldWidth : false,

    typeAhead: true,
    
    emptyText : 'Alt+Q',
    
	group : 'V-Maker',
	
    initComponent : function() {
    	this.store = Ext.getStore('CodeStore').substore(this.group);
    	this.emptyText = this.fieldLabel;

    	this.callParent();
    },
	
	listConfig : {
		getInnerTpl : function() {
			return '<div class="codelist"><span class="code">{code}</span> ({desc})</div>'; 
		}, 
		minWidth : 200
	}
});

Ext.define('Heartyoh.view.form.TimeZoneCombo', {
	extend : 'Ext.form.field.ComboBox',
	
	alias : 'widget.tzcombo',
	
	fieldLabel: 'Choose TimeZone',
	
    store: 'TimeZoneStore',
    
    queryMode: 'local',
    
    displayField: 'display',
    
    valueField: 'value'
});
Ext.define('Heartyoh.view.form.SearchField', {
	extend : 'Ext.form.field.ComboBox',
	
	alias : 'widget.searchfield',
	
	queryMode : 'local',
	
	displayField : 'id',
	
	matchFieldWidth : false,
	
	typeAhead: true,
	
	emptyText : 'Alt+Q',
	
	store : 'VehicleStore',
	
	initComponent : function() {
		
		this.callParent();
		
		new Ext.util.KeyMap(document, {
			key : 'q',
			alt : true,
			fn : this.focus,
			scope : this
		});
	},
	
	listConfig : {
		loadingText : 'Searching...',
		emptyText : 'No matching vehicles found.',
		getInnerTpl : function() {
			return '<div class="appSearchItem"><span class="id">{id}</span> <span class="registration_number">{registration_number}</span></div>';
		},
		minWidth : 190
	},
	
	listeners : {
		'select' : function(combo, records, eOpts) {
			var store = Ext.getStore('VehicleFilteredStore');
			
			store.clearFilter();
			
			store.filter([ {
				property : 'id',
				value : records[0].get('id')
			} ]);
		}
	}
	
});

Ext.define('Heartyoh.view.common.EntityFormButtons', {
	extend : 'Ext.toolbar.Toolbar',
	
	alias : 'widget.entity_form_buttons',
	
	dock : 'bottom',
	
	layout : {
		align : 'middle',
		type : 'hbox'
	},
	
	items : [ {
		xtype : 'tbfill'
	}, {
		text : 'Save',
		itemId : 'save'
	}, {
		text : 'Delete',
		itemId : 'delete'
	}, {
		text : 'Reset',
		itemId : 'reset'
	} ],
	
	initComponent : function() {
		this.callParent();
		
		var self = this;
		
		this.down('#save').on('click', function() {
			var client = self.up('[entityUrl]');
			var url = client.entityUrl;
				
			var form = client.sub('form').getForm();

			if (form.isValid()) {
				form.submit({
					url : url + '/save',
					success : function(form, action) {
						var store = client.sub('grid').store;
						store.load(function() {
							form.loadRecord(store.findRecord('key', action.result.key));
						});
					},
					failure : function(form, action) {
						Heartyoh.msg('Failed', action.result.msg);
					}
				});
			}
		});

		this.down('#delete').on('click', function() {
			var client = self.up('[entityUrl]');
			var url = client.entityUrl;
				
			var form = client.sub('form').getForm();

			if (form.isValid()) {
				form.submit({
					url : url + '/delete',
					success : function(form, action) {
						client.sub('grid').store.load();
						form.reset();
					},
					failure : function(form, action) {
						Heartyoh.msg('Failed', action.result.msg);
					}
				});
			}
		});

		this.down('#reset').on('click', function() {
			var client = self.up('[entityUrl]');

			client.sub('form').getForm().reset();
		});

	}
});
/**
 * @class Ext.ux.grid.column.Progress
 * @extends Ext.grid.Column
 * <p>
 * A Grid column type which renders a numeric value as a progress bar.
 * </p>
 * <p>
 * <b>Notes:</b><ul>
 * <li>Compatible with Ext 4.0</li>
 * </ul>
 * </p>
 * Example usage:
 * <pre><code>
    var grid = new Ext.grid.Panel({
        columns: [{
            dataIndex: 'progress'
            ,xtype: 'progresscolumn'
        },{
           ...
        ]}
        ...
    });
 * </code></pre>
 * <p>The column can be at any index in the columns array, and a grid can have any number of progress columns.</p>
 * @author Phil Crawford
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @version 0.1 (June 30, 2011)
 * @constructor
 * @param {Object} config 
 */
Ext.define('Heartyoh.view.common.ProgressColumn', {
    extend: 'Ext.grid.column.Column'
    ,alias: 'widget.progresscolumn'
    
    ,cls: 'x-progress-column'
    
    /**
     * @cfg {String} progressCls
     */
    ,progressCls: 'x-progress'
    /**
     * @cfg {String} progressText
     */
    ,progressText: '{0} %'
    
    /**
     * @private
     * @param {Object} config
     */
    ,constructor: function(config){
        var me = this
            ,cfg = Ext.apply({}, config)
            ,cls = me.progressCls;

        me.callParent([cfg]);

//      Renderer closure iterates through items creating an <img> element for each and tagging with an identifying 
//      class name x-action-col-{n}
        me.renderer = function(v, meta) {
            var text, newWidth;
            
            newWidth = Math.floor(v * me.getWidth(true)); //me = column
            
//          Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
            v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||v : v; //this = renderer scope
            text = Ext.String.format(me.progressText,Math.round(v*100));
            
            meta.tdCls += ' ' + cls + ' ' + cls + '-' + me.ui;
            v = '<div class="' + cls + '-text ' + cls + '-text-back">' +
                    '<div>' + text + '</div>' +
                '</div>' +
                '<div class="' + cls + '-bar" style="width: '+ newWidth + 'px;">' +
                    '<div class="' + cls + '-text">' +
                        '<div>' + text + '</div>' +
                    '</div>' +
                '</div>' 
            return v;
        };    
        
    }//eof constructor
    

    /**
     * @private
     */
    ,destroy: function() {
        delete this.renderer;
        return this.callParent(arguments);
    }//eof destroy
    
}); //eo extend

//end of file
Ext.define('Heartyoh.view.file.FileManager', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.filemanager',
	
	title : 'FileManager',

	layout : {
		type : 'vbox',
		align : 'stretch',
		pack : 'start'
	},

	initComponent : function() {
		this.callParent();

		this.add(Ext.create('Heartyoh.view.file.FileViewer', {
			flex : 1
		}));
		this.add(Ext.create('Heartyoh.view.file.FileUploader', {
			flex : 1
		}));
		this.add(Ext.create('Heartyoh.view.file.FileList', {
			flex : 2
		}));
	}
});
Ext.define('Heartyoh.view.management.Company', {
	extend : 'Ext.container.Container',

	alias : 'widget.management_company',

	title : 'Company',

	entityUrl : 'company',
	
	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	items : {
		html : '<div class="listTitle">Company List</div>'
	},

	initComponent : function() {
		var self = this;

		this.callParent(arguments);

		this.add(this.buildList(this));
		this.add(this.buildForm(this));

		this.sub('grid').on('itemclick', function(grid, record) {
			self.sub('form').loadRecord(record);
		});

		this.sub('grid').on('render', function(grid) {
			grid.store.load();
		});

		this.sub('id_filter').on('change', function(field, value) {
			self.search(self);
		});

		this.sub('name_filter').on('change', function(field, value) {
			self.search(self);
		});

		this.down('#search_reset').on('click', function() {
			self.sub('id_filter').setValue('');
			self.sub('name_filter').setValue('');
		});

		this.down('#search').on('click', function() {
			self.sub('grid').store.load();
		});

	},

	search : function(self) {
		self.sub('grid').store.clearFilter();

		self.sub('grid').store.filter([ {
			property : 'id',
			value : self.sub('id_filter').getValue()
		}, {
			property : 'name',
			value : self.sub('name_filter').getValue()
		} ]);
	},
	
	buildList : function(main) {
		return {
			xtype : 'gridpanel',
			itemId : 'grid',
			store : 'CompanyStore',
			flex : 3,
			columns : [ {
				dataIndex : 'key',
				text : 'Key',
				hidden : true
			}, {
				dataIndex : 'id',
				text : 'ID'
			}, {
				dataIndex : 'name',
				text : 'Name'
			}, {
				dataIndex : 'desc',
				text : 'Description'
			}, {
				dataIndex : 'timezone',
				text : 'TimeZone'
			}, {
				dataIndex : 'created_at',
				text : 'Created At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			}, {
				dataIndex : 'updated_at',
				text : 'Updated At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			} ],
			viewConfig : {

			},
			onReset : function(grid) {
				grid.down('textfield[name=id_filter]').setValue('');
				grid.down('textfield[name=name_filter]').setValue('');
			},
			tbar : [ 'ID', {
				xtype : 'textfield',
				name : 'id_filter',
				itemId : 'id_filter',
				hideLabel : true,
				width : 200
			}, 'NAME', {
				xtype : 'textfield',
				name : 'name_filter',
				itemId : 'name_filter',
				hideLabel : true,
				width : 200
			}, {
				text : 'Search',
				itemId : 'search'
			}, {
				text : 'reset',
				itemId : 'search_reset'
			} ]
		}
	},

	buildForm : function(main) {
		return {
			xtype : 'form',
			itemId : 'form',
			autoScroll : true,
			bodyPadding : 10,
			cls : 'hIndexbar',
			title : 'Company Details',
			flex : 2,
			defaults : {
				xtype : 'textfield',
				anchor : '100%'
			},
			items : [ {
				name : 'key',
				fieldLabel : 'Key',
				hidden : true
			}, {
				name : 'id',
				fieldLabel : 'ID'
			}, {
				name : 'name',
				fieldLabel : 'Name'
			}, {
				name : 'desc',
				fieldLabel : 'Description'
			}, {
				xtype : 'tzcombo',
				name : 'timezone',
				fieldLabel : 'TimeZone'
			}, {
				xtype : 'datefield',
				name : 'updated_at',
				disabled : true,
				fieldLabel : 'Updated At',
				format : F('datetime')
			}, {
				xtype : 'datefield',
				name : 'created_at',
				disabled : true,
				fieldLabel : 'Created At',
				format : F('datetime')
			} ],
			dockedItems : [ {
				xtype : 'entity_form_buttons'
			} ]
		}
	}
});
Ext.define('Heartyoh.view.management.User', {
	extend : 'Ext.container.Container',

	alias : 'widget.management_user',

	title : 'User',
	
	entityUrl : 'user',

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	initComponent : function() {
		var self = this;
		
		this.items = [ {
			html : '<div class="listTitle">User List</div>'
		}, this.buildList(this), this.buildForm(this) ],

		this.callParent(arguments);
		
		this.sub('grid').on('itemclick', function(grid, record) {
			self.sub('form').loadRecord(record);
		});
		
		this.sub('grid').on('render', function(grid) {
			grid.store.load();
		});
		
		this.sub('email_filter').on('change', function(field, value) {
			self.search(self);
		});
		
		this.sub('name_filter').on('change', function(field, value) {
			self.search(self);
		});
		
		this.down('#search_reset').on('click', function() {
			self.sub('email_filter').setValue('');
			self.sub('name_filter').setValue('');
		});
		
		this.down('#search').on('click', function() {
			self.sub('grid').store.load();
		});
		
	},

	search : function(self) {
		self.sub('grid').store.clearFilter();

		self.sub('grid').store.filter([ {
			property : 'email',
			value : self.sub('email_filter').getValue()
		}, {
			property : 'surname',
			value : self.sub('name_filter').getValue()
		} ]);
	},
	
	buildList : function(main) {
		return {
			xtype : 'gridpanel',
			itemId : 'grid',
			store : 'UserStore',
			flex : 3,
			columns : [ {
				dataIndex : 'key',
				text : 'Key',
				hidden : true
			}, {
				dataIndex : 'email',
				text : 'email'
			}, {
				dataIndex : 'surname',
				text : 'Sur Name'
			}, {
				dataIndex : 'nickname',
				text : 'Nick Name'
			}, {
				dataIndex : 'forename',
				text : 'For Name'
			}, {
				dataIndex : 'enabled',
				text : 'Enabled'
			}, {
				dataIndex : 'admin',
				text : 'Admin'
			}, {
				dataIndex : 'company',
				text : 'Company'
			}, {
				dataIndex : 'created_at',
				text : 'Created At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			}, {
				dataIndex : 'updated_at',
				text : 'Updated At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			} ],
			viewConfig : {

			},
			tbar : [ 'e-mail', {
				xtype : 'textfield',
				itemId : 'email_filter',
				name : 'email_filter',
				hideLabel : true,
				width : 200
			}, 'NAME', {
				xtype : 'textfield',
				itemId : 'name_filter',
				name : 'name_filter',
				hideLabel : true,
				width : 200
			}, {
				xtype : 'button',
				itemId : 'search',
				text : 'Search',
				tooltip : 'Find User'
			}, {
				text : 'reset',
				itemId : 'search_reset'
			} ]
		}
	},

	buildForm : function(main) {
		return {
			xtype : 'form',
			itemId : 'form',
			bodyPadding : 10,
			cls : 'hIndexbar',
			title : 'User Details',
			flex : 2,
			autoScroll : true,
			items : [ {
				xtype : 'textfield',
				name : 'key',
				fieldLabel : 'Key',
				anchor : '100%',
				hidden : true
			}, {
				xtype : 'textfield',
				name : 'email',
				fieldLabel : 'e-mail',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				name : 'surname',
				fieldLabel : 'Sur Name',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				name : 'nickname',
				fieldLabel : 'Nick Name',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				name : 'forename',
				fieldLabel : 'Fore Name',
				anchor : '100%'
			}, {
				xtype : 'checkbox',
				name : 'enabled',
				fieldLabel : 'Enabled',
				anchor : '100%'
			}, {
				xtype : 'checkbox',
				name : 'admin',
				fieldLabel : 'Admin',
				anchor : '100%'
			}, {
				xtype : 'textfield',
				name : 'company',
				fieldLabel : 'Company',
				disable : true,
				anchor : '100%'
			}, {
				xtype : 'datefield',
				name : 'updated_at',
				disabled : true,
				fieldLabel : 'Updated At',
				format : F('datetime'),
				anchor : '100%'
			}, {
				xtype : 'datefield',
				name : 'created_at',
				disabled : true,
				fieldLabel : 'Created At',
				format : F('datetime'),
				anchor : '100%'
			} ],
			
			dockedItems : [ {
				xtype : 'entity_form_buttons',
			} ]
		}
	}
});
Ext.define('Heartyoh.view.management.Code', {
	extend : 'Ext.container.Container',

	alias : 'widget.management_code',

	title : 'Code Mgmt.',

	entityUrl : 'code',
	
	/*
	 * importUrl, afterImport config properties for Import util function
	 */ 
	importUrl : 'code/import',
	
	afterImport : function() {
		this.sub('grid').store.load();
		this.sub('form').getForm().reset();
	},

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	initComponent : function() {
		var self = this;
		
		this.items = [ {
			html : '<div class="listTitle">Code List</div>'
		}, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ this.zgrouplist, {
				xtype : 'container',
				flex : 1,
				cls : 'borderRightGray',
				layout : {
					align : 'stretch',
					type : 'vbox'
				},
				items : [ this.zcodelist, this.zform ]
			} ]
		} ],

		this.callParent(arguments);
		
		this.sub('grid').on('itemclick', function(grid, record) {
			self.sub('form').loadRecord(record);
		});
		
		this.sub('grid').on('render', function(grid) {
			grid.store.clearFilter(true);
			var group = self.sub('grouplist').store.first().get('group');
			grid.store.filter('group', group);
			self.sub('form').getForm().setValues({
				group : group
			});
		});

		this.sub('grouplist').on('itemclick', function(grid, record) {
			self.sub('grid').store.clearFilter(true);
			self.sub('grid').store.filter('group', record.get('group'));
			self.sub('form').getForm().reset();
			self.sub('form').getForm().setValues({
				group : record.get('group')
			});
		});
	},

	zgrouplist : {
		xtype : 'gridpanel',
		itemId : 'grouplist',
		store : 'CodeGroupStore',
		title : 'Code Group',
		width : 320,
		columns : [ {
			dataIndex : 'group',
			text : 'Group',
			width : 100
		}, {
			dataIndex : 'desc',
			text : 'Description',
			width : 220
		} ]
	},

	zcodelist : {
		xtype : 'gridpanel',
		itemId : 'grid',
		store : 'CodeStore',
		title : 'Code List',
		flex : 1,
		cls : 'hIndexbarZero',
		columns : [ {
			dataIndex : 'key',
			text : 'Key',
			hidden : true
		}, {
			dataIndex : 'group',
			text : 'Group'
		}, {
			dataIndex : 'code',
			text : 'Code'
		}, {
			dataIndex : 'desc',
			text : 'Description'
		}, {
			dataIndex : 'created_at',
			text : 'Created At',
			xtype : 'datecolumn',
			format : F('datetime'),
			width : 120
		}, {
			dataIndex : 'updated_at',
			text : 'Updated At',
			xtype : 'datecolumn',
			format : F('datetime'),
			width : 120
		} ]
	},

	zform : {
		xtype : 'form',
		itemId : 'form',
		bodyPadding : 10,
		cls : 'hIndexbar',
		title : 'Code Details',
		height : 200,
		defaults : {
			xtype : 'textfield',
			anchor : '100%'
		},
		items : [ {
			name : 'key',
			fieldLabel : 'Key',
			hidden : true
		}, {
			xtype : 'combo',
			name : 'group',
			fieldLabel : 'Group',
			queryMode : 'local',
			store : 'CodeGroupStore',
			displayField : 'group',
			valueField : 'group'
		}, {
			name : 'code',
			fieldLabel : 'Code'
		}, {
			name : 'desc',
			fieldLabel : 'Description'
		}, {
			xtype : 'datefield',
			name : 'updated_at',
			disabled : true,
			fieldLabel : 'Updated At',
			format : F('datetime')
		}, {
			xtype : 'datefield',
			name : 'created_at',
			disabled : true,
			fieldLabel : 'Created At',
			format : F('datetime')
		} ],
		dockedItems : [ {
			xtype : 'entity_form_buttons'
		} ]
	}
});
Ext.define('Heartyoh.view.management.Vehicle', {
	extend : 'Ext.container.Container',

	alias : 'widget.management_vehicle',

	title : 'Vehicle',

	entityUrl : 'vehicle',
	/*
	 * importUrl, afterImport config properties for Import util function
	 */ 
	importUrl : 'vehicle/import',
	
	afterImport : function() {
		this.sub('grid').store.load();
		this.sub('form').getForm().reset();
	},

	layout : {
		align : 'stretch',
		type : 'vbox'
	},

	items: {
		html : '<div class="listTitle">Vehicle List</div>'
	},

	initComponent : function() {
		var self = this;
		
		this.callParent(arguments);

		this.add(this.buildList(this));
		this.add(this.buildForm(this));

		this.sub('grid').on('itemclick', function(grid, record) {
			self.sub('form').loadRecord(record);
		});

		this.sub('grid').on('render', function(grid) {
			grid.store.load();
		});

		this.sub('id_filter').on('change', function(field, value) {
			self.search(self);
		});

		this.sub('registration_number_filter').on('change', function(field, value) {
			self.search(self);
		});

		this.down('#search_reset').on('click', function() {
			self.sub('id_filter').setValue('');
			self.sub('registration_number_filter').setValue('');
		});

		this.down('#search').on('click', function() {
			self.sub('grid').store.load();
		});
		
		this.down('#image_clip').on('change', function(field, value) {
			var image = self.sub('image');
			
			if(value != null && value.length > 0)
				image.setSrc('download?blob-key=' + value);
			else
				image.setSrc('resources/image/bgVehicle.png');
		})
		
	},

	search : function(self) {
		self.sub('grid').store.clearFilter();

		self.sub('grid').store.filter([ {
			property : 'id',
			value : self.sub('id_filter').getValue()
		}, {
			property : 'registration_number',
			value : self.sub('registration_number_filter').getValue()
		} ]);
	},
	
	buildList : function(main) {
		return {
			xtype : 'gridpanel',
			itemId : 'grid',
			store : 'VehicleStore',
			autoScroll : true,
			flex : 1,
			columns : [ {
				dataIndex : 'key',
				text : 'Key',
				type : 'string',
				hidden : true
			}, {
				dataIndex : 'id',
				text : 'Vehicle Id',
				type : 'string'
			}, {
				dataIndex : 'registration_number',
				text : 'RegistrationNumber',
				type : 'string'
			}, {
				dataIndex : 'manufacturer',
				text : 'Manufacturer',
				type : 'string'
			}, {
				dataIndex : 'created_at',
				text : 'Created At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			}, {
				dataIndex : 'updated_at',
				text : 'Updated At',
				xtype : 'datecolumn',
				format : F('datetime'),
				width : 120
			} ],
			viewConfig : {

			},
			tbar : [ 'ID', {
				xtype : 'textfield',
				name : 'id_filter',
				itemId : 'id_filter',
				hideLabel : true,
				width : 200
			}, 'Registeration Number', {
				xtype : 'textfield',
				name : 'registration_number_filter',
				itemId : 'registration_number_filter',
				hideLabel : true,
				width : 200
			}, {
				text : 'Search',
				itemId : 'search'
			}, {
				text : 'Reset',
				itemId : 'search_reset'
			} ]
		}
	},

	buildForm : function(main) {
		return {
			xtype : 'panel',
			bodyPadding : 10,
			cls : 'hIndexbar',
			title : 'Vehicle Details',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [ {
				xtype : 'form',
				itemId : 'form',
				flex : 1,
				autoScroll : true,
				defaults : {
					xtype : 'textfield',
					anchor : '100%'
				},
				items : [ {
					name : 'key',
					fieldLabel : 'Key',
					hidden : true
				}, {
					name : 'id',
					fieldLabel : 'Vehicle Id'
				}, {
					name : 'registration_number',
					fieldLabel : 'Registration Number'
				}, {
					xtype : 'codecombo',
					name : 'manufacturer',
					group : 'V-Maker',
					fieldLabel : 'Manufacturer'
				}, {
					xtype : 'filefield',
					name : 'image_file',
					fieldLabel : 'Image Upload',
					msgTarget : 'side',
					allowBlank : true,
					buttonText : 'file...'
				}, {
					name : 'lattitude',
					fieldLabel : 'Lattitude',
					disabled : true
				}, {
					name : 'longitude',
					fieldLabel : 'Longitude',
					disabled : true
				}, {
					xtype : 'datefield',
					name : 'updated_at',
					disabled : true,
					fieldLabel : 'Updated At',
					format : F('datetime')
				}, {
					xtype : 'datefield',
					name : 'created_at',
					disabled : true,
					fieldLabel : 'Created At',
					format : F('datetime')
				}, {
					xtype : 'displayfield',
					name : 'image_clip',
					itemId : 'image_clip',
					hidden : true
				} ]
			}, {
				xtype : 'container',
				flex : 1,
				layout : {
					type : 'vbox',
					align : 'stretch'	
				},
				cls : 'noImage paddingLeft10',
				items : [ {
					xtype : 'image',
					height : '100%',
					itemId : 'image'
				} ]
			} ],
			dockedItems : [ {
				xtype : 'entity_form_buttons'
			} ]
		}
	}
});

Ext.define('Heartyoh.store.CompanyStore', {
	extend : 'Ext.data.Store',

	autoLoad : true,

	fields : [ {
		name : 'key',
		type : 'string'
	}, {
		name : 'id',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'desc',
		type : 'string'
	}, {
		name : 'timezone',
		type : 'int'
	}, {
		name : 'created_at',
		type : 'date',
		dateFormat:'time'
	}, {
		name : 'updated_at',
		type : 'date',
		dateFormat:'time'
	} ],
	proxy : {
		type : 'ajax',
		url : 'company',
		reader : {
			type : 'json'
		}
	}
});
Ext.define('Heartyoh.store.UserStore', {
	extend : 'Ext.data.Store',

	fields : [ {
		name : 'key',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'company',
		type : 'string'
	}, {
		name : 'forename',
		type : 'string'
	}, {
		name : 'nickname',
		type : 'string'
	}, {
		name : 'surname',
		type : 'string'
	}, {
		name : 'admin',
		type : 'boolean'
	}, {
		name : 'enabled',
		type : 'boolean'
	}, {
		name : 'created_at',
		type : 'date',
		dateFormat:'time'
	}, {
		name : 'updated_at',
		type : 'date',
		dateFormat:'time'
	} ],
	
	proxy : {
		type : 'ajax',
		url : 'user',
		reader : {
			type : 'json'
		}
	}
});
Ext.define('Heartyoh.store.CodeGroupStore', {
	extend : 'Ext.data.Store',

	autoLoad : true,

	fields : [ {
		name : 'group',
		type : 'string'
	}, {
		name : 'desc',
		type : 'string'
	} ],

	data : [ {
		group : 'V-Type1',
		desc : 'Type 1 of Vehicles'
	}, {
		group : 'V-Type2',
		desc : 'Type 2 of Vehicles'
	}, {
		group : 'V-Type3',
		desc : 'Type 3 of Vehicles'
	}, {
		group : 'V-Size',
		desc : 'Size of Vehicles'
	}, {
		group : 'V-Maker',
		desc : 'Vehicle Makers'
	}, {
		group : 'V-Model',
		desc : 'Vehicle Model'
	}, {
		group : 'V-BirthYear',
		desc : 'Vehicle Birth-Years'
	}, {
		group : 'V-Seat',
		desc : 'Count of Seat of Vehicle'
	}, {
		group : 'V-Fuel',
		desc : 'Types of Fuel of Vehicle'
	}, {
		group : 'ResvPurpose',
		desc : 'Type of Reservation Purpose'
	}, {
		group : 'ResvStatus',
		desc : 'Status of Reservation'
	}, {
		group : 'EmployeeTitle',
		desc : 'Titles of Employee'
	}, {
		group : 'Division',
		desc : 'Devisions of Company'
	}, {
		group : 'Consumable',
		desc : 'Kinds of Consumables'
	} ]
});
Ext.define('Heartyoh.store.CodeStore', {
	extend : 'Ext.data.Store',

	autoLoad : true,

	fields : [ {
		name : 'key',
		type : 'string'
	}, {
		name : 'group',
		type : 'string'
	}, {
		name : 'code',
		type : 'string'
	}, {
		name : 'desc',
		type : 'string'
	}, {
		name : 'created_at',
		type : 'date',
		dateFormat:'time'
	}, {
		name : 'updated_at',
		type : 'date',
		dateFormat:'time'
	} ],
	
	proxy : {
		type : 'ajax',
		url : 'code',
		reader : {
			type : 'json'
		}
	},
	
	groupField: 'group',
    
	groupDir  : 'DESC',
	
	substore : function(group) {
		if(!this.substores)
			return null;
		return this.substores[group];
	},
	
	listeners : {
		load : function(store, records, success) {
			if(!success)
				return;
			store.substores = {};
			
			groups = store.getGroups();
			
			Ext.each(groups, function(group) {
				store.substores[group.name] = Ext.create('Ext.data.Store', {
					model : 'Heartyoh.model.Code',
					data : group.children
				})
			});
		}
	}
});
Ext.define('Heartyoh.store.VehicleStore', {
	extend : 'Ext.data.Store',

	autoLoad : false,
	
	fields : [ {
		name : 'key',
		type : 'string'
	}, {
		name : 'id',
		type : 'string'
	}, {
		name : 'registration_number',
		type : 'string'
	}, {
		name : 'manufacturer',
		type : 'string'
	}, {
		name : 'vehicle_type',
		type : 'string'
	}, {
		name : 'birth_year',
		type : 'int'
	}, {
		name : 'ownership_type',
		type : 'string'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'image_clip',
		type : 'string'
	}, {
		name : 'total_distance',
		type : 'float'
	}, {
		name : 'remaining_fuel',
		type : 'float'
	}, {
		name : 'distance_since_new_oil',
		type : 'float'
	}, {
		name : 'engine_oil_status',
		type : 'string'
	}, {
		name : 'fuel_filter_status',
		type : 'string'
	}, {
		name : 'brake_oil_status',
		type : 'string'
	}, {
		name : 'brake_pedal_status',
		type : 'string'
	}, {
		name : 'cooling_water_status',
		type : 'string'
	}, {
		name : 'timing_belt_status',
		type : 'string'
	}, {
		name : 'spark_plug_status',
		type : 'string'
	}, {
		name : 'driver_id',
		type : 'string'
	}, {
		name : 'lattitude',
		type : 'float'
	}, {
		name : 'driver_id',
		type : 'string'
	}, {
		name : 'terminal_id',
		type : 'string'
	}, {
		name : 'longitude',
		type : 'float'
	}, {
		name : 'location',
		type : 'string'
	}, {
		name : 'created_at',
		type : 'date',
		dateFormat:'time'
	}, {
		name : 'updated_at',
		type : 'date',
		dateFormat:'time'
	} ],
	
	proxy : {
		type : 'ajax',
		url : 'vehicle',
		reader : {
			type : 'json'
		}
	}
});
Ext.define('Heartyoh.store.TimeZoneStore', {
	extend : 'Ext.data.Store',

	fields : [ 'value', 'display' ],

	data : [ {
		value : -12.0,
		display : "(GMT -12:00) Eniwetok, Kwajalein"
	}, {
		value : -11.0,
		display : "(GMT -11:00) Midway Island, Samoa"
	}, {
		value : -10.0,
		display : "(GMT -10:00) Hawaii"
	}, {
		value : -9.0,
		display : "(GMT -9:00) Alaska"
	}, {
		value : -8.0,
		display : "(GMT -8:00) Pacific Time (US &amp; Canada)"
	}, {
		value : -7.0,
		display : "(GMT -7:00) Mountain Time (US &amp; Canada)"
	}, {
		value : -6.0,
		display : "(GMT -6:00) Central Time (US &amp; Canada), Mexico City"
	}, {
		value : -5.0,
		display : "(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima"
	}, {
		value : -4.0,
		display : "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz"
	}, {
		value : -3.5,
		display : "(GMT -3:30) Newfoundland"
	}, {
		value : -3.0,
		display : "(GMT -3:00) Brazil, Buenos Aires, Georgetown"
	}, {
		value : -2.0,
		display : "(GMT -2:00) Mid-Atlantic"
	}, {
		value : -1.0,
		display : "(GMT -1:00 hour) Azores, Cape Verde Islands"
	}, {
		value : 0.0,
		display : "(GMT) Western Europe Time, London, Lisbon, Casablanca"
	}, {
		value : 1.0,
		display : "(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris"
	}, {
		value : 2.0,
		display : "(GMT +2:00) Kaliningrad, South Africa"
	}, {
		value : 3.0,
		display : "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg"
	}, {
		value : 3.5,
		display : "(GMT +3:30) Tehran"
	}, {
		value : 4.0,
		display : "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi"
	}, {
		value : 4.5,
		display : "(GMT +4:30) Kabul"
	}, {
		value : 5.0,
		display : "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent"
	}, {
		value : 5.5,
		display : "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi"
	}, {
		value : 5.75,
		display : "(GMT +5:45) Kathmandu"
	}, {
		value : 6.0,
		display : "(GMT +6:00) Almaty, Dhaka, Colombo"
	}, {
		value : 7.0,
		display : "(GMT +7:00) Bangkok, Hanoi, Jakarta"
	}, {
		value : 8.0,
		display : "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong"
	}, {
		value : 9.0,
		display : "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk"
	}, {
		value : 9.5,
		display : "(GMT +9:30) Adelaide, Darwin"
	}, {
		value : 10.0,
		display : "(GMT +10:00) Eastern Australia, Guam, Vladivostok"
	}, {
		value : 11.0,
		display : "(GMT +11:00) Magadan, Solomon Islands, New Caledonia"
	}, {
		value : 12.0,
		display : "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka"
	} ]
});
Ext.define('Heartyoh.store.FileStore', {
	extend : 'Ext.data.Store',
	
	storeId : 'filestore',
	
	model: 'Heartyoh.model.File',
    
	proxy: {
        type: 'ajax',
        url : '/data/files.json',
        reader: {
            type: 'json'
        }
    },
    
    autoLoad: true
});
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



