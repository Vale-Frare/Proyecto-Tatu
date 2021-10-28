import Phaser from 'phaser';

export default class SceneMainmenu extends Phaser.Scene {
    constructor() {
        super('SceneMainmenu');
    }

    create() {
        let hud = this.scene.get("hud");
        hud.mostrarHud('menu_principal');

        let sm: SoundManager = this.scene.get("soundManager");
        sm.playMusic("main_menu", 0.1, true);
    }

    update() {

    }
}