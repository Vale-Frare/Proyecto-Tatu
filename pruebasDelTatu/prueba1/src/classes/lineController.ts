import Phaser from 'phaser';
import Config from '../config';

export class lineController {  
    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;
    private spacing: number;
    private cantidad_bolitas: number;
    public bolitas = [];

    constructor(x1: number, y1: number, x2: number, y2: number, cantidad_bolitas: number, scale: number, scene: Phaser.Scene) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.cantidad_bolitas = cantidad_bolitas;

        if (Config.config.physics.arcade.debug) {
            scene.add.circle(x1, y1, 40, 0xffffff, 1).setOrigin(0.5).setDepth(30);
        }

        for (let i = 0; i < cantidad_bolitas + 1; i++) {
            if (i != 0) {
                var _ = scene.add.circle(Phaser.Math.Linear(x1, x2, i/cantidad_bolitas), Phaser.Math.Linear(y1, y2, i/cantidad_bolitas), scale, 0x000000);
                scene.physics.add.existing(_).body.setImmovable(true).moves = false;
                _.setDepth(20);
                this.bolitas.push(_);
            }else {
                var _ = scene.add.circle(Phaser.Math.Linear(x1, x2, i/cantidad_bolitas), Phaser.Math.Linear(y1, y2, i/cantidad_bolitas), scale, 0x000000);
                _.setVisible(false);
                this.bolitas.push(_);
            }
        }
    }

    setColor(color:number) {
        this.bolitas.forEach(b => {
            b.fillColor = color;
        });
    }

    setAlpha(color:number) {
        this.bolitas.forEach(b => {
            b.fillAlpha = color;
        });
    }

    fadeIn(scene) {
        this.bolitas.forEach(bolita => {
            if(bolita) {
                scene.tweens.addCounter({
                    from: 0,
                    to: 0.7,
                    ease: 'Power2',
                    duration: 400,
                    onUpdate: function (tween) {
                        bolita.fillAlpha = tween.getValue();
                    }
                });
            }
        })
    }

    fadeOut(scene) {
        this.bolitas.forEach(bolita => {
            if(bolita) {
                scene.tweens.addCounter({
                    from: 0.9,
                    to: 0,
                    ease: 'Power2',
                    duration: 400,
                    onUpdate: function (tween) {
                        bolita.fillAlpha = tween.getValue();
                    }
                });
            }
        })
    }

    updatePos(x:number, y:number) {
        for (let i = 0; i < this.bolitas.length; i++) {
            this.bolitas[i].x = Phaser.Math.Linear(this.x1, x, i/this.cantidad_bolitas);
            this.bolitas[i].y = Phaser.Math.Linear(this.y1, y, i/this.cantidad_bolitas);
        }
    }

    updatePosTweens(x:number, y:number, scene) {
        for (let i = 0; i < this.bolitas.length; i++) {
            scene.add.tween({
                targets: this.bolitas[i],
                x: Phaser.Math.Linear(this.x1, x, i/this.cantidad_bolitas),
                y: Phaser.Math.Linear(this.y1, y, i/this.cantidad_bolitas),
                duration: 20,
                ease: 'Linear',
                depth: 1
            });
        }
    }

}