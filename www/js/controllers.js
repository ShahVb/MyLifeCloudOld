angular.module('starter.controllers', [])

        .controller('TodayCtrl', function ($scope, tagsCloudService) {
            $scope.recentLove = [];
            $scope.recentAvoid = [];
            $scope.entry = [{date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""}, {date: "", type: "love", name: "", description: ""},
                {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}, {date: "", type: "avoid", name: "", description: ""}];

            initRecentTags();

            function initRecentTags() {
                tagsCloudService.getTagsCloud();
                $scope.recentLove = tagsCloudService.getTagsCloudLove();
                $scope.recentAvoid = tagsCloudService.getTagsCloudAvoid();
            }

            $scope.addFromRecent = function (id, tab) {
                var iStart;
                var iEnd;

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
