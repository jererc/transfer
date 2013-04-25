'use strict';

(function() {

    var filters = angular.module('transferFilters', []);

    filters.filter('size', function() {
        return function(input) {
            return (!!input) ? Math.floor(input / 1024 / 1024) : 'N/A';
        };
    });

    filters.filter('transferRate', function() {
        return function(input) {
            return (!!input) ? Math.floor(input / 1024) : 'N/A';
        };
    });

    filters.filter('progress', function() {
        return function(input) {
            return (!!input) ? Math.round(input) : 'N/A';
        };
    });

})();
