'use strict';

(function() {

    var services = angular.module('transferServices', ['ngResource', 'ngCookies']);

    services.service('apiSvc', function($http, $cookieStore) {

        this.getSettingsUrl = function() {
            return $http.get('local_settings.json');
        };

        this.getUrl = function() {
            return $cookieStore.get('transferApiUrl');
        };

        this.setUrl = function(url) {
            $cookieStore.put('transferApiUrl', url);
        };

        this.checkUrl = function(url) {
            return $http.get(url + '/status');
        };

        // Transfers
        this.createTransfer = function(data) {
            return $http.post(this.getUrl() + '/transfers/create', data);
        };

        this.listTransfers = function() {
            return $http.get(this.getUrl() + '/transfers/list');
        };

        this.removeTransfer = function(id) {
            return $http.post(this.getUrl() + '/transfers/remove',
                {id: id});
        };

        // Settings
        this.listSettings = function() {
            return $http.get(this.getUrl() + '/settings/list');
        };

        this.updateSettings = function(data) {
            return $http.post(this.getUrl() + '/settings/update', data);
        };

    });

})();
