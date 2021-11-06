import Phaser from 'phaser';
import Hud from '../scenes/hud';
import SoundManager from '../scenes/soundManager';

export class shotController {

    private overlaps;
    private paDespues;
    private bounces;
    private data;
    private bolita;
    private scene;
    private nivel_finalizado;

    constructor(data, scene, bolita, nivel_finalizado, overlaps = []) {
        this.overlaps = overlaps;
        this.paDespues = this.paDespues;
        this.bounces = 0;
        this.data = data;
        this.scene = scene;
        this.bolita = bolita;
        this.nivel_finalizado = nivel_finalizado;

        this.colisionesBordes();
    }
    
    private colisionesBordes(){

        this.data.bordes.forEach(borde => {
            this.overlaps.push(this.scene.physics.add.overlap(borde, this.bolita, this.colisionesOn, null, this));
        });
    }

    private colisionesOn(param1, param2){
        this.overlaps.forEach(overlap => {
            this.overlaps.splice(this.overlaps.indexOf(overlap), 1);
            overlap.destroy();
        });
        this.data.bordes.forEach(borde => {
            if(param1 != borde){
                this.scene.physics.add.collider(this.bolita, borde, this.onBounce, null, this);
            }else {
                this.paDespues = borde;
            }
        });

        let contexto = this;
         
        new Promise(function (resolve, reject) {
            setTimeout(() => {
                contexto.scene.physics.add.collider(contexto.bolita, contexto.paDespues, contexto.onBounce, null, contexto);
                resolve("nya");
            }, 200);
        });
    }

    ripArmadillo(armadillo) {
        let bola_lanzada_fake = this.scene.add.sprite(armadillo.x, armadillo.y, armadillo.texture.key).setTint(armadillo.tintTopLeft).setScale(armadillo.scaleX, armadillo.scaleY);
        armadillo.destroy();
        let pos = {x: 540, y: 1700};
        if (bola_lanzada_fake.x > 540) {
            pos.x = 1180;
        }else if (bola_lanzada_fake.x < 540) {
            pos.x = -100;
        }
        let prevY = bola_lanzada_fake.y;
        let contexto = this;
        this.scene.tweens.add({
            targets: bola_lanzada_fake,
            x: pos.x,
            y: '+=100',
            duration: 800,
            delay: 0,
            yoyo: false,
            ease: 'Linear',
            loop: 0,
            onStart: function () {
                bola_lanzada_fake.setDepth(-1);
                if (armadillo.tintTopLeft == 0xCDCDCD) {
                    contexto.data.armadillon = false;
                    bola_lanzada_fake.anims.play('armadillon_camina', true);
                }else {
                    bola_lanzada_fake.anims.play('tatu_bebe_camina', true);
                }
            },
            onUpdate: function () {
                bola_lanzada_fake.rotation = Phaser.Math.Angle.Between(bola_lanzada_fake.x, bola_lanzada_fake.y, pos.x, prevY + 100);
            },
            onComplete: function () {
                bola_lanzada_fake.destroy();
            }
        });
    }

    private onBounce(a) {

        let ang_rebote = Math.atan2(a.body.velocity.y/a.velocidad, a.body.velocity.x/a.velocidad);
        a.rotation = ang_rebote;
        a.emitter.followOffset.x += 2000;
        a.depth = 0;
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
            rotate: { start: a.angle - 90, end: a.angle - 90},
        });
        particles.depth = -1;
        _.startFollow(a);
        _.setBlendMode(Phaser.BlendModes.NORMAL);
        a.emitter = _;
        this.bounces++;
        if (this.bounces >= 5) {
            this.ripArmadillo(a);
            this.data.bolas_destruidas++;

            this.data.nivelCargado.forEach(fila => {
                fila.forEach(bolita => {
                    if(bolita){
                        this.nivel_finalizado = false;
                    }
                })
            });

            if(!this.nivel_finalizado && (this.data.deck.length-this.data.bolas_destruidas) == 0){
                let hud: Hud = this.scene.scene.get("hud");
                let sm: SoundManager = this.scene.scene.get("soundManager");

                hud.play_animacion("nodos_2");
                hud.desactivar_todo_menos("boton_reiniciar");
                hud.cambiar_boton_niveles();
                this.data.pausa = true;
                sm.playMusic("derrota", 0.1, false);
            }

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