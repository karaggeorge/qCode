var sub = [];
var inTest = "";
var outTest = "";
var result = {
	data: {},
	ready: false,
	correct: false,
	dep: new Deps.Dependency,
	get: function(){
		this.dep.depend();
		return this.ready;
	},
	getData: function(){
		this.dep.depend();
		return this.data;
	},
	isCorrect: function(){
		this.dep.depend();
		return this.correct;
	},
	set: function(newData){
		this.data = newData;
		this.ready = true;
		if(newData.status == 0){
			if(newData.output == outTest){
				this.correct = true;
			}
			else{
				this.correct = false;
			}
		}
		this.dep.changed();
	}
};

function saveResult(data){
	result.set(data);
}

function getResults(sid,obj){
 	$.get("http://api.compilers.sphere-engine.com/api/v3/submissions/"+sid+"?access_token=b603d74dc931cc0afb05b1dbbfa99c55",obj,function(data){
		console.log(data);
		saveResult(data);
		if(data.status != 0){
			getResults(sid,obj);
		}
	},"json");
}

Template.main.onCreated(function() {
	if(!Session.get('user')){
		Router.go('home');
	}
	else if(Session.get('user') == 'none'){
		Router.go('home');
	}
});

Template.main.helpers({
	isReady: function(){
		return result.get();
	},
	getResults: function(){
		return result.getData();
	},
	output: function(){
		if(result.getData().status == 3) return "Running..";
		return result.getData().output;
	},
	time: function(){
		return result.getData().time;
	},
	memory: function(){
		return result.getData().memory;
	},
	correct: function(){
		return (result.get() && result.isCorrect());
	},
	incorrect: function(){
		return (result.get() && !result.isCorrect());
	}
});

Template.main.events({
	'change .codeInput': function(event, template) {
		
		var files = event.target.files;
		
		for(i = 0, f = files[i]; i < files.length;i++){
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
//				console.log("file data:" + data);
			  	  var obj = {
			  		  sourceCode: data,
			  		  language: 1,
			  		  input: inTest
			  	  };
			  	  $.post("http://api.compilers.sphere-engine.com/api/v3/submissions?access_token=b603d74dc931cc0afb05b1dbbfa99c55",obj,function(data){
			  		  console.log(data);
					  sub.push(data.id);
			  	  },"json");
			}
			reader.readAsBinaryString(f);
		}
		
	},
	'change .inInput': function(event, template) {
		
		var files = event.target.files;
		
		for(i = 0, f = files[i]; i < files.length;i++){
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				inTest = data;
			}
			reader.readAsBinaryString(f);
		}
		
	},
	'change .outInput': function(event, template) {
		
		var files = event.target.files;
		
		for(i = 0, f = files[i]; i < files.length;i++){
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				outTest = data;
			}
			reader.readAsBinaryString(f);
		}
		
	},
	'click .check': function(event, template){
		var sid = sub[0];
		var obj = {
			id: sid,
			withSource: true,
			withInput: true,
			withOutput: true,
			withStderr: true,
			withCmpinfo: true
		};

		getResults(sid,obj);
	}
});

/*FS.Utility.eachFile(event,function(file){
	var newFile = new FS.File(file);
	Uploads.insert(newFile,function(err,fileObj){
		if(!err){
			//Meteor.call('uploadFile',fileObj._id,file.name);
			//console.log("all good");
			//console.log(fileObj);
			//console.log(file);
		}
		else{
			console.log("error somewhere");
		}
	})
});*/