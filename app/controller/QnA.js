Ext.define('HSK.controller.QnA', {
	extend: 'Ext.app.Controller',

	config: {
		control: {
			navigation: {
				leafitemtap: 'onNavigationLeafItemTap'
			}
		},
		refs: {
			navigation: 'nestedlist',
			questionPanel: '#question-panel',
			answersPanel: '#answers-panel'
		}
	},

	currentType: null,
	currentSheet: null,
	lastQuestion: null,
	store: null,
	app: null,

	init: function(app){
		this.app = app;
		this.store = Ext.getStore('Fragen');
	},

	onNavigationLeafItemTap: function(nestedList, list, index, target, record, e, eOpts){
		this.currentType = record.get('type');
		this.currentSheet = record.get('nr');
		this.showNextQuestion();
	},

	showNextQuestion: function(){
		var Q = this.getQuestion(this.currentType),
			answersPanel = this.getAnswersPanel();
		this.getQuestionPanel().setHtml(Q.get('Q'));
		this.getAnswers(Q);
		answersPanel.removeAll();
		this.store.each(function(rec){
			var A = rec.get('A'),
				name = A.charAt(0);
			answersPanel.add({
				xtype: 'checkboxfield',
				name : name,
				label: A,
				value: name,
				labelWrap: true,
//				labelWidth: '85%',
				labelAlign: 'top',
				checked: false
			});
			console.log(rec.get('A'));
		});
		console.log(Q);
	},

	getQuestion: function(type){
		var store = this.store,
			rand, Q;
		store.clearFilter();
		store.filterBy(function(rec){
			return rec.get('Q') !== '' && rec.get('A') === '';
		});
		switch(type){
			case 'sheet':
			case 'learn':
			case 'random':
				rand = Math.floor(Math.random() * (store.getCount() - 1));
				Q = store.getAt(rand);
				break;
		}
		return Q;
	},

	getAnswers: function(Q){
		var store = this.store,
			nr = Q.get('Nr');
		store.clearFilter();
		store.filterBy(function(rec){
			return rec.get('Nr') === nr && rec.get('Q') === '';
		});

	}

});