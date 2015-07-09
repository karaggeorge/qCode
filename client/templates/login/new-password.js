var ERRORS_KEY = 'newPasswordErrors';

Template.newPassword.onCreated(function() {
  Session.set(ERRORS_KEY, {});
  Session.set('user','none');
});

Template.newPassword.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  username: function(){
	  var user = Meteor.users.findOne({_id:this.id});
	  if(user) return user.username;
	  return "Loading..";
  }
});

Template.newPassword.events({
  'submit': function(event, template) {
      event.preventDefault();
    
      var password = template.$('#password').val();
      var rpassword = template.$('#rpassword').val();
    
      var errors = {};

      if (! password || ! rpassword) {
        errors.email = 'Please enter the fields to continue';
      }

      if (password != rpassword) {
        errors.password = 'Passwords have to match';
      }
    
      Session.set(ERRORS_KEY, errors);
      if (_.keys(errors).length) {
        return;
      }

	  Meteor.call('resetMyPassword',this.id,password);
  	Router.go('login');
  }
});
