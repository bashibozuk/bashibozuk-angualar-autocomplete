/**
 * Created by vasil on 11.08.16.
 */

angular.module('bbzAutocomplete', [])
    .directive('bbzAutocomplete', function($http, $timeout) {

        var ARROW_DOWN_KEY = 40;
        var ARROW_UP_KEY = 38;
        var ENTER_KEY = 13;

        return {
            scope: {
                field: '@field',
                url: '@url',
                minLen: '@minLen',
                data: '=',
                selection: '='
            },
            template: '<span class="bbz-autocomplete-wrapper">' +
            '<input class="form-control" ng-model="selection" ng-keyup="onInput()" ng-blur="onBlur()" ng-keydown="onKeyDown($event)" placeholder="Type For Suggestions"> ' +
            '<ul class="bbz-sugestions-wrapper list-group">' +
            '<li ng-repeat="suggestion in suggestions" ng-click="onSelect(suggestion)" class="list-group-item" ng-class="{active: $index === selectedIndex}">' +
            '<span ng-if="field">{{suggestion[field]}}</span>' +
            '<span ng-if="!field">{{suggestion}}</span>' +
            '</li>' +
            '</ul>' +
            '</span>',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var $list = $(element).find('.bbz-sugestions-wrapper');
                    $list.css('width', $(element).find('input').width() + 'px');
                }, 10);
                scope.attributes = attrs;
                console.log(attrs, scope);
            },
            controller: function ($scope) {

                $scope.selectedIndex = null;
                $scope.suggestions = [];
                $scope.lastInput = null;

                $scope.isSelected = false;
                $scope.onInput = function () {
                    if ($scope.minLen && $scope.selection.length < $scope.minLen) {
                        return;
                    }

                    if ($scope.isSelected) {
                        $scope.isSelected = false;
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

                    if ($scope.lastInput == url) {
                        return;
                    }

                    $scope.lastInput = url;

                    $http.get(url).then(function (response) {
                        $scope.suggestions.splice(0, $scope.suggestions.length);
                        for (var i = 0; i < response.data.length; i++) {
                            $scope.suggestions.push(response.data[i]);
                        }

                        $scope.selectedIndex = null;
                    })
                };

                $scope.onSelect = function (data) {
                    $scope.selection = $scope.field ? data[$scope.field]: data;
                    if (typeof $scope.attributes.data !== 'undefined') {
                        $scope.data =  data;
                    }
                    $scope.suggestions.splice(0, $scope.suggestions.length);
                    $scope.selectedIndex = null;
                };

                $scope.onBlur = function () {
                    $timeout(function () {
                        $scope.suggestions = [];
                        $scope.$digest();
                        $scope.selectedIndex = null;
                    }, 300);


                };

                $scope.onKeyDown = function ($event) {
                    if ($event.keyCode == ARROW_DOWN_KEY || $event.keyCode == ARROW_UP_KEY) {
                        handleArrow($event)
                    }

                    if ($event.keyCode == ENTER_KEY) {
                        handleEnter();
                    }
                }

                function handleArrow(event) {

                    var extra = event.keyCode == ARROW_DOWN_KEY ? 1 : -1 ;

                    if (!$scope.suggestions || !$scope.suggestions.length) {
                        return;
                    }

                    if ($scope.selectedIndex === null || $scope.selectedIndex == $scope.suggestions.length - 1 &&
                        event.keyCode == ARROW_DOWN_KEY) {
                        $scope.selectedIndex = 0;
                        return;
                    }

                    if ($scope.selectedIndex === null || $scope.selectedIndex == 0  &&
                        event.keyCode == ARROW_UP_KEY) {
                        $scope.selectedIndex = $scope.suggestions.length - 1;
                        return;
                    }


                    $scope.selectedIndex += extra;
                }

                function handleEnter() {
                    if ($scope.selectedIndex === null) {
                        return
                    }

                    var data = $scope.suggestions[$scope.selectedIndex];
                    if (data) {
                        $scope.onSelect(data);
                        $scope.isSelected = true;
                    }
                }
            }
        }
    });