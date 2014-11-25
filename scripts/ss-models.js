var Salkkarit = Salkkarit || {};
Salkkarit.Models = Salkkarit.Models || {};

Salkkarit.Models.Sound = Backbone.Model.extend({
    initialize: function(options) {
        var fileName = options.path.substr(options.path.lastIndexOf('/') + 1);
        var fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf("."))

        this.set('name', fileNameWithoutExtension);
        this.set('key', this.cid.replace("c", ""));
    }
});

Salkkarit.Models.soundKeyMap = {};

_.each(Salkkarit.Models.soundPathCollections, function(soundCollection) {
    _.each(soundCollection, function(sound) {
        var model = new Salkkarit.Models.Sound({
            path: sound
        });
        Salkkarit.Models.soundKeyMap[model.get('key')] = model;
    });
});
