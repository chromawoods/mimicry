var mimicry = mimicry || {};

mimicry.creator = (function() {


  var processRawText = function(text) {
    return text;
  };


  var getLanguageData = function(rawText) {
    return processRawText(rawText);
  };


  return {
    getLanguageData: getLanguageData
  };

}());
