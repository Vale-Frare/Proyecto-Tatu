import Phaser from 'phaser';
import Data from '../classes/data';
import Config from '../config';
import {Bolita, BolitaDeck} from '../classes/prefabs'
import {Matriz, Aleatorizadores, AccionesBolitas} from '../classes/helpers';

let data: Data = new Data();

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }
    
    create() {
        let fondo = this.add.image(0, 0, 'fondo').setOrigin(0);
        fondo.depth = -1;
        let texto = `Cantidad de bolitas: ${data.bolitas.length}`;
        data.text1 = new Phaser.GameObjects.Text(this, 0, 0, texto, { fontFamily: 'Arial', fontSize: '75px', color: 'white' }).setOrigin(0);

        data.lanzador = this.add.sprite(900,1800,'flecha');

        data.lanzador.setInteractive({ draggable: true })
        .on('dragstart', function(pointer, dragX, dragY){
            let posicion_inicial = pointer.x;
        })
        .on('drag', function(pointer, dragX, dragY){
            data.lanzador.rotation = Phaser.Math.Clamp(data.lanzador.rotation + ((dragX / 10000) - 0.088), -0.8, 0.3);
        })
        .on('dragend', function(pointer, dragX, dragY, dropped){
            AccionesBolitas.tiro(this, data);
        }, this);
        
        new BolitaDeck(this, 0.3, data);

        this.cargarNivelNuevo();
    }

    cargarNivelDesdeTiled(key: string) {
        data.mapaCargado = JSON.parse(localStorage.getItem(key));
        let objetos = data.mapaCargado.objects;
        let alto = data.mapaCargado.tileHeight;
        let ancho = data.mapaCargado.tileWidth;

        let matrizNivel = Matriz.objetosAMatriz(objetos, alto, ancho);

        let matrizNivelEmbolsada = Aleatorizadores.aleatorizarConLaBolsa(matrizNivel, 3);

        return Matriz.convertirAGrupos(matrizNivelEmbolsada);
    }    

    update() {
        data.text1.text = `Cantidad de bolitas: ${data.bolitas.length}`;

        data.bolitas.forEach(bolita => {
            if (bolita.scene == undefined){
                data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
            }
            else{
                this.physics.velocityFromRotation(bolita.angle, 2600, bolita.body.velocity);
                if (bolita.y < 0 || bolita.x < 0 || bolita.x > Config.config.width) {
                    data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });
    }

    cargarNivelNuevo() {
        let nivel = this.cargarNivelDesdeTiled("lvl_3");

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
