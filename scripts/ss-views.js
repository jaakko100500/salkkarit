var Salkkarit = Salkkarit || {};
Salkkarit.Views = Salkkarit.Views || {};

Salkkarit.Views.SoundView = Backbone.Marionette.ItemView.extend({
    template: '#sound-button-template',
    className: 'sound-button',
    events: {
        'click button': 'playSound'
    },
    playSound: function() {
        var manifest = [{
            id: this.model.get('key'),
            src: this.model.get('path')
        }];

        var self = this;

        var startPlaying = function() {
            createjs.Sound.play(self.model.get('key'));
            createjs.Sound.removeEventListener('fileload', startPlaying);
        }

        createjs.Sound.addEventListener("fileload", startPlaying);
        createjs.Sound.registerManifest(manifest, "");
    }
});

Salkkarit.Views.SoundsView = Backbone.Marionette.CollectionView.extend({
    childView: Salkkarit.Views.SoundView
});

Salkkarit.Views.PlayerView = Backbone.Marionette.ItemView.extend({
    initialize: function(options) {
        this.sounds = _.values(Salkkarit.Models.soundKeyMap);
    },
    onRender: function() {
        var soundKeys = $.url().param('soundKeys')
        var selectedSounds = [];
        if (soundKeys) {
            selectedSounds = _.map(soundKeys.split(","), function(soundKey) {
                return {
                    id: soundKey,
                    name: Salkkarit.Models.soundKeyMap[soundKey].get('name')
                }
            });
        }

        this.$(".input-soundkeys").tokenInput(_.map(this.sounds, function(item) {
            return {
                id: item.get('key'),
                name: item.get('name')
            }
        }), {
            prePopulate: selectedSounds
        });

        if ($.url().param('play')) {
            this.playSounds();
        }

    },
    template: '#player-template',
    events: {
        'click .btn-play': 'playSounds',
        'click .btn-generate-url': 'generateUrl'
    },
    generateUrl: function() {
        var ids = _.pluck(this.$(".input-soundkeys").tokenInput("get"), "id");

        this.$(".span-url").text("index.html?soundKeys=" + ids.join() + "&play=true");
    },
    playSounds: function() {
        var $input = this.$("input");
        var $playButton = this.$(".btn-play");

        var soundKeys = _.pluck(this.$(".input-soundkeys").tokenInput("get"), "id");

        var playedSounds = _.map(soundKeys, function(id) {
            return {
                id: id,
                src: Salkkarit.Models.soundKeyMap[id].get('path')
            }
        });

        var queue = new createjs.LoadQueue();
        createjs.Sound.alternateExtensions = ["mp3"];
        queue.installPlugin(createjs.Sound);

        var startPlaying = function() {
            $playButton.removeClass('disabled');
            audioQueue(playedSounds);
            queue.removeEventListener('complete', startPlaying);
        };

        var self = this;
        queue.addEventListener("complete", startPlaying);
        queue.setMaxConnections(10);
        queue.loadManifest(playedSounds);

        $playButton.addClass('disabled');
    }
})
