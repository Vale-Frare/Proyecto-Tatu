resizeGame = function () {
    let canvas = document.querySelector('canvas');
    const {innerWidth, innerHeight} = window;

    const ratio = innerWidth / innerHeight;

    const gameRatio = game.config.width / game.config.height;

    if (ratio < gameRatio) {
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerWidth / gameRatio + 'px';
    } else {
        canvas.style.width = innerHeight * gameRatio + 'px';
        canvas.style.height = innerHeight + 'px';
    }
}

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        soundOn: true,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'template',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        audio: {
            disableWebAudio: true
        },
        pixelArt: false,
        scene: [Preloads, Scene1]
    };

    game = new Phaser.Game(config);
    window.focus();
    resizeGame();
    window.addEventListener('resize', resizeGame());
};