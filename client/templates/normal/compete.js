var ERRORS_KEY = 'submitErrors';
var code;
var interval = 1000;

function checkResults(results, id){
	Submissions.update({_id:id},{$set:{date:results[0].date}});
	for(i = 0;i < results.length;i++){
		if(results[i].status < 0){
			Submissions.update({_id:id},{$set:{status: "Wating in queue..."}});
			return Meteor.setTimeout(function(){track(id)}, interval);
		}
	}
	for(i = 0;i < results.length;i++){
		if(results[i].status == 1){
			Submissions.update({_id:id},{$set:{status: "Compiling..."}});
			return Meteor.setTimeout(function(){track(id)}, interval);
		}
	}
	for(i = 0;i < results.length;i++){
		if(results[i].status == 3){
			Submissions.update({_id:id},{$set:{status: "Executing..."}});
			return Meteor.setTimeout(function(){track(id)}, interval);
		}
	}
	Submissions.update({_id:id},{$set:{status: "Done"}});
	for(i = 0;i < results.length;i++){
		if(results[i].result == 11){
			Submissions.update({_id:id},{$set:{result: "Compilation Error", correct: 1}});
			return;
		}
	}
	for(i = 0;i < results.length;i++){
		if(results[i].result == 12){
			Submissions.update({_id:id},{$set:{result: "Runtime Error", correct:1}});
			return;
		}
	}
	for(i = 0;i < results.length;i++){
		if(results[i].result == 19){
			Submissions.update({_id:id},{$set:{result: "Illegal System Call", correct:1}});
			return;
		}
	}
	for(i = 0;i < results.length;i++){
		if(results[i].result != 15){
			Submissions.update({_id:id},{$set:{result: "Other Error", correct:1}});
			return;
		}
	}
	
	var subm = Submissions.findOne(id);
	for(i = 0;i < results.length;i++){
		console.log(results[i].output);
		console.log(Testcases.findOne({prob_id:subm.prob_id, number:results[i].number, kind:"output"}).data);
		if(results[i].output != Testcases.findOne({prob_id:subm.prob_id, number:results[i].number, kind:"output"}).data){
				Submissions.update({_id:id},{$set:{result: "Wrong Output", correct:2}});
				return;
		}
	}
	
	Submissions.update({_id:id},{$set:{result: "Correct!", correct:0}});
}

function track(id){
	results = [];
	if(Submissions.findOne(id).tests.length != Testcases.find({prob_id:Submissions.findOne(id).prob_id,kind:"input"}).count()){
		return Meteor.setTimeout(function(){track(id)}, interval);
	}
	var max = Submissions.findOne(id).tests.length;
	var current = 0;
	Submissions.findOne(id).tests.forEach(function(test){
		var obj = {
			id: test.id,
			withSource: true,
			withInput: true,
			withOutput: true,
			withStderr: true,
			withCmpinfo: true
		};
	 	$.get("http://api.compilers.sphere-engine.com/api/v3/submissions/"+test.id+"?access_token=b603d74dc931cc0afb05b1dbbfa99c55",obj,function(data){
				var newData = {
					status: data.status,
					result: data.result,
					time: data.time,
					memory: data.memory,
					source: data.source,
					input: data.input,
					output: data.output,
					cmpinfo: data.cmpinfo,
					number: test.number,
					date: data.date
				};
				results.push(newData);
				current++;
				if(current == max){
					checkResults(results,id);
				}
		},"json");
	});
}

function submitCode(code, user_id, comp_id, prob_name,lang, username){
	var prob_id = Problems.findOne({name: prob_name, comp_id: comp_id})._id;
	var sub_id = Submissions.insert({user_id: user_id, comp_id: comp_id, prob_id: prob_id, lang: lang, username: username, tests:[]});
	Testcases.find({prob_id: prob_id, kind:"input"}).forEach(function(test){
	  var obj = {
  		  sourceCode: code,
  		  language: lang,
  		  input: test.data
  	  };
  	  $.post("http://api.compilers.sphere-engine.com/api/v3/submissions?access_token=b603d74dc931cc0afb05b1dbbfa99c55",obj,function(data){
		  Submissions.update({_id:sub_id},{$push:{tests: {id:data.id, number:test.number }}});
  	  },"json");
	});
	track(sub_id);
}

Template.compete.onCreated(function(){
	Session.set(ERRORS_KEY, {});
	Session.set('pageName',"compete");
	if(!Meteor.user()){
		Router.go('home');
	}
	Session.set('selectedProb',null);
	$.get("http://api.compilers.sphere-engine.com/api/v3/languages?access_token=b603d74dc931cc0afb05b1dbbfa99c55",function(data){
		Session.set('langList', data);
	},"json");
});

Template.compete.helpers({
    errorMessages: function() {
      return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
      return Session.get(ERRORS_KEY)[key] && 'error';
    },
	name: function(){
		console.log(this.id);
		console.log(this.uid);
		return Competitions.findOne(this.id).name;
	},
	time: function(){
		var timer = Timers.findOne({comp_id:this.id});
		if(!timer) return "Ended";
		return timer.pretty;
	},
	notEnded: function(){
		var timer = Timers.findOne({comp_id:this.id});
		if(!timer) return false;
		return true;
	},
	probs: function(){
		return Problems.find();
	},
	prompt: function(){
		//console.log('I am here with ' + $('#probId').val());
		var prob = Problems.findOne({name: Session.get('selectedProb')});
		if(!prob) return "Select a problem to view its prompt";
		return prob.prompt;
	},
	languages: function(){
		var list = Session.get('langList');
		var tmp = [];
		for(i = 1;i < 129;i++){
			// console.log("language " + i + ": " + list[i]);
			if(list[i]){
				tmp.push({num: i, name: list[i]});
			}
		}
		return tmp;
	},
	submissions: function(){
		return Submissions.find({},{sort:{date:1}});
	}
});

Template.compete.events({
	'change #probId': function(event, template){
		Session.set('selectedProb',$('#probId').val());
	},
	'click .js-submit': function(){
		
		var errors = {};
		
        if (! code) {
          errors.code = 'No file selected';
        }
		
		var prob = Problems.findOne({name: Session.get('selectedProb')});
		if(! prob) {
			errors.prob = 'No problem Selected';
		}
    
        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
          return;
        }
		submitCode(code,this.uid,this.id,Session.get('selectedProb'),$('#language').val(),this.username);
		$('#codeFile').val(null);
	},
	'change #codeFile': function(event, template){
		var files = event.target.files;
		f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			code = data;
			console.log("READ IT");
			console.log(code);
		}
		reader.readAsBinaryString(f);
	}
});

Template.subm.helpers({
	problem: function(){
		return Problems.findOne(this.prob_id).name;
	},
	status: function(){
		var status = this.status;
		if(status) return status;
		return "Loading..";
	},
	result: function(){
		var result = this.result;
		if(result) return result;
		return "Loading..";
	},
	color: function(){
		var correct = this.correct;
		if(correct == 0) return "success";
		else if(correct == 1) return "warning";
		else if(correct == 2) return "danger";
		else return "";
	}
});