
Template.competitionsNormal.onCreated(function(){
	Session.set('pageName',"comp");
	if(!Meteor.user()){
		Router.go('home');
	}
});



Template.competitionsNormal.helpers({
	myCompetitions: function(){
		return Competitions.find({cont: Meteor.userId()});
	},
	anySelected: function(){
		if(Session.get("selectedComp")) return true;
		else return false;
	},
	disabled: function(){
		var status = Competitions.findOne(Session.get('selectedComp')).ended;
		if(status) return "disabled";
		status = Competitions.findOne(Session.get('selectedComp')).started;
		if(!status) return "disabled";
		else return "";
	},
	ended: function(){
		var status = Competitions.findOne(Session.get('selectedComp')).ended;
		if(status) return true;
		console.log("Nope");
		return false;
	}
});

Template.competitionsNormal.events({
	'click .js-compete': function(){
		Router.go('compete',{_id:Session.get('selectedComp'), _uid: Meteor.userId(), _username: Meteor.user().username});
	}
});

Template.competitionNormal.helpers({
	selected: function(){
		return Session.equals("selectedComp", this._id) ? "selected" : '';
	},
	hasEnded: function(){
		if(this.ended) return true;
		return false;
	},
	hasStarted: function(){
		if(this.started) return true;
		return false;
	},
	timeRemain: function(){
		return Timers.findOne({comp_id:this._id}).pretty;
	}
});

Template.competitionNormal.events({
	'click': function(){
		Session.set("selectedComp", this._id);
	}
})