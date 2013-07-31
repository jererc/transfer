'use strict';


//
// Main
//
function MainCtrl($rootScope, $scope, $location, rootScopeSvc, apiSvc, eventSvc, utilsSvc) {

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
                    _checkApi(data.apiUrl);
                });
        }
    }

    $rootScope.$on('checkApi', function(event, args) {
        checkApi((!!args) ? args.url : null);
    });

    checkApi();

}


//
// Add modal
//
function AddModalCtrl($rootScope, $scope, apiSvc, eventSvc, utilsSvc) {

    $scope.types = [
        {'name': 'Auto detect', 'value': null},
        {'name': 'Binsearch', 'value': 'binsearch'},
        {'name': 'Torrent', 'value': 'torrent'},
        ];

    function initAddForm() {
        if ($scope.createTransferForm) {
            $scope.createTransferForm.$setPristine();
        }
        if (!$scope.transfer) {
            $scope.transfer = {
                type: $scope.types[0],
            };
        }
    }

    $scope.createTransfer = function() {
        $scope.transfer.type = $scope.transfer.type.value;

        apiSvc.createTransfer($scope.transfer).
            success(function(data) {
                if (data.error) {
                    console.error('failed to create transfer:', data.error);
                } else {
                    eventSvc.emit('updateTransfers');
                    $scope.transfer = undefined;
                }
            });
    };

    $rootScope.$on('openAddModal', function(event, data) {
        initAddForm();
    });

    $scope.$watch('transfer.type', initAddForm);

}


//
// Transfers list
//
function TransferListCtrl($rootScope, $scope, $timeout, $location, apiSvc, eventSvc, utilsSvc) {

    $scope.transfers = [];

    $scope.statusInfo = {
        true: {labelClass: 'label-success'},
        false: {labelClass: 'label-important'},
    };

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
                    utilsSvc.updateList($scope.transfers, data.result);
                    updateTimeout = $timeout(updateTransfers, cacheDelta);
                });
        }
    }

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
        apiSvc.listSettings().
            error(function() {
                $scope.settings = {};
            }).
            success(function(data) {
                $scope.settings = data.result;
            });
    }

    $scope.checkApi = function() {
        $scope.apiUrl = $scope.apiUrl || apiSvc.getUrl();
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
