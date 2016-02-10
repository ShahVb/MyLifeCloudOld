angular.module('starter.services', [])

        .factory('recentTags', function ($http) {
            var recent = [{id: 0, love: "Love1", avoid: "Avoid1"}, {id: 1, love: "Love2", avoid: "Avoid2"}, {id: 2, love: null, avoid: "Avoid3"}, {id: 3, love: "Love4", avoid: "Avoid4"},
                {id: 4, love: "Love5", avoid: "Avoid5"}, {id: 5, love: "Love6", avoid: "Avoid6"}, {id: 6, love: "Love7", avoid: "Avoid7"}, {id: 7, love: "Love8", avoid: "Avoid8"}];
            var factory = {};
            factory.getRecentTags = function () {
                return recent;
            };
            return factory;
        })
        .service('tagsCloudService', function ($http, Backand) {
            var tagsCloudLove = this;
            var tagsCloudAvoid = this;
            var tagsCloud = this;
            this.tagsCloud = getTagsCloudData;
            function getTagsCloudData(callback) {
                $http({
                    method: 'GET',
                    url: Backand.getApiUrl() + '/1/objects/tagsCloud',
                    params: {
                        pageSize: 20,
                        pageNumber: 1,
                        filter: null,
                        sort: [{fieldName: "weight", order: "desc"}]
                    }
                }).success(function (data, status, header, config) {
                    callback(data);
                    console.log(data);
                    var j = 0;
                    var k = 0;
                    for (i = 0; i < data.data.length; i++)
                    {
                        if (data.data[i].type === "love")
                            tagsCloudLove[j++] = data.data[i];
                        else
                            tagsCloudAvoid[k++] = data.data[i];
                    }
                    console.log(data.data[0]);
                    console.log(tagsCloudLove);
                    console.log(tagsCloudAvoid);
                });

            }
            ;

            //[{name: "Lorem", weight: 13,type:"love",id:1},{name: "Ipsum", weight: 10.5,type:"love",id:1},{name: "Dolor", weight: 9.4,type:"love",id:1},{name: "Sit", weight: 8,type:"love",id:1},{name: "Amet", weight: 6.2,type:"love",id:1},
            //{name: "Consectetur", weight: 5,type:"avoid",id:1},{name: "Adipiscing", weight: 4,type:"avoid",id:1},{name: "Elit", weight: 4,type:"avoid",id:1},{name: "Nam et", weight: 3,type:"avoid",id:1}, {name: "Leo", weight: 4,type:"avoid",id:1}];


            var factory = {};
            factory.getTagsCloud = function () {
                getTagsCloudData(function (data) {
                });
            };
            factory.getTagsCloudLove = function () {
                return tagsCloudLove;
            };
            factory.getTagsCloudAvoid = function () {
                return tagsCloudAvoid;
            };
            return factory;
        })


        .factory('Chats', function () {
            var chats = [{
                    id: 0,
                    name: 'Ben Sparrow',
                    lastText: 'You on your way?',
                    face: 'img/ben.png'
                }, {
                    id: 1,
                    name: 'Max Lynx',
                    lastText: 'Hey, it\'s me',
                    face: 'img/max.png'
                }, {
                    id: 2,
                    name: 'Adam Bradleyson',
                    lastText: 'I should buy a boat',
                    face: 'img/adam.jpg'
                }, {
                    id: 3,
                    name: 'Perry Governor',
                    lastText: 'Look at my mukluks!',
                    face: 'img/perry.png'
                }, {
                    id: 4,
                    name: 'Mike Harrington',
                    lastText: 'This is wicked good ice cream.',
                    face: 'img/mike.png'
                }];

            return {
                all: function () {
                    return chats;
                },
                remove: function (chat) {
                    chats.splice(chats.indexOf(chat), 1);
                },
                get: function (chatId) {
                    for (var i = 0; i < chats.length; i++) {
                        if (chats[i].id === parseInt(chatId)) {
                            return chats[i];
                        }
                    }
                    return null;
                }
            };
        });
