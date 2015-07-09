Template.observe.onCreated(function(){
	Session.set('pageName',"observe");
	
	Meteor.call('getUserList',function(err,result){
		if(err){
			console.log(err);
		}else{
 		   Session.set('userList',result);
		}
	});
	if(!Meteor.user()){
		Router.go('home');
	}
})

Template.observe.helpers({
	submissions: function(){
		return Submissions.find({},{sort:{date:1}});
	}
});

Template.submo.helpers({
	problem: function(){
		return Problems.findOne(this.prob_id).name;
	},
	username: function(){
		return this.username;
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