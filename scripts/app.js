var Salkkarit = Salkkarit || {};

Salkkarit.App = new Backbone.Marionette.Application();

Salkkarit.App.addRegions({
    soundButtonRegion: "#sound-button-container",
    playerRegion: "#player-container"
});

Salkkarit.App.addInitializer(function(options) {
    var soundButtonsContainerView = new Salkkarit.Views.SoundsView({
        collection: options.sounds
    });
    Salkkarit.App.soundButtonRegion.show(soundButtonsContainerView);
    Salkkarit.App.playerRegion.show(new Salkkarit.Views.PlayerView());
});

$(document).ready(function() {
    var sounds = new Backbone.Collection(_.values(Salkkarit.Models.soundKeyMap));

    Salkkarit.App.start({
        sounds: sounds
    });
});
