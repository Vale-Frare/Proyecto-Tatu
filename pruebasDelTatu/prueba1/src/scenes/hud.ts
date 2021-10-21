import Phaser from 'phaser';
import Config from '../config';

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
        let grupos = {nodos_0: []};
        let paths = {};
        let tweens = {};

        if (hudAMostrarLayers != null) {
            Object.keys(hudAMostrarLayers).forEach(key => {
                let layer = hudAMostrarLayers[key];
                layer.content.forEach(element => {
                    let obj;
                    console.log(element.name);
                    obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);

                    if (element.properties) {
                        element.properties.forEach(prop => {
                            if (prop.name == "path") {
                                if (grupos[prop.value]) {
                                    grupos[prop.value].push(obj);
                                }else {
                                    grupos[prop.value] = [];
                                    grupos[prop.value].push(obj);
                                }
                            }
                        });
                    }
                    
                    obj.x += obj.width/2;
                    obj.y -= obj.height/2;
                    obj.setDepth(layer.depth);

                    if (key == "hud_botones") {
                        let follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                        let path;
                        let graphics = this.add.graphics();
                        let animation_id;
                        let animation_type;
                        let nodos;

                        if (element.properties) {
                            element.properties.forEach(prop => {
                                if (prop.name == "animation_id") {
                                    let value = hudAMostrar.animations[prop.value];
                                    path = new Phaser.Curves.Path(value[0].x, value[0].y);
                                    nodos = value;
                                    animation_id = prop.value;
                                    
                                    for(let i = 0; i < value.length; i+=3) {
                                        if (i != value.length - 1) {
                                            path.cubicBezierTo(value[i+3].x, value[i+3].y, value[i+1].x, value[i+1].y, value[i+2].x, value[i+2].y);
                                        }
                                    }

                                    if (Config.config.physics.arcade.debug) {
                                        graphics.clear();
                                        graphics.lineStyle(2, 0xffffff, 1);

                                        path.draw(graphics); 
                                    }
                                    paths[prop.value] = path;
                                }
                                if (prop.name == "animation_type") {
                                    animation_type = prop.value;
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
                        }).on("pointerdown", () => {
                            if (tweens[animation_id]) {
                                if (tweens[animation_id].isPlaying()) {
                                    return;
                                }
                            }
                            console.log(follower);
                            let initial_pos = [];
                            tweens[animation_id] = scene.tweens.add({
                                targets: follower,
                                tiempo: 1,
                                ease: 'Power2',
                                duration: 1000,
                                yoyo: false,
                                repeat: 0,
                                onStart: () => {
                                    if (initial_pos.length == 0) {
                                        console.log(grupos);
                                        grupos[animation_id].forEach(element => {
                                            console.log("se hace esto");
                                            initial_pos.push({x: element.x, y: element.y});
                                        });
                                    }
                                },
                                onUpdate: () => {
                                    console.log("se hace esto despues");
                                    paths[animation_id].getPoint(follower.tiempo, follower.pos);
                                    grupos[animation_id].forEach((element, index) => {
                                        element.x = follower.pos.x + (initial_pos[index].x - initial_pos[0].x);
                                        element.y = follower.pos.y + (initial_pos[index].y - initial_pos[0].y);
                                        //element.setDepth(20);
                                    });
                                },
                                onComplete: () => {
                                    paths[animation_id] = this.revertirPath(nodos);
                                    follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                                    initial_pos = [];
                                }
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

    revertirPath(nodos) {
        let nodosR = nodos.reverse();

        let path = new Phaser.Curves.Path(nodosR[0].x, nodosR[0].y);
        
        for(let i = 0; i < nodosR.length; i+=3) {
            if (i != nodosR.length - 1) {
                path.cubicBezierTo(nodosR[i+3].x, nodosR[i+3].y, nodosR[i+1].x, nodosR[i+1].y, nodosR[i+2].x, nodosR[i+2].y);
            }
        }

        return path;
    }
}