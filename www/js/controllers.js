angular.module('starter.controllers', [])

        .controller('TodayCtrl', function ($scope, recentTags, tagsCloud) {
            $scope.recent = [];
            initRecentTags();
            $scope.entry = [{love: "", avoid: ""}, {love: "", avoid: ""}, {love: "", avoid: ""}, {love: "", avoid: ""}, {love: "", avoid: ""}];
            function initRecentTags() {
                $scope.recent = recentTags.getRecentTags();
            }
            $scope.addFromRecent = function (index, tab) {
                for (i = 0; i < 5 && $scope.entry[i][tab] != ""; i++)
                {
                }
                if (i > 4)
                    alert("Sorry, you have already added 5 tags");
                else
                {
                    $scope.entry[i][tab] = $scope.recent[index][tab];
                    console.log($scope.recent);
                    console.log(index);
                    $scope.recent[index][tab] = null;
                    console.log($scope.entry);
                }
            };
        })
        .controller('LogInCtrl', function ($scope, $state) {

            $scope.logIn = function (user) {
                //   console.log('Sign-In', user);
                $state.go('tab.today');
            };

        })

        .controller('CloudCtrl', function ($scope, Chats, tagsCloudService) {
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //
            //$scope.$on('$ionicView.enter', function(e) {
            //});
            /*          $scope.love = [
             {text: "Lorem", weight: 13},
             {text: "Ipsum", weight: 10.5},
             {text: "Dolor", weight: 9.4},
             {text: "Sit", weight: 8},
             {text: "Amet", weight: 6.2},
             {text: "Consectetur", weight: 5},
             {text: "Adipiscing", weight: 5},
             {text: "Elit", weight: 5},
             {text: "Nam et", weight: 5},
             {text: "Leo", weight: 4},
             {text: "Sapien", weight: 4},
             {text: "Pellentesque", weight: 3},
             {text: "habitant", weight: 3},
             {text: "morbi", weight: 3},
             {text: "tristisque", weight: 3},
             {text: "senectus", weight: 3},
             {text: "et netus", weight: 3},
             {text: "et malesuada", weight: 3},
             {text: "fames", weight: 2},
             {text: "ac turpis", weight: 2},
             {text: "egestas", weight: 2},
             {text: "Aenean", weight: 2},
             {text: "vestibulum", weight: 2},
             {text: "elit", weight: 2},
             {text: "sit amet", weight: 2},
             {text: "metus", weight: 2},
             {text: "adipiscing", weight: 2},
             {text: "ut ultrices", weight: 2}
             ];
             */
            $scope.tagsCloudLove = [];
            $scope.tagsCloudAvoid = [];
            initTagsCloud();
            function initTagsCloud() {
                tagsCloudService.getTagsCloud();
                $scope.tagsCloudLove = tagsCloudService.getTagsCloudLove();
                $scope.tagsCloudAvoid = tagsCloudService.getTagsCloudAvoid();
            }
            /*
             $scope.hate = [
             {name: "Lorem", weight: 3},
             {name: "Ipsum", weight: 1},
             {name: "Dolor", weight: 4},
             {name: "Sit", weight: 1},
             {name: "Amet", weight: 2},
             {name: "Consectetur", weight: 2},
             {name: "Adipiscing", weight: 2},
             {name: "Elit", weight: 2},
             {name: "Nam et", weight: 2},
             {name: "Leo", weight: 4},
             {name: "Sapien", weight: 4},
             {name: "Pellentesque", weight: 7},
             {name: "habitant", weight: 7},
             {name: "morbi", weight: 7},
             {name: "tristisque", weight: 3},
             {name: "senectus", weight: 3},
             {name: "et netus", weight: 3},
             {name: "et malesuada", weight: 3},
             {name: "fames", weight: 10},
             {name: "ac turpis", weight: 15},
             {name: "egestas", weight: 2},
             {name: "Aenean", weight: 8},
             {name: "vestibulum", weight: 12},
             {name: "elit", weight: 12},
             {name: "sit amet", weight: 15},
             {name: "metus", weight: 15},
             {name: "adipiscing", weight: 18},
             {name: "ut ultrices", weight: 20}
             ];
             */
            $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];
            $scope.chats = Chats.all();
            $scope.remove = function (chat) {
                Chats.remove(chat);
            };
        })

        .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
            $scope.chat = Chats.get($stateParams.chatId);
        })

        .controller('RecommendCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
