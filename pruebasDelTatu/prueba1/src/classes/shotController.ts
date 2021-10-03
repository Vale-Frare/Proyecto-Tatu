import Phaser from 'phaser';
//import {AccionesBolitas} from './helpers';

export class shotController {

    private overlaps;
    private paDespues;
    private bounces;
    private data;
    private bolita;
    private scene;

    constructor(data, scene, bolita) {
        this.overlaps = [];
        this.paDespues = this.paDespues;
        this.bounces = 0;
        this.data = data;
        this.scene = scene;
        this.bolita = bolita;
    }
    
    colisionesBordes (data, scene, bolita){

        data.bordes.forEach(borde => {
            this.overlaps.push(scene.physics.add.overlap(borde, bolita, this.colisionesOn, null, scene));
        });
    }

    colisionesOn(param1, param2){
        this.overlaps.forEach(overlap => {
            overlap.destroy();
        });
        this.data.bordes.forEach(borde => {
            if(param1 != borde){
                this.scene.physics.add.collider(this.bolita, borde, this.onBounce, null, this.scene);
            }else {
                this.paDespues = borde;
            }
        });
        new Promise(function (resolve, reject) {
            setTimeout(() => {
                this.scene.physics.add.collider(this.bolita, this.paDespues, this.onBounce, null, this.scene);
                resolve("nya");
            }, 200);
        });
    }

    onBounce(a) {
        let ang_rebote = Math.atan2(a.body.velocity.y/a.velocidad, a.body.velocity.x/a.velocidad);
        a.rotation = ang_rebote;
        a.emitter.followOffset.x += 2000;
        //a.angle = a.angle + 180;
        let emitter = a.emitter;
        new Promise((resolve, reject) => {
            setTimeout(() => {
                emitter.killAll();
            }, 500);
        });
        var particles = this.scene.add.particles('pastito');

        let geom = new Phaser.Geom.Ellipse(0, 0, 20, 1);
        var _ = particles.createEmitter({
            radial: false,
            scale: { start: 0.3, end: 0, ease: 'Expo' },
            lifespan: { min: 1000, max: 2000 },
            frequency: 0,  
            quantity: 1,
            maxParticles: 0,
            emitZone:  { source: geom },
            rotate: { start: a.angle - 90, end: a.angle - 90}, // Esto ta re mal, hay que arreglarlo.
        });
        _.startFollow(a);
        _.setBlendMode(Phaser.BlendModes.NORMAL);
        a.emitter = _;
        this.bounces++;
        if (this.bounces >= 5) {
            a.destroy();

            a.emitter.followOffset.x += 2000;
            let emitter = a.emitter;
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    emitter.killAll();
                }, 500);
            });
        }
    }

}