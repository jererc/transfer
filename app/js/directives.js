'use strict';

(function() {

    var directives = angular.module('transferDirectives', []);

    directives.directive('openAddModal', function(eventSvc) {
        return function(scope, element, attrs) {
            element.click(function() {
                if (!element.hasClass('disabled')) {
                    eventSvc.emit('addModalOpen');
                    if (!scope.$$phase) scope.$apply();
                    $(attrs.openAddModal).modal('show');
                }
            });
        };
    });

    directives.directive('modalFocus', function() {
        return function(scope, element, attrs) {
            element.on('shown', function() {
                $(attrs.modalFocus).focus();
            });
        };
    });

    directives.directive('submitModal', function() {
        return function(scope, element, attrs) {
            var modal = element.parents('.modal');

            element.click(function() {
                scope.$eval(attrs.submitModal);
                modal.modal('hide');
            });

            modal.
                on('shown', function() {
                    modal.keyup(function(e) {
                        if (e.keyCode == 13) {
                            var form = scope[modal.find('form').attr('name')];
                            if (!form.$invalid) {
                                scope.$eval(attrs.submitModal);
                                modal.modal('hide');
                            }
                        }
                    })
                }).
                on('hidden', function() {
                    modal.unbind('keyup');
                });
        };
    });

})();
