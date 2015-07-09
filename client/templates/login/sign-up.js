var ERRORS_KEY = 'signupErrors';

Template.signUp.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signUp.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.signUp.events({
  'submit': function(event, template) {
    event.preventDefault();
    
	var first = template.$('#first').val();
	var last = template.$('#last').val();
	var email = template.$('#email').val();
    var username = template.$('#username').val();
	var password = template.$('#password').val();
    var rpassword = template.$('#rpassword').val();
    
    var errors = {};

    if (! email || !first || !last || !username || !password || !rpassword) {
      errors.fields = '* Fields are required!';
    }
	
	if(password != rpassword){
		errors.password = 'Passwords don\'t match';
	}
    
    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      username: username,
      email: email,
      password: password,
      profile: {
                  name: {
                    first: first,
                    last: last
                  },
				  role: "normal"
              }
    }, function(error){
        if (error) {
          return Session.set(ERRORS_KEY, {'none': error.reason});
        }
		else{
			Router.go('login');
		}
    });
  }
});
