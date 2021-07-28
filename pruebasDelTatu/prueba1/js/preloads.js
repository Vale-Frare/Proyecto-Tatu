class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {
        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
    }

    create() {
        this.scene.start("Scene1");
    }
}