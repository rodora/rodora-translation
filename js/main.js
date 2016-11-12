$(function () {
    function setUnit(unit) {}

    function getUnit() {
        var unit = {};
        return unit;
    }

    function getApi(operate) {
        return 'http://nodejs-rodora.rhcloud.com/' + operate;
    }

    function initRouter() {
        var AppRouter = Backbone.Router.extend({
            routes: {
                "unit/id/:id": "unitDetailRoute",
                "unit/gid/:gid": "unitDetailByGIdRoute",
                "random": "randomRoute",
                '*path': 'defaultRoute'
            },
            defaultRoute: function () {
                app_router.navigate("random", {
                    trigger: true
                });
            }
        });
        // Initiate the router
        var app_router = new AppRouter;

        app_router.on('route:unitDetailRoute', function (id) {
            $.get({
                    url: getApi('unit'),
                    data: {
                        id: id
                    },
                    dataType: 'json'
                })
                .done(function (unit) {
                    setunit(unit);
                });
        });
        app_router.on('route:unitDetailByGIdRoute', function (gid) {
            $.get({
                    url: getApi('unit'),
                    data: {
                        gid: gid
                    },
                    dataType: 'json'
                })
                .done(function (unit) {
                    setunit(unit);
                });
        });
        app_router.on('route:randomRoute', function (lang) {
            $.get({
                    url: getApi('random')
                })
                .done(function (id) {
                    app_router.navigate("unit/id/" + id);
                });

            //location.reload();
        });

        Backbone.history.start();
    }

    var init = function () {
        initRouter();
    }();
});