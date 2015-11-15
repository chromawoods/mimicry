var mimicryApp = angular.module('mimicryApp', ['ngAnimate']);


mimicryApp.factory('LanguageData', ['$http', function($http) {

  var cache = {};

  return function(langId) {
    if (!cache.hasOwnProperty(langId)) {
      cache[langId] = $http.get('../language-data/data-' + langId + '.json').success;
    }
    return cache[langId];
  };

}]);


mimicryApp.controller('UserInput', ['LanguageData', '$scope', '$rootScope', function(LanguageData, $scope, $rootScope) {

  $scope.langId = 'en';

  $scope.getParagraphs = function(howMany) {
    LanguageData($scope.langId)(function(data) {
      $rootScope.paragraphs = mimicry.composer.registerLanguage(data).getParagraphs(howMany);
    });
  };

}]);


mimicryApp.controller('ParagraphList', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.paragraphs = [];

  $rootScope.$watch('paragraphs', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.paragraphs = newValue;
    }
  });

}]);
