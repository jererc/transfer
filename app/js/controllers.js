'use strict';


//
// Main
//
function MainCtrl($rootScope, $scope, $location, apiSvc, eventSvc, utilsSvc) {

    $rootScope.apiStatus = false;

    function _checkApi(url) {
        apiSvc.checkUrl(url).
            error(function() {
                $rootScope.apiStatus = false;
                $location.path('settings');
            }).
            success(function(data) {
                $rootScope.apiStatus = (data.result == 'transfer');
                if ($rootScope.apiStatus) {
                    apiSvc.setUrl(url);
                    eventSvc.emit('getSettings');
                } else {
                    $location.path('settings');
                }
            });
    }

    function checkApi(url) {
        url = url || apiSvc.getUrl();
        if (url) {
            _checkApi(url);
        } else {
            apiSvc.getSettingsUrl().
                success(function(data) {
                    url = data.apiUrl || url;
                    _checkApi(url);
                });
        }
    }

    $rootScope.isMenuActive = function(path) {
        if ($location.path().substr(0, path.length) == path) {
            return 'active';
        }
        return '';
    };

    $rootScope.inArray = function(value, array) {
        if (!array) {
            return -1;
        }
        return utilsSvc.getIndex(value, array) != -1;
    };

    $rootScope.exists = function(val) {
        if (angular.isArray(val)) {
            return !!val.length;
        }
        return !!val;
    };

    $rootScope.$on('checkApi', function(event, args) {
        checkApi((!!args) ? args.url : null);
    });

    checkApi();

}


//
// Add modal
//
function AddModalCtrl($rootScope, $scope, apiSvc, eventSvc, utilsSvc) {

    $scope.transfer = {};
    $scope.types = [
        {'name': 'Auto', 'value': null},
        {'name': 'Torrent', 'value': 'torrent'},
        ];

    function initAddForm() {
        if ($scope.createTransferForm) {
            $scope.createTransferForm.$setPristine();
        }
        $scope.transfer = {
            type: $scope.transfer.type || $scope.types[0],
        };
    }

    $scope.createTransfer = function() {
        $scope.transfer.type = $scope.transfer.type.value;
        apiSvc.createTransfer($scope.transfer).
            success(function(data) {
                if (data.error) {
                    console.error('failed to create transfer:', data.error);
                } else {
                    eventSvc.emit('updateTransfers');
                }
            });
    };

    $rootScope.$on('addModalOpen', function(event, data) {
        initAddForm();
    });

    $scope.$watch('transfer.type', initAddForm);

}


//
// Transfers list
//
function TransfersListCtrl($rootScope, $scope, $timeout, $location, apiSvc, eventSvc, utilsSvc) {

    $scope.transfers = [];

    var active = true;
    var cacheDelta = 5000;
    var updateTimeout;

    function updateTransfers(force) {
        $timeout.cancel(updateTimeout);
        if (!active) {
            return false;
        }
        if (!utilsSvc.focus && !force) {
            updateTimeout = $timeout(updateTransfers, cacheDelta);
        } else {
            apiSvc.listTransfers().
                error(function() {
                    updateTimeout = $timeout(updateTransfers, cacheDelta);
                    $location.path('settings');
                }).
                success(function(data) {
                    utilsSvc.updateList($scope.transfers, data.result, '_id');
                    updateTimeout = $timeout(updateTransfers, cacheDelta);
                });
        }
    }

    $scope.getStatusClass = function(transfer) {
        switch (!!transfer.error) {
            case true:
                return 'label-warning';
                break;
            default:
                return 'label-success';
                break;
        }
    };

    $scope.removeTransfer = function(id) {
        apiSvc.removeTransfer(id).
            success(function(data) {
                if (data.error) {
                    console.error('failed to remove transfer:', data.error);
                }
                updateTransfers(true);
            });
    };

    $rootScope.$on('updateTransfers', function() {
        updateTransfers(true);
    });

    $scope.$on('$destroy', function() {
        active = false;
    });

    updateTransfers();

}


//
// Settings list
//
function SettingsListCtrl($rootScope, $scope, apiSvc, eventSvc, utilsSvc) {

    $scope.settings = {};

    function getSettings() {
        $scope.apiUrl = apiSvc.getUrl();
        apiSvc.listSettings().
            error(function() {
                $scope.settings = {};
            }).
            success(function(data) {
                $scope.settings = data.result;
            });
    }

    $scope.checkApi = function() {
        eventSvc.emit('checkApi', {url: $scope.apiUrl});
    };

    $scope.updateSettings = function() {
        apiSvc.updateSettings($scope.settings).
            success(function(data) {
                if (data.error) {
                    console.error('failed to update settings:', data.error);
                } else {
                    getSettings();
                }
            });
    };

    $scope.$on('getSettings', getSettings);

    $scope.checkApi();

}
