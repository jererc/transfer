'use strict';

(function() {

    var filters = angular.module('transferFilters', ['ngResource']);

    filters.filter('ifList', function() {
        return function(input) {
            return angular.isArray(input) ? input.join(', ') : input;
        };
    });

    filters.filter('ifDate', function($filter) {
        return function(input) {
            return !!input ? $filter('date')(input * 1000, 'MMM d yyyy HH:mm') : '';
        };
    });

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

    filters.filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length)) {
                length = 10;
            }
            if (end === undefined) {
                end = '...';
            }
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });

})();
