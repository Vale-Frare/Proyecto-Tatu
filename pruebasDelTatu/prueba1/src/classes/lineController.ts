import Phaser from 'phaser';

export class lineController {  
    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;
    private spacing: number;
    private cantidad_bolitas: number;
    private bolitas = [];

    constructor(x1: number, y1: number, x2: number, y2: number, cantidad_bolitas: number, scale: number, scene: Phaser.Scene) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.cantidad_bolitas = cantidad_bolitas;
        //this.spacing = Math.abs(Math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2)) / cantidad_bolitas;

        for (let i = 0; i < cantidad_bolitas + 1; i++) {
            if (i != 0) {
                var _ = scene.add.circle(Phaser.Math.Linear(x1, x2, i/cantidad_bolitas), Phaser.Math.Linear(y1, y2, i/cantidad_bolitas), scale, 0x000000);
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
            b.setTint(color);
        });
    }

    updatePos(x:number, y:number) {
        for (let i = 0; i < this.bolitas.length; i++) {
            this.bolitas[i].x = Phaser.Math.Linear(this.x1, x, i/this.cantidad_bolitas);
            this.bolitas[i].y = Phaser.Math.Linear(this.y1, y, i/this.cantidad_bolitas);
        }
    }

    updatePosLauncher(x, y, rotacion){
        // sergio: después hago esto si es que me sale.
        for (let i = 0; i < this.bolitas.length; i++) {
            this.bolitas[i].x = Phaser.Math.Linear(this.x1, x, i/this.cantidad_bolitas);
            this.bolitas[i].y = Phaser.Math.Linear(this.y1, y, i/this.cantidad_bolitas);
        }
    }
}