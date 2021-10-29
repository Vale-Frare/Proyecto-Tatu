import Phaser from 'phaser';
import Hud from './hud';
import SoundManager from './soundManager';

export default class SceneMainmenu extends Phaser.Scene {

    constructor() {
        super('SceneMainmenu');
    }

    create() {
        let hud: Hud = this.scene.get("hud");
        hud.mostrarHud('menu_principal');        
    }

    update() {

    }
}