/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('starter')

        .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
                notAuthorized: 'auth-not-authorized'
                })

        .constant('USER_ROLES', {
        public: 'public_role',
                user: 'user_role',
                paidUser: 'paidUser_role'
                });

