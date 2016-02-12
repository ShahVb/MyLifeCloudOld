angular.module('starter.services', [])

        .service('tagsCloudService', function ($http, Backand) {
            var tagsCloudLove = [];
            var tagsCloudAvoid = [];
            var tagsCloudData = [];
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
                }).success(function (data) {
                    callback(data);
                    console.log(data.data);
                    tagsCloudData = data.data;
                    var j = 0;
                    var k = 0;
                    for (i = 0; i < data.data.length; i++)
                    {
                        if (data.data[i].type === "love")
                            tagsCloudLove[j++] = data.data[i];

                        else
                            tagsCloudAvoid[k++] = data.data[i];
                    }

                });

            }
            ;

            var factory = {};
            factory.getTagsCloud = function () {
                getTagsCloudData(function (data) {
                    return data;
                });
            };
            factory.getTagsCloudLove = function () {
                return tagsCloudLove;
            };
            factory.getTagsCloudAvoid = function () {
                return tagsCloudAvoid;
            };
            factory.getTagsCloudData = function () {
                return tagsCloudData;
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
