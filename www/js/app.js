// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-jqcloud', 'backand', 'ngMockE2E'])
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

            });
        })

        .run(function ($httpBackend) {
            $httpBackend.whenPOST(/api.backand.com\/\w+.*/).passThrough();
            $httpBackend.whenGET(/api.backand.com\/\w+.*/).passThrough();
            $httpBackend.whenGET('http://localhost:8100/valid')
                    .respond({message: 'This is my valid response!'});
            $httpBackend.whenGET('http://localhost:8100/notauthenticated')
                    .respond(401, {message: "Not Authenticated"});
            $httpBackend.whenGET('http://localhost:8100/notauthorized')
                    .respond(403, {message: "Not Authorized"});
           $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
            
        })


        .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

            $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

                if ('data' in next && 'authorizedRoles' in next.data) {
                    var authorizedRoles = next.data.authorizedRoles;
                    if (!AuthService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        $state.go($state.current, {}, {reload: true});
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    }
                    if (!AuthService.isAuthenticated() && next.name !== 'login') {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider
                    .state('login', {
                        url: '/log-in',
                        templateUrl: 'templates/log-in.html',
                        controller: 'LogInCtrl'
                    })
                    .state('forgotpassword', {
                        url: '/forgot-password',
                        templateUrl: 'templates/forgot-password.html'
                    })
                    .state('signup', {
                        url: '/sign-up',
                        templateUrl: 'templates/sign-up.html',
                        controller: 'LogInCtrl'
                    })
                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs.html'
                    })

                    // Each tab has its own nav history stack:

                    .state('tab.today', {
                        url: '/today',
                        views: {
                            'tab-today': {
                                templateUrl: 'templates/tab-today.html',
                                controller: 'TodayCtrl'
                            }
                        }
                    })

                    .state('tab.cloud', {
                        url: '/cloud',
                        views: {
                            'tab-cloud': {
                                templateUrl: 'templates/tab-cloud.html',
                                controller: 'CloudCtrl'
                            }
                        }
                    })
                    .state('tab.chat-detail', {
                        url: '/cloud/:chatId',
                        views: {
                            'tab-cloud': {
                                templateUrl: 'templates/chat-detail.html',
                                controller: 'ChatDetailCtrl'
                            }
                        }
                    })

                    .state('tab.recommend', {
                        url: '/recommend',
                        views: {
                            'tab-recommend': {
                                templateUrl: 'templates/tab-recommend.html',
                                controller: 'RecommendCtrl'
                            }
                        },
                        data: {
                            authorizedRoles: [USER_ROLES.paidUser]
                        }
                    });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                $state.go("login");
            });

        })


        .config(function (BackandProvider) {
            BackandProvider.setAppName('mylifecloud');
            BackandProvider.setSignUpToken('9b4b9cd7-8b32-4591-a432-b02766c98fc8');
            BackandProvider.setAnonymousToken('9a8862bc-72b6-4b0b-976b-f3a653f34fc4');
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show')
                        return config
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading:hide')
                        return response
                    }
                }
            })
        })

        .run(function ($rootScope, $ionicLoading) {
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show({template: '<ion-spinner></ion-spinner>'})
            })

            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide()
            })
        });
