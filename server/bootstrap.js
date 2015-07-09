Meteor.startup(function () {
    Accounts.onCreateUser(function(options, user) {
        if (options.profile)
          user.profile = options.profile;
        return user;
    });
	
	if(Meteor.users.find().count() === 0){
	    Accounts.createUser({
	      username: "admin",
	      email: "admin@email.com",
	      password: "password",
	      profile: {
	                  name: {
	                    first: "Admin",
	                    last: "Admin",
	                  },
					  role: "admin"
	              }
	    });
	}
});