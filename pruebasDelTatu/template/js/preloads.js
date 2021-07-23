class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {

    }

    create() {
        this.scene.start('Scene1');
    }
}