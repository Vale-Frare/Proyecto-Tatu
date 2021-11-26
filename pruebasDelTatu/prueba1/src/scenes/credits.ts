import Phaser from 'phaser';

export default class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }

    create() {
        let hudManager: any = this.scene.get('hud');
        hudManager.mostrarHud("creditos");
    }

    update() {

    }
}