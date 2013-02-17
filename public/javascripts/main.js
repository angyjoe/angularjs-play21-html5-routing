var app = angular.module("app", ["ngResource"])
  .constant("apiUrl", "http://localhost:9000\:9000/api")
	.config([
    "$routeProvider", function($routeProvider) {
      // WARNING!
      // Never use a route starting with "/views/" or "/api/"
      // For templateUrl, always start with "/views/"
      return $routeProvider.when("/", {
        templateUrl: "/views/index",
        controller: "AppCtrl"
      }).when("/page1", {
        templateUrl: "/views/page1"
      }).when("/page2", {
        templateUrl: "/views/page2"
      }).when("/colors/:id", {
        templateUrl: "/views/color",
        controller: "ColorCtrl"
      }).when("/users", {
        templateUrl: "/views/users",
        controller: "UserCtrl"
      }).when("/users/:id", {
        templateUrl: "/views/user",
        controller: "UserCtrl"
      }).otherwise({
        redirectTo: "/"
      });
    }
  ]).config([
    "$locationProvider", function($locationProvider) {
      return $locationProvider.html5Mode(true).hashPrefix("!");
    }
  ]);

// Global controller
// Contains a fake database
app.controller("AppCtrl", ["$scope", function($scope) {
  $scope.db = {
    1: {
      name: "black",
      hex: "000000"
    },
    2: {
      name: "white",
      hex: "FFFFFF"
    }
  };
}]);

app.controller("ColorCtrl", ["$scope", "$routeParams", function($scope, $routeParams) {
  // Thanks to scope inheritance, we can access the "db" from the AppCtrl scope
  $scope.color = $scope.db[$routeParams.id];
  console.log($scope.color);
  if (!$scope.color) {
    $scope.msg = "There is no color for id "+$routeParams.id;
  } else {
    $scope.msg = undefined;
  }
}])

app.controller("UserCtrl", ["$scope", "$routeParams", "$resource", "apiUrl", function($scope, $routeParams, $resource, apiUrl) {
  var Users = $resource(apiUrl + "/users/:id", {id:"@id"});

  if($routeParams.id) {
    $scope.user = Users.get({id: $routeParams.id}, function() {
      if (!$scope.user.id) {
        $scope.msg = "There is no user for id "+$routeParams.id;
      } else {
        $scope.msg = undefined;
      }
    });
  } else {
    $scope.users = Users.query();
  }
}])
