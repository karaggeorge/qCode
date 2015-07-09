var ERRORS_KEY = 'signinErrors';

Template.login.onCreated(function() {
  Session.set(ERRORS_KEY, {});
  Session.set('user','none');
});

Template.login.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.login.events({
  'submit': function(event, template) {
      event.preventDefault();
    
      var email = template.$('[name=email]').val();
      var password = template.$('[name=password]').val();
    
      var errors = {};

      if (! email) {
        errors.email = 'Email or Username is required';
      }

      if (! password) {
        errors.password = 'Password is required';
      }
    
      Session.set(ERRORS_KEY, errors);
      if (_.keys(errors).length) {
        return;
      }

      Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
          return Session.set(ERRORS_KEY, {'none': error.reason});
        }
        else{
  		  Session.set('user',Meteor.user().profile.role);
  		  Router.go('home');
  	  	}
      });
  }
});
