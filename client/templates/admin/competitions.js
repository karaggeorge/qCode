var ERRORS_KEY = 'signinErrors';

Template.competitionsAdmin.onCreated(function(){
	Session.set('pageName',"comp");
	if(!Meteor.user()){
		Router.go('home');
	}
});



Template.competitionsAdmin.helpers({
    errorMessages: function() {
      return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
      return Session.get(ERRORS_KEY)[key] && 'error';
    },
	competitions: function(){
		return Competitions.find();
	},
	anySelected: function(){
		if(Session.get("selectedComp")) return true;
		else return false;
	},
	compStarted: function(){
		if(Session.get("selectedComp")){
			if(Competitions.findOne(Session.get('selectedComp')).started){
				return Competitions.findOne(Session.get('selectedComp')).started;
			}
			else{
				return false;
			}
		}
		return false;
	},
	getTime: function(){
		return Timers.findOne({comp_id: Session.get('selectedComp')}).pretty;
	},
	disabled: function(){
		var status = Competitions.findOne(Session.get('selectedComp')).ended;
		if(status) return "disabled";
		else return "";
	}
});

Template.competitionsAdmin.events({
	'click .js-delete': function(){
		Competitions.remove({_id:Session.get("selectedComp")});
		Session.set("selectedComp",null);
	},
	'click .js-add': function(event, template){
		var compName = template.$('#compName').val();
		var errors = {};
		
		if(!compName){
			errors.name = "Please enter a name for the competition";
		}
		
        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
          return;
        }
		Competitions.insert({name:compName});
		$('#compName').val('');
		$('#createNew').modal('hide');
	},
	'click .js-edit': function(event,template){
		Router.go('edit-admin',{_id:Session.get('selectedComp')});
	},
	'click .js-info': function(event,template){
		Router.go('info-admin',{_id:Session.get('selectedComp')});
	},
	'click .js-start': function(event,template){
		//Router.go('start-admin',{_id:Session.get('selectedComp')});
		var hours = parseInt($('#hours').val());
		var seconds = hours * 3600;
		Competitions.update({_id: Session.get('selectedComp')},{$set:{started: true}});
		Meteor.call('startTimer',Session.get('selectedComp'),seconds);
		$('#hours').val('');
		$('#startComp').modal('hide');
	},
	'click .js-stop': function(event, template){
		Competitions.update({_id: Session.get('selectedComp')},{$set:{started: false, ended:true}});
		Meteor.call('endTimer',Session.get('selectedComp'));
	},
	'click .js-invite': function(){
		Router.go('invite-admin',{_id:Session.get('selectedComp')});
	}
});

Template.competition.helpers({
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

Template.competition.events({
	'click': function(){
		Session.set("selectedComp", this._id);
	}
})