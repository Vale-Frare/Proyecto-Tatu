import Phaser from 'phaser';

export default class SceneLvlSelect extends Phaser.Scene {
    constructor() {
        super('SceneLvlSelect');
    }

    create() {
        let hud = this.scene.get("hud");
        hud.mostrarHud('seleccion_niveles');

        let sm: SoundManager = this.scene.get("soundManager");
        sm.playMusic("main_menu", 0.1, true);
    }

    update() {

    }
}