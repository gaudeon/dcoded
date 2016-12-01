// namespace
var DCoded = DCoded || {};

DCoded.LetterPrefab = (function () {
    "use strict";

    var Letter = function (game, x, y, text, options, group) {
        if("object" != typeof(game) || "number" != typeof(x) || "number" != typeof(y) || "string" != typeof(text)) {
            return;
        }

        this.__uid = _.uniqueId('letter_');

        Phaser.Group.call(this, game, null, this.__uid); // call our parents constructor

        this.__config     = this.game.cache.getJSON('letterConfig');
        this.__textString = text.substring(0,1).toUpperCase(); // only one letter and uppercase

        // letter options
        this.__options                  = "object" === typeof(options) ? options : {};
        this.__options.flagNoInputField = this.__text == '' ? true : "boolean" != typeof(this.__options.flagNoInputField) ? false : this.__options.flagNoInputField;

        // text sprite
        this.game.add.text(x, y, this.__textString, this.__config.textStyle, this);

        // input field (optional but displayed by default)
        if (!this.__options.flagNoInputField) {
            var inputStyle = Object.create(this.__config.inputStyle); // clone the inputStyle so we are not passing the same reference each time
            inputStyle.width = this.__config.letter_width;
            inputStyle.placeHolder = this.__textString;
            inputStyle.onKeyUp = this.handleKeyUp.bind(this);

            this.game.add.inputField(x, y + this.height, inputStyle, this);
        }
    };

    Letter.prototype             = Object.create(Phaser.Group.prototype);
    Letter.prototype.constructor = Letter;

    Letter.prototype.TEXT_INDEX  = 0;
    Letter.prototype.INPUT_INDEX = 1;

    Letter.prototype.getUID = function() {
            return this.__uid;
    };

    Letter.prototype.getTextString = function() {
        return this.__textString;
    };

    Letter.prototype.hasTextSprite = function() {
        return this.getAt(this.TEXT_INDEX) != -1;
    };

    Letter.prototype.getTextSprite = function() {
        return this.hasTextSprite() ? this.getAt(this.TEXT_INDEX) : null;
    };

    Letter.prototype.hasInputField = function() {
        return this.getAt(this.INPUT_INDEX) != -1;
    };

    Letter.prototype.getInputField = function() {
        return this.hasTextSprite() ? this.getAt(this.INPUT_INDEX) : null;
    };

    Letter.prototype.getOptions = function() {
        return this.__options;
    };

    Letter.prototype.focus = function() {
        if (this.hasInputField()) {
            this.getInputField().startFocus();
        }
    };

    Letter.prototype.handleKeyUp = function(ev,el) {
        if(ev.key.match(/^[a-zA-Z]$/)) {
            el.setText(ev.key.toUpperCase());
        }
        else {
            el.setText('');
        }

        if ("function" === typeof(this.__options.onKeyUp)) {
            this.__options.onKeyUp(ev,el,this);
        }
    };

    Letter.prototype.setInputText = function(text) {
        if (this.getInputField()) {
            if("string" === typeof(text) && text.match(/^[a-zA-Z]$/)) {
                this.getInputField().setText(text.toUpperCase());
            }
            else {
                this.getInputField().setText('');
            }
        }
    };

    Letter.prototype.getInputText = function() {
        this.getInputField().value;
    };

    return Letter;
})();
