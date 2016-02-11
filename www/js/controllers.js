angular.module('starter.controllers', [])

        .controller('TodayCtrl', function ($scope, recentTags, tagsCloudService) {
            $scope.recent = [];
            $scope.filterLove = [];
            initRecentTags();
            $scope.entry = [{date: "", type: "love", name:"", description:""},{date: "", type: "love", name:"", description:""},{date: "", type: "love", name:"", description:""},{date: "", type: "love", name:"", description:""},{date: "", type: "love", name:"", description:""},
            {date: "", type: "avoid", name:"", description:""},{date: "", type: "avoid", name:"", description:""},{date: "", type: "avoid", name:"", description:""},{date: "", type: "avoid", name:"", description:""},{date: "", type: "avoid", name:"", description:""}];
            function initRecentTags() {
               
            tagsCloudService.getTagsCloud();    
            $scope.recent = tagsCloudService.getTagsCloudFunction();
             
            $scope.filterLove =[{type:'love'}];
            console.log($scope.recent);
            }
            $scope.addFromRecent = function (index, tab) {
                var iStart;
                var iEnd;
                console.log(index);
                console.log(tab);
                if(tab === "love")
                { iStart = 0;
                    iEnd = 5;}
                else
                   { iStart = 5;
                    iEnd = 10;} 
                
                for (i = iStart; i < iEnd && $scope.entry[i].name !== ""; i++)
                {
                }
                console.log(i);
                if (i > (iEnd-1))
                    alert("Sorry, you have already added 5 tags");
                else
                {
                    var recentIndex = getRecentIndex(index);
                    $scope.entry[i].name = $scope.recent[recentIndex].name;
                    console.log(i);
                    console.log($scope.entry);
                    $scope.recent[recentIndex] = null;
                    console.log($scope.entry);
                }
            };
            function getRecentIndex (id) {
                for(j=0;j<$scope.recent.length;j++)
                    if($scope.recent[j]!== null)
                    if($scope.recent[j].id === id)
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
