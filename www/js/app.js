// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic' , 'app.data-service'])
  .config(function($stateProvider , $urlRouterProvider){
    $stateProvider
      .state('root',{
        url:'/root',
        templateUrl:'view/menu.html',
        controller :'RootController'
      })
      .state('root.home' , {
        url:'/home',
        views : {
          homeView : {
            templateUrl : 'view/home.html',
            controller : 'HomeController'
          }
        }
      })
      .state('root.profile' , {
        url : '/profile',
        profileView : {
          templateUrl : 'view/profile.html',
          controller : 'ProfileController'
        }
      })
      .state('root.ajout' , {
        url :'/ajout',
        ajoutView : {
          templateUrl : 'view/ajout.html',
          controller : 'AjoutController'
        }
      })
      .state('root.likes' ,{
        url : '/likes',

      });
    $urlRouterProvider.otherwise('/root');
  })
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('HomeController' , ['dataService' , '$ionicModal' , '$scope', function(dataService, $ionicModal , $scope) {

 // $scope.message = "";

  var posts = dataService.getPosts();
  posts.then(function (result) {
    $scope.posts = result;
  }, function (err) {

  });

  $scope.refresh = function () {
    posts.then(function (result) {
      $scope.posts = result;
    }, function (err) {
    }).finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };


  $ionicModal.fromTemplateUrl('./view/likes.html' , {
    scope : $scope
  }).then(
      function(modalView){
        $scope.likeView = modalView;
      }
    );

  $ionicModal.fromTemplateUrl('./view/commentaire.html' , {
    scope : $scope
  }).then(
    function (modalView) {
      $scope.commentView = modalView;
    }
  );

  $scope.showLikes = function(id){
    dataService.getLikes(id).then(function(result){
      $scope.likes = result;
    } , function(err){});
    $scope.likeView.show();

  };

  $scope.refreshLikes = function () {
    dataService
      .getLikes(id)
      .then(
        function(result){
          $scope.likes = result;
        }
        , function(err){}
      )
      .finally(function()
      {
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.isLiked = function (post) {
    return post.likedByCurrentUser;
  };

  $scope.like = function (post) {

    post.likedByCurrentUser = true;
    dataService
      .likePost(post.id)
      .then(function(res){

      }, function(err){
        post.likedByCurrentUser = false;

      });
  };

  $scope.unlike = function (post) {

    post.likedByCurrentUser = false;
    dataService
      .unlikePost(post.id)
      .then(function(res){
      } , function (err) {
        post.likedByCurrentUser = true;
      });
  };

  $scope.refreshCommentaires = function()
  {
    dataService.getComments($scope.currentPost).then(function(result){
      $scope.commentaires = result;
    } , function(err){})
      .finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.hideLikes = function(){
    $scope.likeView.hide();
  };

  $scope.showCommentaires = function(id){
    dataService.getComments(id).then(function(result){
      $scope.commentaires = result;
      $scope.currentPost = id;
    } , function(err){});
    $scope.commentView.show();
  };

  $scope.hideCommentaires = function()
  {
    $scope.commentView.hide();
  };

  $scope.ajouterCommentaire = function (message) {
    console.log($scope.message);
    $scope.disabled = true;
    dataService
      .sendComment(message , $scope.currentPost)
      .then(function(res){} , function (err) {
        $scope.disabled = true;
      })
      .finally(function(res){
        $scope.disabled = false;
        message = "";
      });
  }

}])
  .controller('AjoutController' , ['$scope' , function ($scope) {

  }])
  .controller('ProfileController' , ['$scope' ,'dataService' , function ($scope , dataService) {
    dataService.autoLogin();
    var user = dataService.getCurrentUser();

  }])
  .controller('RootController' , ['dataService' , '$scope' , function (dataService ,$scope) {
    dataService.autoLogin();
    var user = dataService.getCurrentUser();
  }] );
