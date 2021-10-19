export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: "hud" , active: true});
    }

    preload() {
        // this.load.image("cosa_verde", "assets/hud/cosa_verde.png");
        // this.load.image("pausa", "assets/hud/pausa.png");
        // this.load.image("sonido_1", "assets/hud/sonido_1.png");
        // this.load.image("sonido_2", "assets/hud/sonido_2.png");
    }

    mostrarHudPosta(key: string) {
        let hudAMostrar = JSON.parse(localStorage.getItem(key)).layers;
        let objetos = [];
        let scene = this;

        if (hudAMostrar != null) {
            Object.keys(hudAMostrar).forEach(key => {
                let layer = hudAMostrar[key];
                layer.content.forEach(element => {
                    let obj;
                    console.log(element.name);
                    obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);
                    
                    obj.x += obj.width/2;
                    obj.y -= obj.height/2;
                    obj.setDepth(layer.depth);

                    if (key == "hud_botones") {
                        obj.setInteractive();
                        let tweenDelObj;
                        obj
                        .on("pointerover", () => {
                            obj.setScale(1);
                            tweenDelObj = scene.tweens.add({
                                targets: obj,
                                scale: 1.1,
                                duration: 200,
                                ease: "Power1",
                                yoyo: true,
                                loop: -1
                            });
                        }).on("pointerout", () => {
                            tweenDelObj.stop();
                            tweenDelObj = scene.tweens.add({
                                targets: obj,
                                scale: 1,
                                duration: 400,
                                ease: "Power1",
                                loop: 0
                            });
                        });
                    }

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

    mostrarHud(key: string) {
        this.mostrarHudPosta(key);
    }
}