'use strict';

angular.module('transferApp', ['transferServices', 'transferDirectives', 'transferFilters', 'angularUtils']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {redirectTo: '/transfers'}).
        when('/transfers', {templateUrl: 'partials/transfers-list.html', controller: TransfersListCtrl}).
        when('/settings', {templateUrl: 'partials/settings-list.html', controller: SettingsListCtrl}).
        otherwise({redirectTo: '/'});
}]);