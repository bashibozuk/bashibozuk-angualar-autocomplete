/**
 * Created by vasil on 11.08.16.
 */

angular.module('bbzAutocomplete', [])
    .directive('bbzAutocomplete', function($http) {
        return {
            scope: {
                field: '@field',
                url: '@url',
                minLen: '@minLen',
                callback: '&callback',
                selectedField: '@selectedField',
                data: '=data'
            },
            template: '<span class="bbz-autocomplete-wrapper">' +
                '<input class="form-control" ng-model="selection" ng-keyup="onInput()"> ' +
                '<ul class="bbz-sugestions-wrapper list-group">' +
                    '<li ng-repeat="suggestion in suggestions" ng-click="onSelect(suggestion)" class="list-group-item">' +
                        '<span ng-if="field">{{suggestion[field]}}</span>' +
                        '<span ng-if="!field">{{suggestion}}</span>' +
                    '</li>' +
                '</ul>' +
            '</span>',
            controller: function ($scope) {
                $scope.suggestions = [];

                $scope.onInput = function () {
                    if ($scope.minLen && $scope.selection.length < $scope.minLen) {
                        return;
                    }

                    var url = $scope.url;
                    if (url.indexOf('?') == -1) {
                        url += '?';
                    }

                    var ampPos = url.lastIndexOf('&');
                    if (ampPos > -1 && ampPos < url.length -1) {
                        url += '&';
                    }

                    url += 'q=' + $scope.selection;
                    $http.get(url).then(function (response) {
                        $scope.suggestions.splice(0, $scope.suggestions.length);
                        for (var i = 0; i < response.data.length; i++) {
                            $scope.suggestions.push(response.data[i]);
                        }
                    })
                };

                $scope.onSelect = function (data) {

                    $scope.selection = $scope.selectedField ? data[$scope.selectedField]: data;
                    $scope.data =  data;
                    $scope.suggestions.splice(0, $scope.suggestions.length);

                }
            }
        }
    });