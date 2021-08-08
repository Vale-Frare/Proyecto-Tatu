class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {
        this.load.plugin('rexperlinplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperlinplugin.min.js', true);
        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
        this.load.image("fondo", "assets/img/fondo.png");
        this.load.image("basura_1", "assets/img/basura_1.png");
        this.load.image("basura_2", "assets/img/basura_2.png");
        this.load.image("basura_3", "assets/img/basura_3.png");
    }

    create() {
        this.scene.start("Scene1");
    }
}