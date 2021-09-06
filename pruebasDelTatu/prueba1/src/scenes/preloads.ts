import Phaser from 'phaser';

export default class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    preload() {
        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
        this.load.image("fondo", "assets/img/fondo.png");
        this.load.image("basura_1", "assets/img/basura_1.png");
        this.load.image("basura_2", "assets/img/basura_2.png");
        this.load.image("basura_3", "assets/img/basura_3.png");
        this.load.image("tatu_bebe", "assets/img/tatu_bebe.png");

        this.load.tilemapTiledJSON("tilemap", "assets/nivel/lvl_1.json");
        this.load.tilemapTiledJSON("tilemap2", "assets/nivel/lvl_2.json");
        this.load.tilemapTiledJSON("tilemap3", "assets/nivel/lvl_3.json");
    }

    create() {
        this.scene.start("Scene1");
    }
}