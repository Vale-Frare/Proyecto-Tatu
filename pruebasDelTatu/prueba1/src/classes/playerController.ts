import Phaser from 'phaser';
import {AccionesBolitas} from './helpers';
import {lineController} from '../classes/lineController';
import Hud, { HudAcciones } from '../scenes/hud';

export class Slider {
    private x;
    private y;

    public xSlider;
    public ySlider;

    private minimo;
    private maximo;
    private diferencia;
    private scene;

    private bola_fantasma_tocando_bolita = false;
    private bola_fantasma_tocando_borde = false;

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

        let context = this;

        let bolita_fantasma = scene.add.sprite(data.lanzador.x + (Math.cos(data.lanzador.rotation - Math.PI/2) * 1540), data.lanzador.y + (Math.sin(data.lanzador.rotation - Math.PI/2) * 1540), 'tatu_bebe');
        bolita_fantasma.setScale(0.265);
        bolita_fantasma.setAlpha(0);

        function evaluar_bola_mas_cercana(borde, bola) {
            if (context.bola_cercana) {
                if (
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, bola.x, bola.y) 
                    < 
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, context.bola_cercana.x, context.bola_cercana.y)) {
                        context.bola_cercana = bola;
                        context.bola_fantasma_tocando_borde = true;
                }else {
                    context.bola_fantasma_tocando_borde = false;
                }
            }else {
                context.bola_cercana = bola;
            }
        }

        function evaluar_bola_mas_cercana_bolitas(borde, bola) {
            if (context.bola_cercana) {
                if (
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, bola.x, bola.y) 
                    < 
                    Phaser.Math.Distance.Between(data.lanzador.x, data.lanzador.y, context.bola_cercana.x, context.bola_cercana.y)) {
                        context.bola_cercana = bola;
                        context.bola_fantasma_tocando_bolita = true;
                }else {
                    context.bola_fantasma_tocando_bolita = false;
                }
            }else {
                context.bola_cercana = bola;
            }
        }

        var lc = new lineController(data.lanzador.x, data.lanzador.y, 0, 0, 85,60, scene);
        lc.setAlpha(0);
        lc.bolitas.forEach(bolita => {
            data.bordes.forEach((borde, index) => {
                if (index != 1) {
                    scene.physics.add.overlap(borde, bolita, evaluar_bola_mas_cercana);
                }
            });
            data.nivelCargado.forEach(bola => {
                scene.physics.add.overlap(bola, bolita, evaluar_bola_mas_cercana_bolitas);
            });
        });

        let linea_punteada_real = new lineController(data.lanzador.x, data.lanzador.y, data.lanzador.x + (Math.cos(data.lanzador.rotation - Math.PI/2) * 1540), data.lanzador.y + (Math.sin(data.lanzador.rotation - Math.PI/2) * 1540), 20, 10, scene);
        linea_punteada_real.setColor(0xffffff);
        linea_punteada_real.setAlpha(0);

        let acciones = scene.scene.get("hud");
        acciones.mostrarAcciones(data.deck.length);

        mini_bolita.setInteractive({ draggable: true, dropZone: true })
        .on('dragstart', function(pointer, dragX, dragY){
            mini_bolita.setTint(0x000000);
            mini_bolita.setScale(1.5);

            linea_punteada_real.fadeIn(scene);
            scene.tweens.addCounter({
                from: 0,
                to: 0.3,
                ease: 'Power2',
                duration: 400,
                onUpdate: function (tween) {
                    bolita_fantasma.alpha = tween.getValue();
                }
            });

            Slider.refreshLine(mini_bolita, this.minimo, this.diferencia, context, linea_punteada_real, scene, lc, bolita_fantasma, data)

        }, this)
        .on('drag', function(pointer, dragX, dragY){

            if(pointer.x < (this.minimo-(mini_bolita.width/1.25)) || pointer.x > (this.maximo+(mini_bolita.width/1.25)) || pointer.y < (mini_bolita.y-(mini_bolita.height/1.25)) || pointer.y > (mini_bolita.y+(mini_bolita.height/1.25))){
                mini_bolita.setTint(0xffffff);
                mini_bolita.setScale(1);
            }
            else{
                mini_bolita.x = Phaser.Math.Clamp(pointer.x, this.minimo, this.maximo);

                Slider.refreshLine(mini_bolita, this.minimo, this.diferencia, context, linea_punteada_real, scene, lc, bolita_fantasma, data)

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
                AccionesBolitas.tiro(this.scene, data, data.lanzador.rotation - (Math.PI/2), acciones);
            }
            mini_bolita.setTint(0xffffff);
            mini_bolita.setScale(1);
            linea_punteada_real.fadeOut(scene);
            scene.tweens.addCounter({
                from: 0.3,
                to: 0,
                ease: 'Power2',
                duration: 400,
                onUpdate: function (tween) {
                    bolita_fantasma.alpha = tween.getValue();
                }
            });

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

    static refreshLine(mini_bolita, minimo, diferencia, context, linea_punteada_real, scene, lc, bolita_fantasma, data){
        scene.tweens.add({
            targets: data.lanzador,
            rotation: -0.8+((mini_bolita.x - minimo) * diferencia),
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
                bolita_fantasma.x = context.linea_punteada_objetivo.x;
                bolita_fantasma.y = context.linea_punteada_objetivo.y;
                bolita_fantasma.rotation = -0.8+((mini_bolita.x - minimo) * diferencia);
                if (context.bola_fantasma_tocando_bolita) {
                    bolita_fantasma.setAlpha(0);
                }else {
                    bolita_fantasma.setAlpha(0.2);
                }
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
    }
}