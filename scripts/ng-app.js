var mimicryApp = angular.module('mimicryApp', ['ngAnimate']);


mimicryApp.factory('languageData', ['$http', function($http) {

  var cache = {};

  return function(langId) {
    if (!cache.hasOwnProperty(langId)) {
      cache[langId] = $http.get('../language-data/data-' + langId + '.json').success;
    }
    return cache[langId];
  };

}]);


mimicryApp.controller('userInput', ['languageData', '$scope', '$rootScope', function(languageData, $scope, $rootScope) {

  $scope.langId = 'fi';

  $scope.getParagraphs = function(howMany) {
    languageData($scope.langId)(function(data) {
      $rootScope.paragraphs = mimicry.composer.registerLanguage(data).getParagraphs(howMany);
    });
  };

}]);


mimicryApp.controller('paragraphList', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.paragraphs = [];

  $rootScope.$watch('paragraphs', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.paragraphs = newValue;
    }
  });

}]);
