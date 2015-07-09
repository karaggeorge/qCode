
Meteor.publish('problems', function(comp_id){
	return Problems.find({comp_id: comp_id});
});

Meteor.publish('submissions', function(user_id, comp_id){
	return Submissions.find({user_id: user_id, comp_id: comp_id});
});

Meteor.publish('submissions1', function(comp_id){
	return Submissions.find({comp_id: comp_id});
});

Meteor.publish('competitions', function(){
	return Competitions.find({});
});

Meteor.publish('participants', function(){
	return Participants.find({});
});

Meteor.publish('testcases', function(){
	return Testcases.find({});
});

Meteor.publish('reports', function(){
	return Reports.find({});
});

Meteor.publish('clarifications', function(){
	return Clarifications.find({});
});

Meteor.publish('users', function(){
	return Answers.find({});
});

Meteor.publish('timers', function(){
	return Timers.find({});
});

