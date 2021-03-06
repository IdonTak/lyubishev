Ext.define('Heartyoh.view.file.FileList', {
	extend : 'Ext.grid.Panel',

	title : 'Files',

	store : 'FileStore',

	columns : [ {
		header : 'Name',
		dataIndex : 'filename'
	}, {
		header : 'Creation',
		dataIndex : 'creation'
	}, {
		header : 'Content-Type',
		dataIndex : 'content_type'
	}, {
		header : 'Size',
		dataIndex : 'size'
	} ],

});
