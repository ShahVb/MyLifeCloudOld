/*
 * Angular SDK to use with backand 
 * @version 1.8.2 - 2015-12-01
 * @link https://www.backand.com 
 * @author Itay Herskovits 
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function () {
    function a(a, b) {
        var c = j[a], d = b ? "up" : "in";
        return"user/socialSign" + d + "?provider=" + c.label + "&response_type=token&client_id=self&redirect_uri=" + c.url + "&state="
    }
    function b(a, b, c, d) {
        return{request: function (a) {
                if (h.isManagingHttpInterceptor && a.url.match(b.getApiUrl()) && !a.url.match(b.getApiUrl() + "/token")) {
                    var c = g.token.get();
                    c && (a.headers.Authorization = c), h.anonymousToken && (a.headers.AnonymousToken = h.anonymousToken)
                }
                return a
            }, responseError: function (e) {
                if (h.isManagingHttpInterceptor && e.config.url !== b.getApiUrl() + "token" && h.isManagingRefreshToken && 401 === e.status && e.data && "invalid or expired token" === e.data.Message) {
                    d.refreshToken(b.getUsername());
                    var f = a.defer();
                    return c.append(e.config, f), f.promise
                }
                return a.reject(e)
            }}
    }
    function c(b, c, d, e) {
        function k(a, b, d, e) {
            a.addEventListener("loadstart", function (f) {
                if (0 == f.url.indexOf(s)) {
                    if (a.close(), f.url.indexOf("error=") > -1) {
                        var g = decodeURI(f.url).split("error=")[1], j = JSON.parse(g);
                        if (!b && h.callSignupOnSingInSocialError && j.message.indexOf(r) > -1)
                            return void l(d, !0, e);
                        var k = {data: j.message + " (signing in with " + j.provider + ")"};
                        return k.error_description = k.data, void p.loginPromise.reject(k)
                    }
                    var g = decodeURI(f.url).split("/#/?data=")[1], j = JSON.parse(g);
                    p.inSocialSignup && (p.inSocialSignup = !1, c.$broadcast(i.SIGNUP)), n(j)
                }
            })
        }
        function l(c, d, e) {
            if (!j[c])
                throw Error("Unknown Social Provider");
            if (p.loginPromise = b.defer(), h.isMobile) {
                var f = window.open(h.apiUrl + "/1/" + a(c, d) + "&appname=" + h.appName + "&returnAddress=" + s, "id1", e || "left=1, top=1, width=600, height=600");
                k(f, d, c, e)
            } else
                p.socialAuthWindow = window.open(h.apiUrl + "/1/" + a(c, d) + "&appname=" + h.appName + "&returnAddress=", "id1", e || "left=1, top=1, width=600, height=600"), window.addEventListener("message", function (a, b) {
                    return function (c) {
                        m(c, a, b)
                    }
                }(c, e), !1);
            return p.loginPromise.promise
        }
        function l(c, d, e) {
            if (!j[c])
                throw Error("Unknown Social Provider");
            if (p.loginPromise = b.defer(), h.isMobile) {
                var f = window.open(h.apiUrl + "/1/" + a(c, d) + "&appname=" + h.appName + "&returnAddress=" + s, "id1", e || "left=1, top=1, width=600, height=600");
                k(f, d, c, e)
            } else
                p.socialAuthWindow = window.open(h.apiUrl + "/1/" + a(c, d) + "&appname=" + h.appName + "&returnAddress=", "id1", e || "left=1, top=1, width=600, height=600"), window.addEventListener("message", function (a, b) {
                    return function (c) {
                        m(c, a, b)
                    }
                }(c, e), !1);
            return p.loginPromise.promise
        }
        function m(a, b, d) {
            if (console.log(a, b, d), p.socialAuthWindow.close(), p.socialAuthWindow = null, a.origin === location.origin) {
                var e = JSON.parse(a.data);
                if (e.error) {
                    if (h.callSignupOnSingInSocialError && e.error.message.indexOf(r) > -1)
                        return void l(b, !0, d);
                    var f = {data: e.error.message + " (signing in with " + e.error.provider + ")"};
                    f.error_description = f.data, p.loginPromise.reject(f)
                } else {
                    if (e.data)
                        return p.inSocialSignup && (p.inSocialSignup = !1, c.$broadcast(i.SIGNUP)), n(e.data);
                    p.loginPromise.reject()
                }
            }
        }
        function n(a) {
            var b = {grant_type: "password", accessToken: a.access_token, appName: h.appName};
            return p.signupParameters && (b.parameters = p.signupParameters, p.signupParameters = null), o(b)
        }
        function o(a) {
            return q ? void 0 : (q = !0, g.token.clear(), f({method: "POST", url: h.apiUrl + t.token, headers: {"Content-Type": "application/x-www-form-urlencoded"}, transformRequest: function (a) {
                    var b = [];
                    return angular.forEach(a, function (a, c) {
                        b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a))
                    }), b.join("&")
                }, data: a}).then(function (a) {
                return a.data && a.data.access_token ? (h.token = "bearer " + a.data.access_token, g.token.set(h.token), g.user.set(a.data), p.loginPromise && p.loginPromise.resolve(h.token), d.retryAll(), c.$broadcast(i.SIGNIN), h.runSocket && e.login(g.token.get(), h.anonymousToken, h.appName, h.socketUrl)) : p.loginPromise && p.loginPromise.reject("token is undefined"), a.data
            })["catch"](function (a) {
                return p.loginPromise && p.loginPromise.reject(a), b.reject(a.data)
            })["finally"](function () {
                q = !1
            }))
        }
        var p = this, q = !1, r = "The user is not signed up to", s = "http://www.backandaaaa.com", t = {signup: "/1/user/signup", token: "/token", requestResetPassword: "/1/user/requestResetPassword", resetPassword: "/1/user/resetPassword", changePassword: "/1/user/changePassword"};
        p.signin = function (a, b) {
            var c = {grant_type: "password", username: a, password: b, appname: h.appName};
            return o(c)
        }, p.signout = function () {
            return g.token.clear(), g.user.clear(), d.rejectAll("signed out"), c.$broadcast(i.SIGNOUT), b.when(!0)
        }, p.signup = function (a, b, d, e, g, j) {
            return f({method: "POST", url: h.apiUrl + t.signup, headers: {SignUpToken: h.signUpToken}, data: {firstName: a, lastName: b, email: d, password: e, confirmPassword: g, parameters: j}}).then(function (a) {
                return c.$broadcast(i.SIGNUP), h.runSigninAfterSignup && 1 === a.data.currentStatus ? p.signin(d, e) : a
            })
        }, p.socialSignin = function (a, b) {
            return l(a, !1, b)
        }, p.socialSignup = function (a, b, c) {
            return p.signupParameters = b, p.inSocialSignup = !0, l(a, !0, c)
        }, p.refreshToken = function (a) {
            g.token.clear();
            var b, c = g.user.get();
            if (c && (b = g.user.get().refresh_token)) {
                var d = {grant_type: "password", refreshToken: b, username: a, appName: h.appName};
                return o(d)
            }
        }, p.requestResetPassword = function (a) {
            return f({method: "POST", url: h.apiUrl + t.requestResetPassword, data: {appName: h.appName, username: a}})
        }, p.resetPassword = function (a, b) {
            return f({method: "POST", url: h.apiUrl + t.resetPassword, data: {newPassword: a, resetToken: b}})
        }, p.changePassword = function (a, b) {
            return f({method: "POST", url: h.apiUrl + t.changePassword, data: {oldPassword: a, newPassword: b}})
        }
    }
    function d(a) {
        var b = this;
        b.socket = {on: function () {
            }}, b.login = function (a, c, d, e) {
            b.socket = io.connect(e, {forceNew: !0}), b.socket.on("connect", function () {
                console.log("connected"), b.socket.emit("login", a, c, d)
            }), b.socket.on("disconnect", function () {
                console.log("disconnect")
            }), b.socket.on("reconnecting", function () {
                console.log("reconnecting")
            })
        }, b.on = function (c, d) {
            b.socket.on(c, function () {
                var c = arguments;
                a.$apply(function () {
                    d.apply(b.socket, c)
                })
            })
        }, b.emit = function (c, d, e) {
            b.socket.emit(c, d, function () {
                var c = arguments;
                a.$apply(function () {
                    e && e.apply(b.socket, c)
                })
            })
        }
    }
    function e(a) {
        var b = this;
        b.getUserDetails = function (b) {
            var c = a.defer();
            return b ? f({method: "GET", url: h.apiUrl + "/api/account/profile"}).success(function (a) {
                g.user.set(angular.extend(g.user.get(), a)), c.resolve(g.user.get())
            }) : c.resolve(g.user.get()), c.promise
        }, b.getUsername = function () {
            var a;
            return(a = g.user.get()) ? a.username : null
        }, b.getUserRole = function () {
            var a;
            return(a = g.user.get()) ? a.role : null
        }
    }
    var f, g = function () {
        "use strict";
        function a(a, c) {
            var d;
            -1 === ["local", "session"].indexOf(c) && (c = "local"), d = "undefined" != typeof window && "undefined" != typeof window[c + "Storage"] ? window[c + "Storage"] : {value: null, getItem: function (a, b) {
                    return this.value
                }, setItem: function (a, b) {
                    this.value = b
                }, removeItem: function (a, b) {
                    this.value = null
                }}, this.command = function (c, e) {
                return d[c + "Item"](b + a, e || null)
            }
        }
        var b = "BACKAND";
        return a.prototype.get = function () {
            return JSON.parse(this.command("get"))
        }, a.prototype.set = function (a) {
            return this.command("set", JSON.stringify(a))
        }, a.prototype.clear = function () {
            return this.command("set"), this
        }, {register: function (b, c) {
                if (!b)
                    throw Error("Invalid Store Name");
                return this[b] = new a(b, c), this
            }, remove: function (a) {
                return this[a].command("remove"), delete this[a], this
            }}
    }(), h = {apiUrl: "https://api.backand.com", socketUrl: "https://api.backand.com:4000", anonymousToken: null, signUpToken: null, isManagingHttpInterceptor: !0, isManagingRefreshToken: !0, runSigninAfterSignup: !0, callSignupOnSingInSocialError: !0, appName: null, userProfileName: "backand_user", isMobile: !1, runSocket: !1}, i = {SIGNIN: "BackandSignIn", SIGNOUT: "BackandSignOut", SIGNUP: "BackandSignUp"}, j = {github: {name: "github", label: "Github", url: "www.github.com", css: "github", id: 1}, google: {name: "google", label: "Google", url: "www.google.com", css: "google-plus", id: 2}, facebook: {name: "facebook", label: "Facebook", url: "www.facebook.com", css: "facebook", id: 3}};
    g.register("token"), g.register("user"), function () {
        var a = /\?(data|error)=(.+)/, b = a.exec(location.href);
        if (b && b[1] && b[2]) {
            var c = {};
            c[b[1]] = JSON.parse(decodeURI(b[2].replace(/#.*/, ""))), window.opener.postMessage(JSON.stringify(c), location.origin)
        }
    }(), angular.module("backand", []).provider("Backand", function () {
        function a(a, b, c) {
            var d = this;
            d.EVENTS = i, d.setAppName = function (a) {
                h.appName = a
            }, d.signin = function (b, c) {
                return a.signin(b, c)
            }, d.signout = function () {
                return a.signout()
            }, d.signup = function (b, c, d, e, f, g) {
                return a.signup(b, c, d, e, f, g)
            }, d.getSocialProviders = function () {
                return j
            }, d.socialSignin = function (b, c) {
                return a.socialSignin(b, c)
            }, d.socialSignup = function (b, c, d) {
                return a.socialSignup(b, c, d)
            }, d.requestResetPassword = function (b) {
                return a.requestResetPassword(b)
            }, d.resetPassword = function (b, c) {
                return a.resetPassword(b, c)
            }, d.changePassword = function (b, c) {
                return a.changePassword(b, c)
            }, d.setIsMobile = function (a) {
                h.isMobile = a
            }, d.setRunSignupAfterErrorInSigninSocial = function (a) {
                h.callSignupOnSingInSocialError = a
            }, d.getUserDetails = function (a) {
                return b.getUserDetails(a)
            }, d.getUsername = function () {
                return b.getUsername()
            }, d.getUserRole = function () {
                return b.getUserRole()
            }, d.getToken = function () {
                return g.token.get()
            }, d.getTokenName = function () {
                return null
            }, d.getApiUrl = function () {
                return h.apiUrl
            }, d.isManagingDefaultHeaders = function () {
                return null
            }, d.isManagingHttpInterceptor = function () {
                return h.isManagingHttpInterceptor
            }, d.isManagingRefreshToken = function () {
                return h.isManagingRefreshToken && g.user.get() && g.user.get().refresh_token
            }, d.isRunScoket = function () {
                return h.runScoket
            }, d.socketLogin = function () {
                h.runSocket && c.login(g.token.get(), h.anonymousToken, h.appName, h.socketUrl)
            }, d.on = function (a, b) {
                c.on(a, b)
            }, d.socialSignIn = d.socialSignin, d.socialSignUp = d.socialSignup
        }
        this.getApiUrl = function () {
            return h.apiUrl
        }, this.setApiUrl = function (a) {
            return h.apiUrl = a, this
        }, this.setSocketUrl = function (a) {
            return h.socketUrl = a, this
        }, this.getTokenName = function () {
            return null
        }, this.setTokenName = function () {
            return this
        }, this.setAnonymousToken = function (a) {
            return h.anonymousToken = a, this
        }, this.setSignUpToken = function (a) {
            return h.signUpToken = a, this
        }, this.setAppName = function (a) {
            return h.appName = a, this
        }, this.manageDefaultHeaders = function (a) {
            return this
        }, this.manageHttpInterceptor = function (a) {
            return h.isManagingHttpInterceptor = void 0 == a ? !0 : a, this
        }, this.manageRefreshToken = function (a) {
            return h.isManagingRefreshToken = void 0 == a ? !0 : a, this
        }, this.runSigninAfterSignup = function (a) {
            return h.runSigninAfterSignup = void 0 == a ? !0 : a, this
        }, this.runSocket = function (a) {
            return h.runSocket = void 0 == a ? !1 : a, this
        }, this.$get = ["BackandAuthService", "BackandUserService", "BackandSocketService", function (b, c, d) {
                return new a(b, c, d)
            }]
    }).run(["$injector", function (a) {
            a.invoke(["$http", function (a) {
                    f = a
                }]), a.invoke(["Backand", function (a) {
                    a.socketLogin()
                }])
        }]), angular.module("backand").factory("BackandHttpInterceptor", ["$q", "Backand", "BackandHttpBufferService", "BackandAuthService", b]).config(["$httpProvider", function (a) {
            a.interceptors.push("BackandHttpInterceptor")
        }]), angular.module("backand").service("BackandAuthService", ["$q", "$rootScope", "BackandHttpBufferService", "BackandSocketService", c]), function () {
        function a() {
            function a(a, b) {
                function c(a) {
                    b.resolve(a)
                }
                function d(a) {
                    b.reject(a)
                }
                f(a).then(c, d)
            }
            function b(a) {
                return delete a.headers.Authorization, a
            }
            var c = this, d = [];
            c.append = function (a, b) {
                d.push({config: a, deferred: b})
            }, c.rejectAll = function (a) {
                if (a)
                    for (var b = 0; b < d.length; ++b)
                        d[b].deferred.reject(a);
                d = []
            }, c.retryAll = function () {
                for (var c = 0; c < d.length; ++c)
                    a(b(d[c].config), d[c].deferred);
                d = []
            }
        }
        angular.module("backand").service("BackandHttpBufferService", a)
    }(), angular.module("backand").service("BackandSocketService", ["$rootScope", d]), angular.module("backand").service("BackandUserService", ["$q", e])
}();