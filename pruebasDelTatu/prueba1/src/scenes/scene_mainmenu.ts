import Phaser from 'phaser';

export default class SceneMainmenu extends Phaser.Scene {

    constructor() {
        super('SceneMainmenu');
    }

    create() {
        let hud: any = this.scene.get("hud");
        hud.mostrarHud('menu_principal');
    }

    update() {

    }
}