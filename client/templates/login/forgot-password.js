var ERRORS_KEY = 'forgotPasswordErrors';

Template.forgotPassword.onCreated(function() {
  Session.set(ERRORS_KEY, {});
  Session.set('user','none');
});

Template.forgotPassword.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.forgotPassword.events({
  'submit': function(event, template) {
    event.preventDefault();
    
    var email = template.$('#email').val();
    
    var errors = {};

    if (! email) {
      errors.email = 'Please enter your email';
    }

	var user = Meteor.users.findOne({emails: {address: email, verified:false} });

    if (! user) {
      errors.email = 'No user is registered with this email';
    }
    
    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
	
	
    Meteor.call('sendRecoveryEmail',user);
	Router.go('login');
  }
});
