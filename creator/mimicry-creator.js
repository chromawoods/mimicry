var mimicry = mimicry || {};

mimicry.creator = (function() {


  var CONSTANTS = {
    minWordLength: 2,
    maxWordLength: 32,
    alphabets: {
      en: 'abcdefghijklmnopqrstuvwxyz',
      fi: 'abcdefghijklmnopqrstuvwxyzäö',
      se: 'abcdefghijklmnopqrstuvwxyzåäö'
    }
  };


  var setProbabilities = function(arr) {
    var sum = 0;
    arr.forEach(function(item) {
      sum += item.count;
    });
    arr.forEach(function(item) {
      item.prob = (item.count / sum) * 100;
    });
    return arr;
  };


  var calculateProbabilities = function(langData) {
    langData.wordSpec = setProbabilities(langData.wordSpec);
    langData.wordSpec.forEach(function(wordSpec) {
      wordSpec.startChars = setProbabilities(wordSpec.startChars);
    });
    langData.chars.forEach(function(charData) {
      charData.next = setProbabilities(charData.next);
    });
    return langData;
  };


  var processChar = function(char, langData, prevChar) {

    var charAdded = false;

    langData.chars.forEach(function(charData) {
      var nextCharAdded = false;

      if (charData.char === char) {
        charAdded = true;
      }

      if (prevChar === charData.char) {
        charData.next.forEach(function(nextChar) {
          if (nextChar.char === char) {
            nextChar.count += 1;
            nextCharAdded = true;
          }
        });
        if (!nextCharAdded) {
          charData.next.push({
            char: char,
            count: 1
          });
        }
      }
    });

    if (!charAdded) {
      langData.chars.push({
        char: char,
        next: []
      });
    }

    return langData;
  };


  var processWord = function(word, langData) {

    var wordSpecAdded = false,
      firstChar = word[0],
      prevChar = null;

    langData.wordSpec.forEach(function(spec) {

      var startCharAdded = false;

      if (spec.wordLength === word.length) {

        spec.startChars.forEach(function(startChar) {
          if (startChar.char === firstChar) {
            startChar.count += 1;
            startCharAdded = true;
          }
        });

        if (!startCharAdded) {
          spec.startChars.push({ char: firstChar, count: 1 });
        }

        spec.count += 1;
        wordSpecAdded = true;
      }
    });

    if (!wordSpecAdded) {
      langData.wordSpec.push({
        wordLength: word.length,
        count: 1,
        startChars: [{ char: firstChar, count: 1 }]
      });
    }

    word.split('').forEach(function(char) {
      if (char) {
        langData = processChar(char, langData, prevChar);
        prevChar = char;
      }
    });

    return langData;
  };


  var processRawText = function(text, langData) {

    var filteredText = '';

    text.split('').forEach(function(char) {
      if (_alphabet.indexOf(char) >= 0 || char === ' ') {
        filteredText += char;
      }
    });

    filteredText.split(' ').forEach(function(word) {
      if (word.length && word.length >= CONSTANTS.minWordLength && word.length <= CONSTANTS.maxWordLength) {
        langData = processWord(word, langData);
      }
    });

    return calculateProbabilities(langData);
  };


  var getLanguageData = function(rawText, alphabet) {
    _alphabet = alphabet ? CONSTANTS.alphabets[alphabet] : CONSTANTS.alphabets.en;
    return processRawText(rawText.toLowerCase(), {
      wordSpec: [],
      chars: []
    });
  };


  return {
    getAlphabets: function() { return CONSTANTS.alphabets; },
    getLanguageData: getLanguageData
  };

}());
