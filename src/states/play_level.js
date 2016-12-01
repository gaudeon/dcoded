// namespace
var DCoded = DCoded || {};

DCoded.PlayLevelState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
        this.letters = [];

        this.quotes = this.game.cache.getJSON('quotes');
    };

    fn.prototype.preload = function () {
    };

    fn.prototype.create = function () {
        var rdg = new Phaser.RandomDataGenerator([new Date().getTime()]);

        var quote = rdg.pick(this.quotes);

        this.phrase = new DCoded.PhrasePrefab(game, quote);
        this.phrase.onKeyUp.add(function() { console.log(arguments); }, this);
    };

    return fn;
})();
