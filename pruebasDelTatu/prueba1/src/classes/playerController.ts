import Phaser from 'phaser';
import {AccionesBolitas} from './helpers';
import {lineController} from '../classes/lineController';
import {Bolita, BolitaFantasma} from '../classes/prefabs';

export class Slider {
    private x;
    private y;

    public xSlider;
    public ySlider;

    private minimo;
    private maximo;
    private diferencia;
    private scene;

    private bola_cercana;
    private linea_punteada_objetivo = {x: 0, y: 0};

    constructor(scene: Phaser.Scene, data, deck, x: number = 800, y: number = 1875, texMinibola: string = 'mini_bolita', texSlider: string = 'barrita') {
        this.x = x;
        this.y = y;
        this.scene = scene;

        let barrita = scene.add.sprite(x,y,texSlider).setOrigin(0);
        let mini_bolita = scene.add.sprite(x+(barrita.width/2),y+(barrita.height/2),texMinibola);
        barrita.depth = 5;
        mini_bolita.depth = 5;
        
        this.minimo = mini_bolita.x - (barrita.width/2);
        this.maximo = mini_bolita.x + (barrita.width/2);
        this.diferencia = Math.floor(this.maximo - this.minimo);
        data.lanzador.rotation = -0.25;
        deck[data.bolitaALanzar].obj.rotation = data.lanzador.rotation - (Math.PI/2);
        this.diferencia = 1.1 / this.diferencia;

        // let bolita_a_usar = 0;
        // let bolitas_invisibles = [];
        // for (let index = 0; index < 200; index++) {
        //     bolitas_invisibles.push(new BolitaFantasma(scene, 900, 1800, 0.1));
        // }
        // console.log(bolitas_invisibles);
        let context = this;

        function evaluar_bola_mas_cercana(borde, bola) {
            if (context.bola_cercana) {
                if (
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, bola.x, bola.y) 
                    < 
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, context.bola_cercana.x, context.bola_cercana.y)) {
                        context.bola_cercana = bola;
                }
            }else {
                context.bola_cercana = bola;
            }
        }
                                                                        //  el 75 seria la precision.
        var lc = new lineController(data.lanzador.x, data.lanzador.y, 0, 0, 75,30, scene);
        lc.setAlpha(0);
        console.log(data.bordes);
        lc.bolitas.forEach(bolita => {
            data.bordes.forEach((borde, index) => {
                if (index != 1) {
                    scene.physics.add.overlap(borde, bolita, evaluar_bola_mas_cercana);
                }
            });
        });

        let linea_punteada_real = new lineController(data.lanzador.x, data.lanzador.y, data.lanzador.x + (Math.cos(data.lanzador.rotation - Math.PI/2) * 1540), data.lanzador.y + (Math.sin(data.lanzador.rotation - Math.PI/2) * 1540), 20, 10, scene);
        linea_punteada_real.setColor(0xffffff);
        
        mini_bolita.setInteractive({ draggable: true, dropZone: true })
        .on('dragstart', function(pointer, dragX, dragY){
            mini_bolita.setTint(0x000000);
            mini_bolita.setScale(1.5);
        }, this)
        .on('drag', function(pointer, dragX, dragY){
            
            // bolita_a_usar++;
            // if (bolita_a_usar > bolitas_invisibles.length - 1) { bolita_a_usar = 0; }
            // bolitas_invisibles[bolita_a_usar].updatePos(data.lanzador.x, data.lanzador.y, data.lanzador.rotation - (Math.PI/2), scene, 4200);
            if(pointer.x < (this.minimo-(mini_bolita.width/1.25)) || pointer.x > (this.maximo+(mini_bolita.width/1.25)) || pointer.y < (mini_bolita.y-(mini_bolita.height/1.25)) || pointer.y > (mini_bolita.y+(mini_bolita.height/1.25))){
                mini_bolita.setTint(0xffffff);
                mini_bolita.setScale(1);
            }
            else{
                mini_bolita.x = Phaser.Math.Clamp(pointer.x, this.minimo, this.maximo);

                
                scene.tweens.add({
                    targets: data.lanzador,
                    rotation: -0.8+((mini_bolita.x - this.minimo) * this.diferencia),
                    duration: 150,
                    yoyo: false,
                    ease: 'Linear',
                    loop: 0,
                    onUpdate: function(){
                        if (context.bola_cercana) {
                            context.linea_punteada_objetivo.x = context.bola_cercana.x;
                            context.linea_punteada_objetivo.y = context.bola_cercana.y;
                        }
                        linea_punteada_real.updatePosTweens(context.linea_punteada_objetivo.x, context.linea_punteada_objetivo.y, scene);
                        lc.bolitas.forEach(bolita => {
                            if (bolita == context.bola_cercana) {
                                bolita.fillAlpha = 0;
                            } else {
                                bolita.fillAlpha = 0;
                            }
                        });
                        context.bola_cercana = null;
                        lc.updatePos(data.lanzador.x + (Math.cos(data.lanzador.rotation - Math.PI/2) * 1900), data.lanzador.y + (Math.sin(data.lanzador.rotation - Math.PI/2) * 1900));
                    }
                });

                if(data.bolitaALanzar < data.deck.length){
                    scene.tweens.add({
                    targets: deck[data.bolitaALanzar].obj,
                    rotation: (-0.8+((mini_bolita.x - this.minimo) * this.diferencia)) - (Math.PI/2),
                    duration: 150,
                    yoyo: false,
                    ease: 'Linear',
                    loop: 0
                    });
                }

                mini_bolita.setTint(0x000000);
                mini_bolita.setScale(1.5);
            }
        }, this)
        .on('dragend', function(pointer, dragX, dragY, dropped){
            if(mini_bolita.tintTopLeft == 0x000000){
                AccionesBolitas.tiro(this.scene, data, data.lanzador.rotation - (Math.PI/2));
            }
            mini_bolita.setTint(0xffffff);
            mini_bolita.setScale(1);

            if(data.bolitaALanzar < data.deck.length){
                scene.tweens.add({
                    targets: deck[data.bolitaALanzar].obj,
                    rotation: (-0.8+((mini_bolita.x - this.minimo) * this.diferencia)) - (Math.PI/2),
                    duration: 400,
                    yoyo: false,
                    ease: 'Linear',
                    loop: 0,
                });
            }
        }, this);
    }
}