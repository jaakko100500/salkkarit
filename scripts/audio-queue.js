var audioQueue = function(audios) {
    var sounds = audios;
    var i = -1;

    playSnd();

    function playSnd() {
        i++;
        if (i == sounds.length) return;

        var myInstance = createjs.Sound.play(sounds[i].id);
        myInstance.addEventListener("complete", playSnd);
    }
};
