var mimicry = mimicry || {};

mimicry.composer = (function() {

  var CONSTANTS = {
    sentancesPerParagraph: 8,
    sentanceMinWords: 4,
    sentanceMaxWords: 8
  };

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


  var getWord = function(capitalize) {
    var i = 0, wordData = getItem(_langSpec.wordSpec), l = wordData.wordLength - 1,
      word = getItem(wordData.startChars).char, char = word;
    for (i; i < l; i++) {
      char = getChar(_langSpec.chars, char);
      word += char;
    }
    return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  };


  var getSentance = function(numWords) {
    var i = 0, p = '';
    for (i; i < numWords; i++) {
      p += getWord(i === 0) + ' ';
    }
    return p.trim() + '. ';
  };


  var getParagraphs = function(howMany) {
    var i = 0, j, p = '', ps = [];
    howMany = howMany || CONSTANTS.sentancesPerParagraph;
    for (i; i < howMany; i++) {
      p = '';
      for (j = 0; j < CONSTANTS.sentancesPerParagraph; j++) {
        p += getSentance(Math.floor(Math.random() * (CONSTANTS.sentanceMaxWords - CONSTANTS.sentanceMinWords + 1)) + CONSTANTS.sentanceMinWords);
      }
      ps.push(p.trim());
    }
    return ps;
  };


  var registerLanguage = function(langSpec) {
    _langSpec = langSpec;
    return _methods;
  };


  var _methods = {
    registerLanguage: registerLanguage,
    getParagraphs: getParagraphs,
    getWord: getWord
  };


  return _methods;

}());
