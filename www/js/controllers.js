angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $state, $window, $ionicPopup, AuthService, AUTH_EVENTS, $http, $ionicLoading) {
            $scope.email = AuthService.email();
            $scope.logOut = function () {
                var _this = this

                $http.jsonp('http://api.openbeerdatabase.com/v1/breweries.json?callback=JSON_CALLBACK').then(function (result) {
                    _this.breweries = result.data.breweries
                })
                AuthService.logout();
                // $scope.user.password = null;
                $state.go('login', {}, {reload: true});
                $window.location.reload(true);
            };

            $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Fremium!',
                    template: 'You are not allowed to access this resource.'
                });
            });

            $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
                AuthService.logout();
                $state.go('login');
                var alertPopup = $ionicPopup.alert({
                    title: 'Session Lost!',
                    template: 'Sorry, You have to login again.'
                });
            });

            $scope.setCurrentEmail = function (name) {
                $scope.email = name;
            };
        })
        .controller('TodayCtrl', function ($scope, tagsCloudService, sharedProportyService, $ionicPopup, $ionicTabsDelegate) {
            $scope.recentLove = [];
            $scope.recentAvoid = [];
            $scope.entry = [{date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""},
                {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}];
            $scope.buttonText = "Done!";
            $scope.avoidBlank = true;
            $scope.loveBlank = true;
            $scope.submitValidated = $scope.avoidBlank || $scope.loveBlank;
            initRecentTags();
            function initRecentTags() {
                tagsCloudService.getTagsCloud();
                tagsCloudService.getTodayTags();
                $scope.recentLove = tagsCloudService.getTagsCloudLove();
                $scope.recentAvoid = tagsCloudService.getTagsCloudAvoid();
            }
           $scope.entryDataUpdated = function() {
                $scope.submitValidated = false;
               
            };
            $scope.$on('entryTagsReceived', function (event, data) {
                var i = 0;
                var j = 0;
                console.log($scope.submitValidated);
                var datalength = data.data.length;
                for (i = 0; i < data.data.length; i++)
                {
                    if (data.data[i].name !== "")
                    {
                        $scope.submitValidated = false;
                        $scope.buttonText = "Update";
                        if (i < 5)
                            $scope.loveBlank = false;
                        else
                            $scope.avoidBlank = false;
                    }
                    if (data.data[i].type === "avoid" && j < 5)
                        j = 5;
                    $scope.entry[j++] = data.data[i];
                }
                console.log($scope.submitValidated);
            });

            $scope.submitButtonPressed = function (tag) {
                //  if (tag === 'love' && $scope.avoidBlank)
                $scope.showPopup(tag);
            };

            $scope.submitTodayData = function () {
                var submitDataArray = [];
                console.log(sharedProportyService.getsignedInUser());
                var date = sharedProportyService.getTodayFilteredDate();
                var userId = sharedProportyService.getsignedInUser().userId;
                var j = 0;
                for (i = 0; i < 10; i++)
                    if ($scope.entry[i].name !== "")
                    {
                        submitDataArray[j] = $scope.entry[i];
                        submitDataArray[j].date = date;
                        submitDataArray[j++].user = userId;
                    }
                tagsCloudService.submitTodayTags(submitDataArray);
            };

//confirm popup
            $scope.showPopup = function (data) {
                $scope.data = {};

                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    title: 'Is there something you want to add to the ' + data + ' log?',
                    scope: $scope,
                    buttons: [
                        {text: 'No', onTap: function (e) {
                                console.log("Second");
                                $scope.submitTodayData();
                            }},
                        {text: 'Yes',
                            type: 'button-positive',
                            onTap: function (e) {
                                console.log("First");
                                return true;
                            }
                        }
                    ]
                });

            };

            $scope.addFromRecent = function (id, tab) {
                var iStart;
                var iEnd;
                console.log($scope.entry);
                if (tab === "love")
                {
                    iStart = 0;
                    iEnd = 5;
                }
                else
                {
                    iStart = 5;
                    iEnd = 10;
                }

                for (i = iStart; i < iEnd && $scope.entry[i].name !== ""; i++)
                {
                }
                if (i > (iEnd - 1))
                    alert("Sorry, you have already added 5 tags");
                else
                {
                    console.log(id);
                    var recentIndex = getRecentIndex(id, tab);
                    if (tab === "love")
                    {
                        $scope.entry[i].name = $scope.recentLove[recentIndex].name;
                        $scope.recentLove[recentIndex] = null;
                    }
                    else
                    {
                        $scope.entry[i].name = $scope.recentAvoid[recentIndex].name;
                        $scope.recentAvoid[recentIndex] = null;
                    }
                    $scope.submitValidated = false;
                    //console.log($scope.entry);
                }
            };

            function getRecentIndex(id, tab) {
                if (tab === "love")
                {
                    for (j = 0; j < $scope.recentLove.length; j++)
                        if ($scope.recentLove[j] !== null)
                            if ($scope.recentLove[j].id === id)
                                return j;
                }
                else
                    for (j = 0; j < $scope.recentAvoid.length; j++)
                        if ($scope.recentAvoid[j] !== null)
                            if ($scope.recentAvoid[j].id === id)
                                return j;
            }
        })
        .controller('CloudCtrl', function ($scope, tagsCloudService) {
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            $scope.tagsCloudLove = [];
            $scope.tagsCloudAvoid = [];
            $scope.currDate = new Date();
            initTagsCloud();
            function initTagsCloud() {
                console.log($scope.currDate);
                tagsCloudService.getTagsCloud();
                $scope.tagsCloudLove = tagsCloudService.getTagsCloudLove();
                $scope.tagsCloudAvoid = tagsCloudService.getTagsCloudAvoid();
            }

            $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];

        })
        .controller('RecommendCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        })
        .controller('LogInCtrl', function LogInCtrl($scope, $state, $ionicPopup, AuthService, Backand, sharedProportyService) {
            $scope.appName = AuthService.appName;
            $scope.error = $state.params.error;
            //  $scope.socialProviders = AuthService.getSocialProviders();

            $scope.authenticate = function () {
                $scope.error = null;
                $scope.success = null;

                if ($scope.newUser) {
                    $scope.signup();
                } else {
                    $scope.signin();
                }
            };


//            $scope.signUp = function (user) {
//                return $http({
//                    method: 'POST',
//                    url: Backand.getApiUrl() + '/1/user/signup',
//                    headers: {
//                        SignUpToken: '9b4b9cd7-8b32-4591-a432-b02766c98fc8'
//                    },
//                    data: {
//                        firstName: user.firstName,
//                        lastName: user.lastName,
//                        email: user.email,
//                        password: user.password,
//                        confirmPassword: user.password,
//                        goal: "Happiness!!!"
//                    }
//                });
//            };

//          
            $scope.signUp = function (data) {
                var parameters = {goal: "Happy"};

                AuthService.signup(data.firstName.$viewValue, data.lastName.$viewValue, data.email.$viewValue, data.password.$viewValue, parameters)
                        .then(function (response) {
                            console.log(response);
                            if (response.status == null)
                                $state.go('tab.today');
                            else {
                                var errorText = '';
                                if (response.data == null)
                                    errorText = response.statusText;
                                else
                                    errorText = response.data.error_description;
                                showError(errorText);
                            }
                        });
            };

            $scope.logIn = function (data) {
                AuthService.login(data.email.$viewValue, data.password.$viewValue).then(function (authenticated) {
                    if (authenticated === 'error')
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    else
                    {
                        $state.go('tab.today', {}, {reload: true});
                        $scope.setCurrentEmail(data.email);
                        sharedProportyService.setsignedInUser(true, authenticated.userId, authenticated.firstName);
                    }
                });
            };

            function showError(error) {
                $scope.error = error && error.data || error.error_description || 'Unknown error from server';
                console.log(error);
                alert(error + " Please try again");
            }

            $scope.socialSignin = function (provider) {
                $scope.newUser ?
                        AuthService.socialSignup(provider.name)
                        .then(gotoTodos, showError) :
                        AuthService.socialSignin(provider.name)
                        .then(gotoTodos, showError);
            };

        })
        ;



