Router.configure({
  layoutTemplate: 'appBody',
  //notFoundTemplate: 'appNotFound',
  //loadingTemplate: 'appLoading',
	waitOn: function(){
		return [
			Meteor.subscribe('timers')
		];
	}
});

/*Router.onBeforeAction(function (pause) {
  if (!this.ready()) {
    //this.render('appLoading');
    pause();
  }
});*/

Router.map(function() {
  this.route('main', {
    path: '/main',
    template: 'main',
    yieldTemplates: {
        'navbar': {to: 'navbar'}
    }
  });
  
  this.route('competitions-admin',{
	  path:'/admin/competitions',
	  template: 'competitionsAdmin',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions')
	  	];
	  }
  });
  
  this.route('competitions-normal',{
	  path:'/competitions',
	  template: 'competitionsNormal',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions')
	  	];
	  }
  });
  
  this.route('invite-admin',{
	  path:'/admin/invite/:_id',
	  template: 'inviteAdmin',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions')
	  	];
	  },
	  data: function(){
		  templateData = {
			  id: this.params._id
		  };
		  return templateData;
	  }
  });
  
  this.route('observe',{
	  path:'/admin/observe/:_id',
	  template: 'observe',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions'),
	  		Meteor.subscribe('problems',this.params._id),
			Meteor.subscribe('submissions1', this.params._id)
	  	];
	  },
	  data: function(){
		  templateData = {
			  id: this.params._id
		  };
		  return templateData;
	  }
  });
  
  this.route('edit-admin',{
	  path:'/admin/edit/:_id',
	  template: 'editAdmin',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions'),
	  		Meteor.subscribe('problems',this.params._id),
	  		Meteor.subscribe('testcases')
	  	];
	  },
	  data: function(){
		  templateData = {
			  id: this.params._id
		  };
		  return templateData;
	  }
  });
  
  this.route('compete',{
	  path:'/compete/:_id/:_uid/:_username',
	  template: 'compete',
	  yieldTemplates: {
		  'navbar': {to: 'navbar'}
	  },
	  waitOn: function(){
	  	return [
	  		Meteor.subscribe('competitions'),
	  		Meteor.subscribe('problems',this.params._id),
	  		Meteor.subscribe('testcases'),
			Meteor.subscribe('submissions',this.params._uid,this.params._id)
	  	];
	  },
	  data: function(){
		  templateData = {
			  id: this.params._id,
			  uid: this.params._uid,
			  username: this.params._username
		  };
		  return templateData;
	  }
  });
  
  this.route('login', {
	  path: '/login',
	  template: 'login',
	  layoutTemplate: 'loginBody'
  });
  
  this.route('signUp', {
	  path: '/sign-up',
	  template: 'signUp',
	  layoutTemplate: 'loginBody'
  });
  
  this.route('forgotPassword', {
	  path: '/forgot-password',
	  template: 'forgotPassword',
	  layoutTemplate: 'loginBody'
  });
  
  this.route('newPassword', {
	  path: '/new-password/:_id',
	  template: 'newPassword',
	  layoutTemplate: 'loginBody',
	  data: function(){
		  templateData = {
			  id:  this.params._id
		  };
		  return templateData;
	  }
  });
  
  this.route('home', {
    path: '/',
    action: function() {
		if(Meteor.user()) {
			if(Meteor.user().profile.role == "admin"){
				Router.go('competitions-admin');
			}
			else {
				Router.go('competitions-normal')
			}
			
		}else{
		        Router.go('login');
		}
    }
  });
});