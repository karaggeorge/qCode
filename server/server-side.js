var TotalSeconds = [];
var map = [];

function LeadingZero(Time) {
	return (Time < 10) ? "0" + Time : + Time;
}

function UpdateTimer(id) {
	var Seconds = Timers.findOne(id).time;

	var Days = Math.floor(Seconds / 86400);
	Seconds -= Days * 86400;

	var Hours = Math.floor(Seconds / 3600);
	Seconds -= Hours * (3600);

	var Minutes = Math.floor(Seconds / 60);
	Seconds -= Minutes * (60);


	var TimeStr = ((Days > 0) ? Days + " days " : "") + LeadingZero(Hours) + ":" + LeadingZero(Minutes) + ":" + LeadingZero(Seconds)

	Timers.update({_id: id},{$set:{pretty: TimeStr}});
}

function Tick(id) {
	if(!Timers.findOne(id)) return;
	if (Timers.findOne(id).time <= 0) {
		Competitions.update({_id:Timers.findOne(id).comp_id},{$set:{started: false, ended:true}});
		Timers.remove({_id:id});
		return;
	}
	UpdateTimer(id);
	Timers.update({_id: id},{$inc:{time:-1}});
	Meteor.setTimeout(function(){Tick(id);}, 1000);
}


Meteor.methods({
    'sendRecoveryEmail' : function(user) { 
		var link = "checkmycode.meteor.com/new-password/" + user._id;
        Email.send({
              to: user.emails[0].address,
              from: "CheckMyCode!@no-reply.com",
              subject: "Password Recovery",
              text: "Hello " + user.profile.name.first + ",\n\n"+
					"Password recovery for the account: " + user.username + "\n\n"+
					"Click the following link to continue: " + link + "\n\n"+ 
					"If this is not your account, please ignore this email.\n\n"+
					"Thank you,\n\nCheckMyCode!\n"
		});
	},
	'resetMyPassword': function(id,password){
		Accounts.setPassword(id,password);
	},
	'getUserList': function(){
		tmp = [];
		Meteor.users.find({$where:"this.profile.role=='normal'"}).forEach(function(user){
			tmp.push({username: user.username, _id: user._id});
		});
		return tmp;
	},
	'getUsername': function(id){
		return Meteor.users.find({_id:id}).fetch()[0].username;
	},
	'startTimer': function(id,time){
		var timerId = Timers.insert({comp_id: id, time: time});
		UpdateTimer(timerId);
		Meteor.setTimeout(function(){Tick(timerId);}, 1000);
	},
	'endTimer': function(id){
		Timers.remove({comp_id: id});
	},
	'getTimer': function(id){
		for(i = 0;i < map.length;i++){
			if(map[i] == id){
				return UpdateTimer(i);
			}
		}
	}// ,
// 	'submitCode': function(code, user_id, comp_id, prob_name,lang){
//
// 	}
});