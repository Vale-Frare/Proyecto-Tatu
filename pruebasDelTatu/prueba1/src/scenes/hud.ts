export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: "hud" , active: true});
    }

    preload() {
        this.load.image("cosa_verde", "assets/hud/cosa_verde.png");
        this.load.image("pausa", "assets/hud/pausa.png");
        this.load.image("sonido_1", "assets/hud/sonido_1.png");
        this.load.image("sonido_2", "assets/hud/sonido_2.png");
    }

    mostrarHud(key: string) {
        console.log("mostrarHud");
        let hudAMostrar = JSON.parse(localStorage.getItem(key));
        let objetos = [];
        let scene = this;

        if (hudAMostrar != null) {
            Object.keys(hudAMostrar).forEach(key => {
                let layer = hudAMostrar[key];

                layer.content.forEach(element => {
                    let obj;

                    obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);
                    obj.setDepth(layer.depth);

                    objetos.push(obj);
                });
            });
        }

        scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            onUpdate: function (tween) {
                objetos.forEach(obj => {
                    obj.setAlpha(tween.getValue());
                });
            }
        });

        return ":D";
    }

    static mostrarHud(key: string) {
        console.log("mostrarHud");
        this.mostrarHud(key);
    }
}