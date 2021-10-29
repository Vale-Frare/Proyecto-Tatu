import Phaser from 'phaser';
import Data from '../classes/data';
import Config from '../config';
import {Bolita, BolitaDeck2} from '../classes/prefabs'
import {Matriz, Aleatorizadores} from '../classes/helpers';
import {Slider} from '../classes/playerController';
import ProgressManager from './progressManager';

let data: Data = null;

export default class Scene1 extends Phaser.Scene {

    constructor() {
        super("Scene1");
    }
    
    create() {
        data = new Data();

        let y = 1700;

        data.lanzador = this.add.sprite(900, y,'flecha');
        data.lanzador.setDepth(5);

        this.cargarNivelNuevo();

        data.slider = new Slider(this, data, data.deck, 780, y + 75);

        let hud: any = this.scene.get("hud");
        hud.pasarData(data);
        
        let sm: any = this.scene.get("soundManager");
        sm.playMusic("lvl_1", 0.1, true);
    }

    cargarNivelDesdeTiled(key: string) {
        data.mapaCargado = JSON.parse(localStorage.getItem(key));
        let objetos = data.mapaCargado.objects;
        let alto = data.mapaCargado.tileHeight;
        let ancho = data.mapaCargado.tileWidth;
        let fondos = data.mapaCargado.fondos;
        let bordes = data.mapaCargado.bordes;

        var contador = 0;
        fondos.forEach((fondo,index) => {
            let f = this.add.image(fondo.x, fondo.y, fondo.key).setOrigin(0);
            f.depth = fondo.depth + 1;
            if (contador == 0) {
                bordes.forEach((borde) => {
                    let b = this.physics.add.sprite(borde.x, borde.y, borde.key).setOrigin(0,1);
                    b.body.setImmovable(true);
                    b.body.moves = false;
                    b.depth = data.mapaCargado.bordesDepth;
                    data.bordes.push(b);
                });
                contador++;
            }
        });

        let matrizNivel = Matriz.objetosAMatriz(objetos, alto, ancho);

        let matrizNivelEmbolsada = Aleatorizadores.aleatorizarConLaBolsa(matrizNivel, 3);

        return Matriz.convertirAGrupos(matrizNivelEmbolsada);
    }    

    update(time, delta) {
        if (data.pausa) {
            data.slider.mini_bolita.disableInteractive();
        }else {
            data.slider.mini_bolita.setInteractive();
        }

        if (data.pausa) {
            data.bolitas.forEach((b) => {
                if (b.anims) {
                    b.anims.pause();
                }
            });
            this.physics.pause();
        }else {
            data.bolitas.forEach((b) => {
                if (b.anims) {
                    b.anims.resume();
                }
            });
            this.physics.resume();
        }

        data.bolitas.forEach(bolita => {
            if (bolita.scene == undefined){
                data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
            }
            else{
                if (bolita.y < 0 || bolita.x < 0 || bolita.x > Config.config.width) {
                    data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });

        data.deckController.update();
    }

    cargarNivelNuevo() {
        let progressManager: ProgressManager = this.scene.get("ProgressManager");

        let nivel = this.cargarNivelDesdeTiled(progressManager.getLevelToPlay());

        data.deck = Matriz.deckFromMatriz(nivel, data);

        data.deckController = new BolitaDeck2(this, 0.3, data, nivel, 900, 1700);

        this.input.keyboard.on('keydown-' + 'T', function (event) { 
            data.deckController.removerBolita(data.bolitaALanzar + 1);
        });

        this.input.keyboard.on('keydown-' + 'R', function (event) { 
            data.deckController.agregarBolitaAlDeck(Phaser.Math.Between(2, 4));
        });

        const bolitasTexturas = [
            'basurita_0', //  VERDE
            'basurita_1', //  ROJA
            'basurita_2', //  NARANJA
            'basurita_3', //  AZUL
            'basurita_4'  //  AMARILLO
        ];

        let alto = data.mapaCargado.tileHeight;
        let ancho = data.mapaCargado.tileWidth;
        let anchoBasura = data.mapaCargado.basuraWidth/400;
        let altoBasura = data.mapaCargado.basuraHeight/400;

        for (let y = 0; y < nivel.length; y++) {
            let fila = [];
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x].color != -1) {
                    if (Matriz.esPar(y)) {
                        let bolita = new Bolita(
                            this,
                            x,
                            y,
                            ancho,
                            alto,
                            bolitasTexturas,
                            nivel,
                            anchoBasura,
                            altoBasura
                        );

                        fila.push(bolita.object);
                    }else {
                        let bolita = new Bolita(
                            this,
                            x,
                            y,
                            ancho,
                            alto,
                            bolitasTexturas,
                            nivel,
                            anchoBasura,
                            altoBasura,
                            true
                        );

                        fila.push(bolita.object);
                    }
                }else {
                    fila.push(null);
                }
            }
            //  vale: se pushea la fila al nivel cargado.
            data.nivelCargado.push(fila);
        }

        //  vale: se guardan los valores de los grupos en una matriz aparte.
        data.nivelCargadoGrupos = nivel;
    }
    
}