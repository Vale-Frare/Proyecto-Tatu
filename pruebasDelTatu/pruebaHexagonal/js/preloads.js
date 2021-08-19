class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {
        this.load.plugin('rexperlinplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexperlinplugin.min.js', true);
        this.load.image("flecha", "assets/flecha.png");
        this.load.spritesheet('bolita', 'assets/bolita.png', {frameWidth: 400, frameHeight: 400});
        this.load.image("fondo", "assets/img/fondo.png");
        this.load.image("basura_1", "assets/img/basura_1.png");
        this.load.image("basura_2", "assets/img/basura_2.png");
        this.load.image("basura_3", "assets/img/basura_3.png");
    }

    create() {
        this.anims.create({
            key: 'girar',
            frames: this.anims.generateFrameNumbers('bolita', { start: 0, end: 3 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'noGirar',
            frames: this.anims.generateFrameNumbers('bolita', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: 0
        });

        this.scene.start("Scene1");
    }
}