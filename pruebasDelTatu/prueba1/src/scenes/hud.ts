import Phaser from 'phaser';

export default class Hud extends Phaser.Scene {
    constructor() {
        super({ key: "hud" , active: true});
    }

    preload() {
        
    }

    mostrarHudPosta(key: string) {
        let hudAMostrarLayers = JSON.parse(localStorage.getItem(key)).layers;
        let hudAMostrar = JSON.parse(localStorage.getItem(key));
        let objetos = [];
        let scene = this;

        if (hudAMostrarLayers != null) {
            Object.keys(hudAMostrarLayers).forEach(key => {
                let layer = hudAMostrarLayers[key];
                layer.content.forEach(element => {
                    let obj;
                    console.log(element.name);
                    obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);
                    
                    obj.x += obj.width/2;
                    obj.y -= obj.height/2;
                    obj.setDepth(layer.depth);

                    if (key == "hud_botones") {
                        let follower = {tiempo: 0, x: 0, y: 0};

                        if (element.properties) {
                            element.properties.forEach(prop => {
                                if (prop.name == "animation_id") {
                                    let value = hudAMostrar.animations[prop.value];
                                    let path = new Phaser.Curves.Path(value[0].x, value[0].y);
                                    
                                    for(let i = 0; i < value.length; i+=3) {
                                        if (i != value.length - 1) {
                                            path.cubicBezierTo(value[i+3].x, value[i+3].y, value[i+1].x, value[i+1].y, value[i+2].x, value[i+2].y);
                                        }
                                    }

                                    let graphics = this.add.graphics();

                                    graphics.clear();
                                    graphics.lineStyle(2, 0xffffff, 1);

                                    path.draw(graphics);
                                }
                                if (prop.name == "animation_type") {
                                    
                                }
                                if (prop.name == "action") {
                                    
                                }
                            });
                        }
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