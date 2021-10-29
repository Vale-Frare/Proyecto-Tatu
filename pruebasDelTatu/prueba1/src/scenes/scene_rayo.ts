import Phaser from 'phaser';

export default class SceneRayo extends Phaser.Scene {
    constructor() {
        super('SceneRayo');
    }

    create() {
        let hudManager: any = this.scene.get('hud');
        hudManager.mostrarHud("rayo_concientizador");
        
    }

    update() {

    }
}