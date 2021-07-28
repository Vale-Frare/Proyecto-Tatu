class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {
        this.load.plugin('rexperlinplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperlinplugin.min.js', true);
        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
    }

    create() {
        this.scene.start("Scene1");
    }
}