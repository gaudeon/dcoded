// namespace
var DCoded = DCoded || {};

DCoded.Caesar = (function () {
    "use strict";

    var fn = function () {
    };

    var LETTERS      = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var LETTER_COUNT = LETTERS.length;

    function validate_shift (shift) {
        return Math.abs(shift || 13);
    }

    function validate_text (text) {
        return text.toUpperCase();
    }

    function shift_letter (letter) {
        if (LETTERS.indexOf(letter) < 0) return letter;
        return LETTERS[ (LETTERS.indexOf(letter) + this.shift + LETTER_COUNT) % LETTER_COUNT ];
    }

    fn.encode = function (text, shift) {
        shift = validate_shift(shift);
        text  = validate_text(text);

        return text.split('').map(shift_letter, {shift: shift}).join('');
    };

    fn.decode = function (text, shift) {
        shift = validate_shift(shift);
        text  = validate_text(text);

        return text.split('').map(shift_letter, {shift: -shift}).join('');
    };

    return fn;
})();
