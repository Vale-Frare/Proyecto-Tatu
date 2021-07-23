class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    create() {
        console.log("Escena 1 nya");
        this.add.text(500, 200, "Esto es un template", {fontSize: '80px', fill: 'white'});
        this.add.text(10, 10, 'Score: 0', { fontFamily: 'tinyUnicode', fontSize: '80px', fill: 'white'});
    }

    update() {

    }
}