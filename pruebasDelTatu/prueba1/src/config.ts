import Phaser from 'phaser';
import Preloads from './scenes/preloads';
import Scene1 from './scenes/scene1';
import utilHud from './classes/utilHud';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1080,
    height: 1920,
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
            debug: false
        }
    },
    audio: {
        disableWebAudio: false
    },
    pixelArt: false,
    scene: [Preloads, utilHud, Scene1]
}

export default new Phaser.Game(config);