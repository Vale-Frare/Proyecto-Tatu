import Phaser from 'phaser';
import Config from '../config';

export class Bolita {
    object: Phaser.Physics.Arcade.Sprite;
    x: number = 0;
    y: number = 0;

    constructor(scene, x, y, ancho=0, alto=0, bolitasTexturas=[], nivel=[], anchoBasura=0, altoBasura=0, inpar = false) {
        if (inpar) {
            this.x = (x * ancho) + ancho;
        }else {
            this.x = (x * ancho) + (ancho/2);
        }
        this.y = (y * (alto/100*75)) + (alto/2);
        this.object = scene.physics.add.sprite(this.x, this.y, bolitasTexturas[nivel[y][x].color]);

        this.object.setScale(anchoBasura,altoBasura);
        this.object.depth = -1;
        this.object.grupo = nivel[y][x].grupo;
        this.object.body.setImmovable(true);
        this.object.body.setCircle((this.object.width*.5) - 50);
        this.object.body.offset.y = 50;
        this.object.body.offset.x = 50;
        this.object.body.moves = false;

        if (Config.config.physics.arcade.debug) scene.add.text(this.object.x, this.object.y, `${nivel[y][x].grupo}`, { font: 'lighter 65px Arial', color: 'white', stroke: '#000', strokeThickness: 8}).setOrigin(0.5);
    }
}

export class BolitaLanzada {
    object: Phaser.Physics.Arcade.Sprite;
    x: number = 0;
    y: number = 0;

    constructor(scene, x, y, scale, data, rotacion) {
        this.object = scene.physics.add.sprite(x,y,'tatu_bebe');

        this.object.setScale(scale);
        this.object.depth = 1;
        this.object.rotation = rotacion;
        this.object.body.allowGravity = false;
        scene.physics.velocityFromRotation(this.object.rotation, 1600, this.object.body.velocity);
        this.object.setBounce(1);
        this.object.body.setCircle(this.object.width/2);

        var particles = scene.add.particles('pastito');

        let geom = new Phaser.Geom.Ellipse(0, 0, 20, 1);
        var emitter = particles.createEmitter({
            radial: false,
            scale: { start: 0.3, end: 0, ease: 'Expo' },
            lifespan: { min: 1000, max: 2000 },
            frequency: 0,  
            quantity: 1,
            maxParticles: 0,
            emitZone:  { source: geom },
            rotate: { start: this.object.angle + 90, end: this.object.angle + 90 },
        });

        //emitter.setAngle(this.object.angle);
        emitter.setPosition(x, y);
        emitter.startFollow(this.object);
        emitter.setBlendMode(Phaser.BlendModes.NORMAL);
        emitter.depth = 1;
        
        this.object.emitter = emitter;
    }
}

export class BolitaDeck {
    object: Phaser.GameObjects.Sprite;
    x: number = 0;
    y: number = 0;

    constructor(scene, scale, data) {
        for(let i = data.deck.length - 1; i > -1; i--) {
            this.object = scene.add.sprite(900 - (i * 300),1800,'tatu_bebe');

            this.object.setTint(data.burbujas[data.deck[i].color].color);
            data.setObjInDeck(this.object, i);
            this.object.setDepth(5);
            this.object.setScale(scale);
        }
    }
}