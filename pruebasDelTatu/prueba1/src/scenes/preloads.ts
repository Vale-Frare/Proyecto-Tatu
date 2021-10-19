import Phaser from 'phaser';
import {hudHelper} from '../classes/hudHelper';
import {tiledHelper} from '../classes/tiledHelper';
import Hud from '../scenes/hud';

export default class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }
    
    async preload() {
        //localStorage.clear();

        this.load.image("rayita", "assets/rayita.png");

        this.load.image("flecha", "assets/flecha.png");
        this.load.image("bolita", "assets/bolita.png");
        this.load.image("basura_1", "assets/img/basura_1.png");
        this.load.image("basura_2", "assets/img/basura_2.png");
        this.load.image("basura_3", "assets/img/basura_3.png");
        this.load.spritesheet("tatu_bebe", "assets/img/tatu_bebe.png", {frameHeight: 400, frameWidth: 400});
        this.load.spritesheet("tatu_bebe_camina", "assets/img/tatu_bebe_camina.png", {frameHeight: 400, frameWidth: 591});

        this.load.image("basurita_0", "assets/img/basuritas/0.png");
        this.load.image("basurita_1", "assets/img/basuritas/1.png");
        this.load.image("basurita_2", "assets/img/basuritas/2.png");
        this.load.image("basurita_3", "assets/img/basuritas/3.png");
        this.load.image("basurita_4", "assets/img/basuritas/4.png");  
        
        this.load.image("pastito", "assets/img/pastito.png");

        this.load.image("barrita", "assets/barrita.png");
        this.load.image("mini_bolita", "assets/mini_bolita.png");
        
        this.load.image("borde_horizontal", "assets/img/tiled/borde_horizontal.png");
        this.load.image("borde_vertical", "assets/img/tiled/borde_vertical.png");
        this.load.image("fondo", "assets/img/tiled/fondo.png");
        this.load.image("fondo_2", "assets/img/tiled/fondo_2.png");
        this.load.image("fondo_mas_fondo", "assets/img/tiled/fondo_mas_fondo.png");

        this.load.image("cosa_verde", "assets/hud/cosa_verde.png");
        this.load.image("pausa", "assets/hud/pausa.png");
        this.load.spritesheet("sonido_1", "assets/hud/sonido_1.png", {frameHeight: 129, frameWidth: 132});
        this.load.spritesheet("sonido_2", "assets/hud/sonido_2.png", {frameHeight: 129, frameWidth: 132});
             
        //  vale: Asi se carga un mapa de tiled.
        await Promise.all([
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl_3.json"),
            hudHelper.cargarHudDesdeJson("assets/nivel/hud.json")
        ]);
    }

    create() {
        let hud = this.scene.get("hud");
        hud.mostrarHud('hud');

        this.anims.create({
            key: "tatu_bebe",
            frames: this.anims.generateFrameNumbers("tatu_bebe", {start: 0, end: 6}),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: "tatu_bebe_camina",
            frames: this.anims.generateFrameNumbers("tatu_bebe_camina", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });


        this.scene.start("Scene1");
    }
}