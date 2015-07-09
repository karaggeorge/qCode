var inputFiles = new Array();
var outputFiles = new Array();
var Tmp = [];


Template.editAdmin.onCreated(function(){
	Session.set('pageName',"edit");
	if(!Meteor.user()){
		Router.go('home');
	}
});

Template.editAdmin.helpers({
	name: function(){
		return Competitions.findOne({_id:this.id}).name;
	},
	disabledPrompt: function(){
		if(!Competitions.findOne({_id:this.id}).prompt) return "disabled";
		else return "";
	},
	inputFilesChosen: function(){
		return inputFiles;
	},
	problems: function(){
		return Problems.find();
	},
	input: function(){
		return Testcases.findOne({prob_id: Session.get('selectedProb'), number: Session.get('selectedCase'), kind:"input"}).data;
	},
	output: function(){
		return Testcases.findOne({prob_id: Session.get('selectedProb'), number: Session.get('selectedCase'), kind:"output"}).data;
	}
});

Template.editAdmin.events({
	'click': function(){
		if(this._id) return;
		Session.set('selectedProb',null);
		Session.set('selectedCase',null);
	},
	'change #promptUpload': function(event, template) {
			var files = event.target.files;
			Session.set('selectedFile', files[0]);
	},
	'click .js-upload': function(){
		var f = Session.get('selectedFile');
		if(!f) return;
		
		console.log(f);
		f.name = Competitions.findOne({_id:this.id}).name + ' - Prompt.pdf';
		console.log(f);
		Competitions.update({_id:this.id},{$set: {prompt:f}});
	},
	'change #inputUpload': function(event, template) {
			var files = event.target.files;
			for(i = 0;i < files.length;i++){
				inputFiles.push(files[i]);
			}
	},
	'change #outputUpload': function(event, template) {
			var files = event.target.files;
			for(i = 0;i < files.length;i++){
				outputFiles.push(files[i]);
			}
	},
	'click .js-uploadInput': function(event, template){
		if(!inputFiles) return;
		var number;
		inputFiles.sort(function(a,b){
			return a.name - b.name;
		});
		var num = 0;
		for(i = 0;i < inputFiles.length;i++){
			var f = inputFiles[i];
			//number = f.name;//parseInt(f.name.split(".")[0]);
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				Tmp.push({kind:"input", data: data, number: num});
				num++;
			}
			reader.readAsBinaryString(f);
		}
		template.$('.js-uploadInput').html('Done').removeClass('btn-primary').addClass('btn-success disabled');
	},
	'click .js-uploadOutput': function(event, template){
		if(!outputFiles) return;
		var number;
		outputFiles.sort(function(a,b){
			return a.name - b.name;
		});
		var num = 0;
		for(i = 0;i < outputFiles.length;i++){
			var f = outputFiles[i];
			//number = f.name;//parseInt(f.name.split(".")[0]);
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				Tmp.push({kind:"output", data: data, number: num});
				num++;
			}
			reader.readAsBinaryString(f);
		}
		template.$('.js-uploadOutput').html('Done').removeClass('btn-primary').addClass('btn-success disabled');
	},
	'click .js-addProb': function(event, template){
		var probName = template.$('#probName').val();
		var probPrompt = template.$('#probPrompt').val();
		
		if(!probName){
			return;
		}

		var pid = Problems.insert({user_id: Meteor.userId,comp_id: this.id, name:probName, prompt: probPrompt});
		for(i = 0;i < Tmp.length;i++){
			var obj = Tmp[i];
			Testcases.insert({prob_id: pid, kind: obj.kind, data: obj.data, number: obj.number})
		}
		$('#probName').val('');
		$('#probPrompt').val('');
		$('#outputUpload').val('');
		$('.js-uploadOutput').html('Upload').addClass('btn-primary').removeClass('btn-success disabled');
		$('#inputUpload').val('');
		$('.js-uploadInput').html('Upload').addClass('btn-primary').removeClass('btn-success disabled');
		inputFiles.length = 0;
		outputFiles.length = 0;
		Tmp = [];
		$('#createNewProb').modal('hide');
	},
	'submit': function(event, template){
		event.preventDefault();
	}
});

Template.problem.helpers({
	selected: function(){
		return Session.equals('selectedProb',this._id) ? "selectedProb" : "";
	},
	isSelected: function(){
		return Session.equals('selectedProb',this._id);
	},
	editMode: function(){
		return Session.get('editMode');
	},
	inputTestCases: function(){
		return Testcases.find({prob_id: this._id, kind:"input"});
	},
	outputTestCases: function(){
		return Testcases.find({prob_id: this._id, kind:"output"});
	}
});

Template.problem.events({
	'click': function(){
		if(this.prob_id) return;
		Session.set('selectedProb',this._id);
		Session.set('selectedCase',null);
	},
	'click .js-delete': function(){
		Session.set('selectedProb',null);
		Problems.remove({_id:this._id});
	},
	'click .js-edit': function(){
		Session.set('editMode',true);
	},
	'click .js-save': function(event, template){
		var probName = template.$('#editName').val();
		var probPrompt = template.$('#editPrompt').val();
		
		if(!probName || !probPrompt){
			return;
		}
		Problems.update({_id:this._id},{$set:{name:probName, prompt:probPrompt}});
		Session.set('editMode',false);
	},
	'click .js-cancel': function(){
		Session.set('editMode', false);
	}
});

Template.testCase.helpers({
	selected: function(){
		return Session.equals('selectedCase',this.number) ? "selectedCase" : "";
	}
});

Template.testCase.events({
	'click': function(event, template){
		event.preventDefault();
		if(Session.equals('selectedCase',this.number)){
			console.log("double click");
			$('#testCaseView').modal('show');
		}
		Session.set('selectedCase', this.number);
	}
});