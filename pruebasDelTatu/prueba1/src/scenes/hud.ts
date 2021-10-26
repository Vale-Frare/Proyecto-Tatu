import Phaser from 'phaser';
import Config from '../config';

export default class Hud extends Phaser.Scene {
    private tiempo_inicial;
    private un_segundo:number = 1000;
    private texto_tiempo;
    private texto_acciones: Phaser.GameObjects.Text;
    private blur: Phaser.GameObjects.Sprite;
    private tweensActivos = {};

    constructor(tiempo_inicial: number = 120) {
        super({ key: "hud" , active: true});
        this.tiempo_inicial = tiempo_inicial;
    }

    preload() {
        this.load.image("blur", "assets/img/blur.png"); 
    }

    create(){
        this.texto_tiempo = this.add.text(532, 50, 'TIEMPO 02:00', { fontFamily: 'Arial', fontSize: '42px', color: '#D4D75B', fontStyle: 'bold'}).setOrigin(0.5).setDepth(5);

        this.blur = this.add.sprite(0, 0,'blur').setOrigin(0).setDepth(3).setVisible(false).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.blur.setTint(0x000000);
        this.blur.alpha = 0.9;
    }

    update(time, delta){

        this.updateTiempo(delta);

    }

    updateTiempo(delta){

        this.un_segundo -= delta;
        
        if(this.un_segundo <= 0 && this.tiempo_inicial > 0){
            this.tiempo_inicial--
            this.un_segundo += 1000;

            let segundos = 0;
            let minutos = 0;

            if(this.tiempo_inicial>59){
                minutos = Math.floor(this.tiempo_inicial/60)
            }
            segundos = this.tiempo_inicial - (minutos*60);

            this.textoTiempo('TIEMPO ' + this.agregarCero(minutos) + ':' + this.agregarCero(segundos));
        }
        else{
            if(this.tiempo_inicial <= 0){
                this.textoTiempo('TIEMPO 00:00');
            }
        }

    }

    textoTiempo(texto){

        return this.texto_tiempo.setText(texto);

    }

    agregarCero(numero){

        let resultado = '';
        if(numero > 9){
            resultado = resultado + numero;
        }
        else{
            resultado = '0' + numero;
        }

        return resultado;

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

                    if (element.properties) {
                        element.properties.forEach(prop => {
                            if (prop.name == "depth_offset") {
                                obj.setDepth(obj.depth + parseInt(prop.value));
                            }
                        });
                    }

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
                                        grupos[animation_id].forEach(element => {
                                            initial_pos.push({x: element.x, y: element.y});
                                        });
                                    }
                                },
                                onUpdate: () => {
                                    paths[animation_id].getPoint(follower.tiempo, follower.pos);
                                    grupos[animation_id].forEach((element, index) => {
                                        element.x = follower.pos.x + (initial_pos[index].x - initial_pos[0].x);
                                        element.y = follower.pos.y + (initial_pos[index].y - initial_pos[0].y);
                                    });
                                },
                                onComplete: () => {
                                    paths[animation_id] = this.revertirPath(nodos);
                                    follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                                    initial_pos = [];
                                }
                            });
                        });
                        if (element.properties) {
                            element.properties.forEach(prop => {
                                if (prop.name == "action") {
                                    let callback: string = prop.value;
                                    obj.setInteractive().on("pointerdown", () => {eval(`this.${callback}("${animation_id}");`)}, this);
                                }
                            });
                        }
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

        console.log(tweens);
        this.tweensActivos = tweens;
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

    mostrarAcciones(deck_lenght: number){
        this.texto_acciones = this.add.text(532, 125, 'ACCIONES  ' + deck_lenght, { fontFamily: 'Arial', fontSize: '40px', color: '#D4D75B', fontStyle: 'bold'}).setOrigin(0.5).setDepth(4);
    }

    updateAcciones(deck_lenght: number){
        return this.texto_acciones.setText('ACCIONES  ' + deck_lenght);
    }

    pausa(animation_id: string) {
        console.log(this.tweensActivos);
        if (!this.tweensActivos[animation_id].isPlaying()) {
            this.blur.setVisible(!this.blur.visible);
        }
    }

}