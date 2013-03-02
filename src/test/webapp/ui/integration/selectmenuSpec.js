describe("selectmenu", function () {
    describe('non native menus and popups', function () {
        var dialogOpen, scope;

        uit.url('../ui/fixtures/test-fixture.html');
        uit.append(function($) {
            var page = $('#start');
            page.append(
                '<div data-role="content" ng-init="mysel=\'v1\'">' +
                    '<select ng-model="mysel" id="mysel" data-native-menu="false"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                    '</div>');
        });

        beforeEach(function() {
            uit.runs(function ($, window) {
                var page = $("#start");
                var select = page.find("#mysel");
                expect(select[0].value).toEqual("v1");
                scope = select.scope();
                expect(scope.mysel).toEqual("v1");
                dialogOpen = function () {
                    return select.data('selectmenu').isOpen;
                };
                expect(dialogOpen()).toBeFalsy();
                // find the menu and click on the second entry
                var oldHeight = $.fn.height;
                $.fn.height = function () {
                    if (this[0].window == window) {
                        return 10;
                    }
                    return oldHeight.apply(this, arguments);
                };
                select.selectmenu('open');
            });
            waitsFor(function () {
                return dialogOpen();
            });
        });
        it('should save the ui value into the model', function () {
            uit.runs(function ($) {
                var dialog = $(".ui-dialog");
                dialog.find('li a').eq(1).trigger('click');
                expect(scope.mysel).toEqual("v2");
                expect(dialogOpen()).toBe(false);
                expect($.mobile.activePage.attr('id')).toBe('start');
            });
        });

        it('should close the popup when the cancel button is hit', function () {
            uit.runs(function ($) {
                var dialog = $(".ui-dialog");
                dialog.find(':jqmData(role="header") a').trigger('click');
                expect(scope.mysel).toEqual("v1");
                expect($.mobile.activePage.attr('id')).toBe('start');
            });
        });

    });


});
