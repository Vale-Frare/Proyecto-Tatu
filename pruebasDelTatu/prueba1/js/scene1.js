class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    create() {
        console.log("Escena 1 nya");
        text1 = this.add.text(0, 0, `Cantidad de bolitas: ${bolitas.length}`, {fontSize: '75px', fill: 'white'}).setOrigin(0);

        lanzador = this.add.sprite(900,1800,'flecha');

        this.input.on('pointerup', this.tiro, this);

        for(let i = deck.length - 1; i > -1; i--) {
            let bolita = this.add.sprite(900 - (i * 300),1800,'bolita');
            deck[i].obj = bolita;
            bolita.setTint(deck[i].color);
            bolita.setScale(0.4);
        }

        this.cargarNivel(0);
    }

    update() {
        text1.text = `Cantidad de bolitas: ${bolitas.length}`;

        lanzador.rotation = (game.input.mousePointer.x*.001)-.9;

        bolitas.forEach(bolita => {
            this.physics.velocityFromRotation(bolita.angle, 2600, bolita.body.velocity);
            if (bolita.y < 0) {
                bolitas.splice(bolitas.indexOf(bolita), 1)
                bolita.destroy();
            }
        });
    }

    tiro() {
        if (bolitaALanzar >= deck.length - 1) {
            return;
        }
        if (bolitaALanzar >= deck.length - 2) {
            deck.forEach(bolita => {
                bolita.obj.x += 300;
            });
        }
        deck.forEach(bolita => {
            bolita.obj.x += 300;
        });
        bolitaALanzar += 1;
        let bolita = this.physics.add.sprite(900,1800,'bolita');
        bolita.setTint(deck[bolitaALanzar].color);
        bolita.setScale(0.4);
        bolita.depth = -1;
        bolita.angle = lanzador.rotation - 1.57;
        bolitas.push(bolita);
        bolita.body.setCircle(200);

        nivelCargado.forEach(bolitaD => {
            this.physics.add.collider(bolitaD, bolita);
        }, this);
    }

    createRandomMatrix() {
        let matrix = [];
        let nivel = niveles[0]
        for (let y = 0; y < nivel.length; y++) {
            let row = [];
            for (let x = 0; x < nivel[y].length; x++) {
                row.push(Math.floor(Math.random() * 3));
            }
            matrix.push(row);
        }
        return matrix;
    }

    cargarNivel(index) {
        console.log(this.createRandomMatrix());
        let nivel = niveles[index];

        for (let y = 0; y < nivel.length; y++) {
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x] != -1) {
                    let bolita;

                    if (y % 2 == 0) {
                        bolita = this.physics.add.sprite((x * 160) + 90, (y * 120) + 90, 'bolita');
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.setTint(burbujas[nivel[y][x]].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);
                    } else {
                        bolita = this.physics.add.sprite((x * 160) + 170, (y * 120) + 90, 'bolita');
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.setTint(burbujas[nivel[y][x]].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);
                    }

                    nivelCargado.push(bolita);
                }
            }
        }
    }
}