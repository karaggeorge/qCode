Template.inviteAdmin.onCreated(function(){
	Session.set('pageName',"invite");
	
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

Template.inviteAdmin.helpers({
	users: function(){
		//console.log(Meteor.users.find({$where:"this.profile.role=='normal'"}).fetch());
		return  Session.get('userList');
	},
	contestants: function(){
		var profiles = [];
		var count = 0;
		Competitions.findOne(this.id).cont.forEach(function(c){
			profiles[count] = {id: c, name: "NaN"};
			count++;
		});
		var count = 0;
		Competitions.findOne(this.id).cont_names.forEach(function(name){
			profiles[count].name =  name;
			count++;
		});
		console.log(profiles);
		return profiles;
	},
	'anySelected': function(){
		if(Session.get('selectedCont')) return true;
		else return false;
	}
});

Template.inviteAdmin.events({
	'click .js-invite': function(){
		var list = Session.get('userList');
		var tmpId = "-1";
		var name = $('#inviteName').val();
		for(i = 0;i < list.length;i++){
			if(list[i].username == name){
				tmpId = list[i]._id;
				break;
			}
		}
		if(tmpId == "-1") return;
		Competitions.update({_id:this.id},{$push:{cont: tmpId, cont_names:name}});
		$('#inviteName').val("");
		$('#invitePerson').modal('hide');
	},
	'click .js-delete': function(){
		Competitions.update({_id:this.id},{$pull:{cont: Session.get('selectedCont')}});
		Session.set('selectedCont',null);
	}
});

Template.contestant.helpers({
	name: function(){
		return this.name;
		var tmpId = this.toString();
		var tmpName;
		Meteor.call('getUsername',tmpId,function(err,result){
			if(err){
				console.log(err);
			} else {
				Session.set('name',result);
			}
		});
		return Session.get('name');
	},
	selected: function(){
		return Session.equals('selectedCont',this.id.toString()) ? "selected" : ""; 
	}
});

Template.contestant.events({
	'click': function(){
		Session.set('selectedCont',this.id.toString());
	}
});
