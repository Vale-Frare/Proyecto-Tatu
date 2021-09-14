import Phaser from 'phaser';
import tiledHelper from '../classes/tiledHelper';

export default class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    async preload() {
        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
        this.load.image("fondo", "assets/img/fondo.png");
        this.load.image("basura_1", "assets/img/basura_1.png");
        this.load.image("basura_2", "assets/img/basura_2.png");
        this.load.image("basura_3", "assets/img/basura_3.png");
        this.load.image("tatu_bebe", "assets/img/tatu_bebe.png");

        this.load.image("basurita_0", "assets/img/basuritas/0.png");
        this.load.image("basurita_1", "assets/img/basuritas/1.png");
        this.load.image("basurita_2", "assets/img/basuritas/2.png");
        this.load.image("basurita_3", "assets/img/basuritas/3.png");
        this.load.image("basurita_4", "assets/img/basuritas/4.png");  
        
        this.load.image("pastito", "assets/img/pastito.png");

        this.load.image("barrita", "assets/barrita.png");
        this.load.image("mini_bolita", "assets/mini_bolita.png"); 

        //  vale: Asi se carga un mapa de tiled.
        await tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl_3.json");
    }

    create() {
        this.scene.start("Scene1");
    }
}