import Phaser from 'phaser';
import Config from '../config';
import { Matriz } from '../classes/helpers';

export class Bolita {
    object: any;
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
        this.object.body.setCircle((this.object.width*.5) - 30);
        this.object.body.offset.y = 30;
        this.object.body.offset.x = 30;
        this.object.body.moves = false;

        if (Config.config.physics.arcade.debug) scene.add.text(this.object.x, this.object.y, `${nivel[y][x].grupo}`, { font: 'lighter 65px Arial', color: 'white', stroke: '#000', strokeThickness: 8}).setOrigin(0.5);
    }
}

export class BolitaFantasma{
    object: any;
    x: number = 0;
    y: number = 0;
    speed: number = 0;
    rotacion: number = 0;

    constructor(scene, x, y, scale, speed = 0, rotacion = 0) {
        this.speed = speed;
        this.object = scene.physics.add.sprite(x,y,'tatu_bebe');

        this.object.setScale(scale);
        this.object.depth = 5;
        this.object.rotation = rotacion;
        this.object.body.allowGravity = false;
        this.object.setVisible(true);

        scene.physics.velocityFromRotation(this.object.rotation, this.speed, this.object.body.velocity);
        this.object.velocidad = this.speed;
        this.object.setBounce(1);
        this.object.body.setCircle(this.object.width/2);
    }

    // updatePos(x, y, rotation, scene, velocidad) {
    //     this.object.x = x;
    //     this.object.y = y;
    //     this.object.rotation = rotation;
    //     scene.physics.velocityFromRotation(this.object.rotation, velocidad, this.object.body.velocity);
    // }

}

export class BolitaLanzada {
    object: any;
    x: number = 0;
    y: number = 0;

    constructor(scene, x, y, scale, data, rotacion) {
        this.object = scene.physics.add.sprite(x,y,'tatu_bebe');

        this.object.setScale(scale);
        this.object.depth = 0;
        this.object.rotation = rotacion;
        this.object.body.allowGravity = false;

        let speed = 1000;

        scene.physics.velocityFromRotation(this.object.rotation, speed, this.object.body.velocity);
        this.object.velocidad = speed;
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
            rotate: { start: this.object.angle - 90, end: this.object.angle - 90 },
        });
        particles.depth = -1;

        emitter.setPosition(x, y);
        emitter.startFollow(this.object);
        emitter.setBlendMode(Phaser.BlendModes.NORMAL);
        
        this.object.emitter = emitter;
    }
}

export class BolitaDeck {
    object: Phaser.GameObjects.Sprite;
    lastX: number;
    x: number = 0;
    y: number = 0;
    nextBolita: number = 0;
    data: any;
    scene: any;
    scale: any;

    constructor(scene, scale, data) {
        for(let i = data.deck.length - 1; i > -1; i--) {
            this.object = scene.add.sprite(900 - (i * 300),1800,'tatu_bebe');
            this.object.setTint(data.burbujas[data.deck[i].color].color);
            data.setObjInDeck(this.object, i);
            this.object.setDepth(5);
            this.object.setScale(scale);
            this.nextBolita = i;
            this.data = data;
            this.scene = scene;
            this.scale = scale;
        }
    }

    agregrarBolita(color, data) {
        let object = this.scene.add.sprite(data.deck[data.deck.length - 1].obj.x - 300,1800,'tatu_bebe');
        object.setScale(this.scale);
        object.setTint(data.burbujas[color].color);

        data.deck.push({obj: object, type: 0, color: color});
    }
}

export class BolitaDeck2 {
    bolitas: any;
    lastX: number;
    x: number = 0;
    y: number = 0;
    data: any;
    scene: any;
    scale: any;

    constructor(scene, scale, data, matriz, x, y) {
        this.x = x;
        this.y = y;
        this.bolitas = [];
        this.lastX = 0;
        this.data = data;
        this.scene = scene;
        this.scale = scale;

        let deck = Matriz.deckFromMatriz(matriz, data);
        data.deck = deck;

        deck.forEach((element, index) => {
            element.obj = this.agregarBolita(scene, data, scale, data.burbujas[element.color].color);
        });
    }

    update() {
        this.bolitas.forEach((bolita, index) => {
            if (Math.round(bolita.x) != (this.x - (index * 300))) {
                this.scene.tweens.add({
                    targets: this.bolitas[index],
                    x: this.x - (index * 300),
                    duration: 250,
                    yoyo: false,
                    ease: 'Power1',
                    loop: 0,
                    onStart: function () {
                        if (!bolita.anims.isPlaying) bolita.anims.play('tatu_bebe_camina', true);
                    }
                });
                
            }else {
                bolita.anims.pause();
            }
        });
    }

    tirar(){
        this.x += 300;
    }

    agregarBolita(scene, data, scale, color, key = 'tatu_bebe') {
        let bolita = scene.add.sprite(-1800, this.y, key);
        bolita.setTint(color);
        bolita.setDepth(4);
        bolita.setScale(scale);
        this.bolitas.push(bolita);

        return bolita;
    }

    agregarBolitaAlDeck(color) {
        this.data.deck.push(
            {obj: this.agregarBolita(this.scene, this.data, this.scale, this.data.burbujas[color].color), type: 0, color: color}
        );
    }

    reemplazarColor(coloresNuevos) {
        if(coloresNuevos.length != 0){
            this.data.deck.forEach((bolita, index) => {
                let cont = 0;
                coloresNuevos.forEach(color =>{
                    if(this.data.bolitaColorATextura[bolita.obj.tintTopLeft] == color){
                        cont++;
                    }
                })
                if(cont == 0){
                    let _ = coloresNuevos[Phaser.Math.Between(0,coloresNuevos.length-1)];
                    let scene = this.scene;
                    let colorI = this.data.bolitasTextYColors[_];
                    this.scene.tweens.addCounter({
                        from: -bolita.obj.scale,
                        to: bolita.obj.scale,
                        ease: 'Cubic',
                        duration: 500,
                        onUpdate: function (tween)
                        {
                            const value = tween.getValue();
                            if (value > 0) {
                                bolita.obj.setTint(colorI);
                            }
                            bolita.obj.scale = Math.abs(value);
                        }
                    });
                    bolita.color = this.data.bolitasTextYColorsInt[_];
                }
            });
        }
    }

    removerBolita(index) {
        if (this.data.bolitaALanzar != this.data.deck.length - 1) {
            this.bolitas.splice(index, 1);
            this.data.deck[index].obj.destroy();
            this.data.deck.splice(index, 1);
            this.scene.tweens.add({
                targets: this.data.deck[this.data.bolitaALanzar].obj,
                rotation: this.data.lanzador.rotation - (Math.PI/2),
                duration: 400,
                yoyo: false,
                ease: 'Linear',
                loop: 0,
            });
        }
    }
}