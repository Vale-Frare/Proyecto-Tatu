import Phaser from 'phaser';
import Preloads from './scenes/preloads';
import Scene1 from './scenes/scene1';
import SceneLvlSelect from './scenes/scene_lvl_select';
import SceneRayo from './scenes/scene_rayo';
import SceneMainmenu from './scenes/scene_mainmenu';
import ProgressManager from './scenes/progressManager';
import Hud from './scenes/hud';
import SoundManager from './scenes/soundManager';

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
        default: "matter",
        arcade: {
            gravity: { y: 1 },
            debug: true
        },
        matter: {
            gravity: { y: 0 },
            debug: true
        }
    },
    audio: {
        disableWebAudio: true
    },
    pixelArt: false,
    scene: [Preloads, Scene1, SceneLvlSelect, SceneRayo, SceneMainmenu, Hud, ProgressManager, SoundManager]
}

export default new Phaser.Game(config);