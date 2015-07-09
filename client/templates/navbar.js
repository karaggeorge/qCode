
Template.navbar.helpers({
	username: function(){
		if(Meteor.user()){
			return Meteor.user().profile.name.first;
		}
	},
	disabled: function(){
		if(!Session.get("selectedComp")) return "disabled";
		var comp = Competitions.findOne(Session.get('selectedComp'));
		if(comp.started || comp.ended) return "disabled";
		return "";
	},
	disabledComp: function(){
		if(!Session.get("selectedComp")) return "disabled";
		var status = Competitions.findOne(Session.get('selectedComp')).ended;
		if(status) return "disabled";
		status = Competitions.findOne(Session.get('selectedComp')).started;
		if(!status) return "disabled";
		else return "";
	},
	disabledObserve: function(){
		if(!Session.get("selectedComp")) return "disabled";
		var status = Competitions.findOne(Session.get('selectedComp')).started;
		if(status) return "";
		status = Competitions.findOne(Session.get('selectedComp')).ended;
		if(status) return "";
		return "disabled";
	},
	active: function(name){
		return Session.equals('pageName',name) ? "active" : "";
	},
	isAdmin: function(){
		var user = Meteor.user();
		if(!user){
			Router.go('home');
		}
		if(user.profile.role == "normal") return false;
		return true;
	}
});

Template.navbar.events({
	'click #editTab': function(event, template){
		event.preventDefault();
		
		Router.go('edit-admin',{_id:Session.get('selectedComp')});
	},
	'click .js-logout': function(){
		Meteor.logout(function(){
			Router.go('home');	
		});
	},
	'click #inviteTab': function(event, template){
		event.preventDefault();
		
		Router.go('invite-admin',{_id:Session.get('selectedComp')});
	},
	'click #competeTab': function(event, template){
		event.preventDefault();
		
		Router.go('compete',{_id:Session.get('selectedComp'), _uid: Meteor.userId(), _username: Meteor.user().username});
	},
	'click #observeTab': function(event, template){
		event.preventDefault();
		
		Router.go('observe',{_id: Session.get('selectedComp')});
	}
});