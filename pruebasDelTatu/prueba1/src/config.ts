import Phaser from 'phaser';
import Preloads from './scenes/preloads';
import Scene1 from './scenes/scene1';

//  holis
/*
function resizeGame () {
    let canvas = document.querySelector("canvas");
    const {innerWidth, innerHeight} = window;

    const ratio = innerWidth / innerHeight;

    const gameRatio = game.config.width / game.config.height;

    if (ratio < gameRatio) {
        canvas.style.width = innerWidth + "px";
        canvas.style.height = innerWidth / gameRatio + "px";
    } else {
        canvas.style.width = innerHeight * gameRatio + "px";
        canvas.style.height = innerHeight + "px";
    }
}
*/
let config;
window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 1080,
        height: 1920,
        soundOn: true,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: "template",
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1080,
            height: 1920
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 300 },
                debug: true
            }
        },
        audio: {
            disableWebAudio: false
        },
        pixelArt: false,
        scene: [Preloads, Scene1]
    };

    //game = new Phaser.Game(config);
    window.focus();
    //resizeGame();
    //window.addEventListener("resize", this.resizeGame());
};
export default new Phaser.Game(config);