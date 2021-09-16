import Phaser from 'phaser';
import Data from '../classes/data';
import Config from '../config';
import {Bolita, BolitaDeck} from '../classes/prefabs'
import {Matriz, Aleatorizadores, AccionesBolitas} from '../classes/helpers';
import {Slider} from '../classes/utilsHud';

let data: Data = new Data();

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }
    
    create() {
        let texto = `Cantidad de bolitas: ${data.bolitas.length}`;
        data.text1 = new Phaser.GameObjects.Text(this, 0, 0, texto, { fontFamily: 'Arial', fontSize: '75px', color: 'white' }).setOrigin(0);

        data.lanzador = this.add.sprite(900,1800,'flecha');

        this.cargarNivelNuevo();

        new Slider(this, data, data.deck);
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
            f.depth = -1 + (index * 10);
            if (contador == 0) {
                bordes.forEach((borde) => {
                    let b = this.physics.add.sprite(borde.x, borde.y, borde.key).setOrigin(0,1);
                    b.body.setImmovable(true);
                    b.body.moves = false;
                    b.depth = -1;
                    data.bordes.push(b);
                });
                contador++;
            }
        });

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
                if (bolita.y < 0 || bolita.x < 0 || bolita.x > Config.config.width) {
                    data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });
    }

    cargarNivelNuevo() {
        console.log(data.deck);

        let nivel = this.cargarNivelDesdeTiled("lvl_3");

        data.deck = Matriz.deckFromMatriz(nivel, data);

        new BolitaDeck(this, 0.3, data);
        console.log(data.deck);

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
