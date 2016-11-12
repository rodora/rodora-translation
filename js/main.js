$(function () {

    var formatStory = function (story) {
        return formatRichText(story);
    };
    var formatRichText = function (richText) {
        return richText.replace(/(?:\r\n|\r|\n|\\n)/g, "<br/>").replace(/\[-\]/g, "</span>").replace(/\[([A-Za-z0-9]{6})\]/g, "<span style='color:#$1'>");
    };

    function setUnit(unit) {
        $('#story').tab('show');

        $('#txtID').val(unit.id);
        $('#txtGID').val(unit.gId);
        $('#icon').attr("src", getIcon(unit.gId));

        $('#divNameJP').text(unit.name);
        $('#txtName').val(unit.name);

        $('#divStoryJP').html(formatStory(unit.story));
        $('#txtStory').val(unit.story);

        $('#divCutinJP').empty();
        $('#txtCutin').val("");
        $.each(unit.cutin, function (i, o) {
            $('#divCutinJP').append($("<li>").text(o));
        });

        if (unit.accessory) {
            $('#tabHeaderAccessory').show();
            $('#divAccessoryNameJP').text(unit.accessory.name);
            $('#txtAccessoryName').val(unit.accessory.name);
            $('#divAccessoryDetailJP').html(formatStory(unit.accessory.detail));
            $('#txtAccessoryDetail').val(unit.accessory.detail);
        } else {
            $('#tabHeaderAccessory').hide();
        }

    }

    function getUnit() {
        return {
            id: $('#txtID').val(),
            gId: $('#txtGID').val(),
            name: $('#txtName').val(),
            story: $('#txtStory').val(),
            cutin: $('#txtCutin').val().split("\n"),
            accessory: {
                name: $('#txtAccessoryName').val(),
                detail: $('#txtAccessoryDetail').val()
            }
        };
    }

    function getApi(operate) {
        return 'https://nodejs-rodora.rhcloud.com/' + operate;
    }

    function getIcon(gId) {
        return 'https://rodora.github.io/img/Icon/I' + gId + '.png'
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
            $.get(getApi('unit/id/' + id))
                .done(function (unit) {
                    setUnit(unit);
                });
        });
        app_router.on('route:unitDetailByGIdRoute', function (gid) {
            $.get(getApi('unit/gid/' + gid))
                .done(function (unit) {
                    setUnit(unit);
                });
        });
        app_router.on('route:randomRoute', function (lang) {
            $.get(getApi('random'))
                .done(function (unit) {
                    app_router.navigate("unit/id/" + unit.id);
                    setUnit(unit);
                });
        });

        Backbone.history.start();
    }

    function initControl() {
        $('#txtStory').change(function (event) {
            $('#divStoryJP').html(formatStory($('#txtStory').val()));
        });

        $('#btnSubmit').click(function () {
            $.post(getApi('submit'), {
                    data: JSON.stringify(getUnit())
                })
                .done(function (unit) {
                    location.href = "#random";
                });
        });
    }

    var init = function () {
        $(document).ajaxStart(function () {
            NProgress.start()
        });
        $(document).ajaxComplete(function () {
            NProgress.done()
        });
        initRouter();
        initControl();
    }();
});