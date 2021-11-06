import Phaser from 'phaser';
import {hudHelper} from '../classes/hudHelper';
import {tiledHelper} from '../classes/tiledHelper';

export default class Preloads extends Phaser.Scene {
    constructor() {
        super("Preloads");
    }

    init(data) {
        this.load.on('progress', i => {
            data.tatuCarga.alpha = i;
        })
    }
    
    async preload() {

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
        this.load.image("piedra", "assets/img/basuritas/piedra.png");
        
        this.load.image("pastito", "assets/img/pastito.png");

        this.load.image("barrita", "assets/barrita.png");
        this.load.image("mini_bolita", "assets/mini_bolita.png");
        
        this.load.image("borde_horizontal", "assets/img/tiled/borde_horizontal.png");
        this.load.image("borde_vertical", "assets/img/tiled/borde_vertical.png");
        this.load.image("fondo", "assets/img/tiled/fondo.png");
        this.load.image("fondo_2", "assets/img/tiled/fondo_2.png");
        this.load.image("fondo_mas_fondo", "assets/img/tiled/fondo_mas_fondo.png");

        this.load.image("cosa_verde", "assets/hud/cosa_verde.png");
        this.load.spritesheet("sonido_1", "assets/hud/sonido_1.png", {frameHeight: 129, frameWidth: 132});
        this.load.spritesheet("sonido_2", "assets/hud/sonido_2.png", {frameHeight: 129, frameWidth: 132});
        this.load.spritesheet("arriba_izquierda", "assets/hud/arriba_izquierda.png", {frameHeight: 122, frameWidth: 201});
        this.load.image("boton_volver_a_niveles", "assets/hud/boton_volver_a_niveles.png");
        this.load.image("panel_pausa", "assets/hud/panel_pausa.png");
        this.load.image("panel_victoria", "assets/hud/panel_victoria.png");
        this.load.image("panel_derrota", "assets/hud/panel_derrota.png");

        this.load.image("logo_inicio", "assets/hud/logo_inicio.png");

        this.load.image("lvl1zone1", "assets/hud/lvl1zone1.png");
        this.load.image("lvl2zone1", "assets/hud/lvl2zone1.png");
        this.load.image("lvl3zone1", "assets/hud/lvl3zone1.png");
        this.load.image("lvl4zone1", "assets/hud/lvl4zone1.png");
        this.load.image("lvl5zone1", "assets/hud/lvl5zone1.png");

        this.load.image("menu_principal", "assets/hud/menu_principal.png");
        this.load.image("ayuda", "assets/hud/ayuda.png");
        this.load.image("boton", "assets/hud/boton.png");
        this.load.image("boton_alargado", "assets/hud/boton_alargado.png");
        this.load.image("configuracion", "assets/hud/configuracion.png");

        this.load.image("niveles", "assets/hud/niveles.png");
        this.load.spritesheet("tatusitos_niveles", "assets/hud/tatusitos_niveles.png", {frameHeight: 296, frameWidth: 161});
        this.load.image("regresar", "assets/hud/regresar.png");

        this.load.audio("derrota", "assets/audio/derrota.mp3");
        this.load.audio("lvl_1", "assets/audio/lvl_1.mp3");
        this.load.audio("poco_tiempo", "assets/audio/poco_tiempo.mp3");
        this.load.audio("tatu_choca_color_correcto", "assets/audio/tatu_choca_color_correcto.mp3");
        this.load.audio("tatu_choca_color_incorrecto", "assets/audio/tatu_choca_color_incorrecto.mp3");
        this.load.audio("tatu_lanzado", "assets/audio/tatu_lanzado.mp3");
        this.load.audio("tatu_rodando", "assets/audio/tatu_rodando.mp3");
        this.load.audio("victoria", "assets/audio/victoria.mp3");
        this.load.audio("main_menu", "assets/audio/main_menu.mp3");

        this.load.image("panel_idioma", "assets/hud/panel_idioma.png");
        this.load.image("boton_espaniol", "assets/hud/boton_espaniol.png");
        this.load.image("boton_ingles", "assets/hud/boton_ingles.png");
        this.load.image("boton_portugues", "assets/hud/boton_portugues.png");
             
        //  vale: Asi se carga un mapa de tiled.
        await Promise.all([
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl1zone1.json"),
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl2zone1.json"),
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl3zone1.json"),
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl4zone1.json"),
            tiledHelper.cargarMapaDesdeJson("assets/nivel/lvl5zone1.json"),
            hudHelper.cargarHudDesdeJson("assets/nivel/hud.json"),
            hudHelper.cargarHudDesdeJson("assets/nivel/rayo_concientizador.json"),
            hudHelper.cargarHudDesdeJson("assets/nivel/menu_principal.json"),
            hudHelper.cargarHudDesdeJson("assets/nivel/seleccion_niveles.json")
        ]);
    }

    async create() {
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

        let sm: any = this.scene.get("soundManager");
        sm.playMusic("main_menu", 0.1, true);
        this.scene.start("SceneMainmenu");
    }
}