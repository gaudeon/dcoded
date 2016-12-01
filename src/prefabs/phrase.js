// namespace
var DCoded = DCoded || {};

DCoded.PhrasePrefab = (function () {
    "use strict";

    var Phrase = function (game, text) {
        if("object" != typeof(game)) {
            throw "game object required.";
        }

        Phaser.Group.call(this, game); // call our parents constructor

        this.onKeyUp = new Phaser.Signal();

        if (text) {
            this.set(text);
            this.focusAt(0);
        }
    };

    Phrase.prototype = Object.create(Phaser.Group.prototype);
    Phrase.prototype.constructor = Phrase;

    Phrase.prototype.set = function(text, options) {
        this.removeAll(true);

        this.text = text;

        var start_x = 5;
        var x = start_x;
        var y = 5;
        var letter_config = this.game.cache.getJSON('letterConfig');
        var letter_width = letter_config.letter_width + 5;
        var letter_height = (letter_config.letter_height * 2 + 20);

        _.each(DCoded.Caesar.encode(text).split(''), (function(ltr, index) {
            var no_input_field = ltr.match(/[a-zA-Z]/) ? false : true;
            var letter = new DCoded.LetterPrefab(this.game, x, y, ltr, {
                "flagNoInputField": no_input_field,
                "groupIndex": index,
                "onKeyUp": (function(ev, el, current_letter) {
                    this.clearUnrelatedLetters(ev.key, current_letter); // If selected letter used by a different set of letters, clear it
                    this.updateRelatedLetters(ev.key, current_letter); // Update related set of letters to have same text as just inputted
                    this.focusOnNextLetter(current_letter); // Move to the next input field
                    this.onKeyUp.dispatch(ev);
                }).bind(this)
            });

            this.add(letter);

            x += letter_width;

            if (x + letter_width > this.game.world.width) {
                x = start_x;
                y += letter_height;
            }
        }).bind(this));
    };

    Phrase.prototype.getLettersWithInputs = function() {
        return _.filter(this.children, function(o) { return o.hasInputField(); });
    };

    Phrase.prototype.getLettersWithoutInputs = function() {
        return _.filter(this.children, function(o) { return ! o.hasInputField(); });
    };

    Phrase.prototype.hasEmptyFields = function() {
        var count = _.reduce(this.getLettersWithInputs(), function (count, o) {
            return (o.getInputField().value || '') == '' ? count + 1 : count;
        }, 0);

        return count > 0 ? true : false;
    };

    Phrase.prototype.updateRelatedLetters = function(text, letter) {
        _.each(this.getLettersWithInputs(), function(ltr) {
            if (letter.getTextString() === ltr.getTextString()) {
                ltr.setInputText(text);
            }
        });
    };

    Phrase.prototype.clearUnrelatedLetters = function(text, letter) {
        _.each(this.getLettersWithInputs(), function(ltr) {
            if (letter.getTextString() !== ltr.getTextString() && ((ltr.getInputField().value || '') === text.toUpperCase())) {
                ltr.setInputText('');
            }
        });
    };

    Phrase.prototype.focusOnNextLetter = function(letter) {
        var next       = letter.getOptions().groupIndex;
        var bail_max   = this.children.length,
            bail_count = 0;

        while(++bail_count <= bail_max) {
            next += 1;
            if (next >= this.length) {
                next = 0;
            }

            // make sure we have an input field to focus on
            var next_child = this.getAt(next);
            if (next_child.hasInputField() && (!this.hasEmptyFields() || (next_child.getInputField().value || '') == '')) {
                break;
            }
        }

        this.focusAt(next);
    };

    Phrase.prototype.focusAt = function(index) {
        var letter = this.getAt(index);

        if ("object" === typeof(letter)) {
            letter.focus();
        }
    };

    return Phrase;
})();
