var mimicry = mimicry || {};

mimicry.composer = (function() {

  var _langSpec = null;


  var getProbabilities = function(srcArr) {
    var i = 0, l = srcArr.length - 1, sum = 0, probArr = [];
    for (i; i < l; i++) {
      sum += (srcArr[i].prob / 100.0);
      probArr[i] = sum;
    }
    return probArr;
  };


  var getPossibility = function(possibilities, probabilities) {
    var i = 0, r = Math.random();
    for (i; i < probabilities.length && r >= probabilities[i]; i++);
    return possibilities[i];
  };


  var getItem = function(srcArr) {
    return getPossibility(srcArr, getProbabilities(srcArr));
  };


  var getChar = function(chars, prevChar) {
    var i, l, probabilities, prevCharNext, char = '?';
    for (i = 0, l = _langSpec.chars.length; i < l; i++) {
      if (_langSpec.chars[i].char === prevChar) {
        prevCharNext = _langSpec.chars[i].next;
        break;
      }
    }
    return prevCharNext && prevCharNext.length ? getItem(prevCharNext).char : '';
  };


  var getWord = function() {
    var i = 0, wordData = getItem(_langSpec.wordSpec), l = wordData.wordLength - 1,
      word = getItem(wordData.startChars).char, char = word;
    for (i; i < l; i++) {
      char = getChar(_langSpec.chars, char);
      word += char;
    }
    return word;
  };


  var getParagraph = function(length) {
    var i = 0, p = '';
    for (i; i < length; i++) {
      p += getWord() + ' ';
    }
    return p.trim();
  };


  var registerLanguage = function(langSpec) {
    _langSpec = langSpec;
    return _methods;
  };


  var _methods = {
    registerLanguage: registerLanguage,
    getParagraph: getParagraph,
    getWord: getWord
  };


  return _methods;

}());
