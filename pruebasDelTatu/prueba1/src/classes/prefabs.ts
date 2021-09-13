import Phaser from 'phaser';

export default class Bolita {
    object: Phaser.Physics.Arcade.Sprite;
    x: number = 0;
    y: number = 0;

    constructor(scene, x, y, ancho, alto, bolitasTexturas, nivel, anchoBasura, altoBasura, inpar = false) {
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
        this.object.body.setCircle(this.width/2);
        this.object.body.moves = false;
    }
}