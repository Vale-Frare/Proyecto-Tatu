import Phaser from 'phaser';
import Config from '../config';
import SoundManager from './soundManager';

export default class Hud extends Phaser.Scene {
    private sonido_1 = true;
    private sonido_2 = true;

    private tiempo_inicial;
    private un_segundo:number = 1000;
    private texto_tiempo;
    private texto_acciones: Phaser.GameObjects.Text;
    private blur: Phaser.GameObjects.Sprite;
    private tweensActivos = {};
    private dato;
    private boton_pausa;
    private paths = {};
    private nodos = {};
    private grupos = {};
    private botones = [];
    private hacer_una_vez:boolean = true;
    private sm: SoundManager;
    private playable: boolean = false;
    private objetos;

    constructor(tiempo_inicial: number = 120) {
        super({ key: "hud" , active: true});
        this.tiempo_inicial = tiempo_inicial;
        this.dato = {pausa: false};
    }

    preload() {
        this.load.image("blur", "assets/img/blur.png"); 
    }

    create(){
        this.sm = this.scene.get("soundManager");
        this.texto_tiempo = this.add.text(532, 50, '', { fontFamily: 'Arial', fontSize: '42px', color: '#D4D75B', fontStyle: 'bold'}).setOrigin(0.5).setDepth(5);
    }

    update(time, delta){
        
        if(!this.dato.pausa){
            this.updateTiempo(delta);
        }
        
    }

    pasarData(dato){
        this.dato = dato;
    }

    initTiempo() {
        this.texto_tiempo.setText("TIEMPO 02:00");
        this.blur = this.add.sprite(0, 0,'blur').setOrigin(0).setDepth(3).setVisible(true).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.blur.setTint(0x000000);
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
                this.play_animacion("nodos_2");
                this.desactivar_todo_menos("boton_reiniciar");
                this.cambiar_boton_niveles();
                this.dato.pausa = true;
                this.sm.playMusic("derrota", 0.1, false);
                this.sm.stopMusicPocoTiempo();
            }
            else{
                if(this.tiempo_inicial <= 10 && this.tiempo_inicial >= 1 && this.hacer_una_vez){
                    this.hacer_una_vez = false;
                    this.sm.playMusicPocoTiempo();
                }
            }
        }

    }

    textoTiempo(texto){
        if (!this.playable) return;
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

        if (!hudAMostrar.playable) {
            objetos.push(this.add.image(0, 0, hudAMostrar.fondo).setOrigin(0).setDepth(3).setVisible(true));
            this.dato.pausa = true;
        }

        if (hudAMostrarLayers != null) {
            Object.keys(hudAMostrarLayers).forEach(key => {
                let layer = hudAMostrarLayers[key];
                layer.content.forEach(element => {
                    let obj;
                    obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);

                    this.playable = hudAMostrar.playable;
                    if (hudAMostrar.playable) {
                        this.initTiempo();
                    }

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
                        obj.name = element.name;
                        this.botones.push(obj);
                        let follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                        let path;
                        let graphics = this.add.graphics();
                        let animation_id;
                        let animation_type;
                        let nodos;
                        let animado = false;

                        if (element.name == "sonido_1") {
                            obj.setFrame(this.sonido_1 ? 0 : 1);
                        }else if (element.name == "sonido_2") {
                            obj.setFrame(this.sonido_2 ? 0 : 1);
                        }

                        if (element.properties) {
                            element.properties.forEach(prop => {
                                if (prop.name == "animation_id") {
                                    animado = true;
                                    let value = hudAMostrar.animations[prop.value];
                                    path = new Phaser.Curves.Path(value[0].x, value[0].y);
                                    nodos = value;
                                    this.nodos[prop.value] = nodos;
                                    animation_id = prop.value;
                                    
                                    for(let i = 0; i < value.length; i+=3) {
                                        if (i != value.length - 1) {
                                            path.cubicBezierTo(value[i+3].x, value[i+3].y, value[i+1].x, value[i+1].y, value[i+2].x, value[i+2].y);
                                        }
                                    }

                                    if (Config.config.physics.arcade.debug) {
                                        graphics.clear();
                                        graphics.lineStyle(10, this.HEXToVBColor(hudAMostrar.nodos_colores[prop.value]), 1);

                                        path.draw(graphics); 
                                    }
                                    paths[prop.value] = path;
                                    this.paths[prop.value] = path;
                                }
                                if (prop.name == "animation_type") {
                                    animation_type = prop.value;
                                }
                                if (prop.name == "frame") {
                                    obj.setFrame(prop.value);
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
                            if (animado) {
                                let initial_pos = [];
                                
                                if(obj.frame.name == "0" || obj.frame.name == "__BASE") {
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
                                }
                            }
                        });
                        if (element.properties) {
                            element.properties.forEach(prop => {
                                if (prop.name == "action") {
                                    let callback: string = prop.value;
                                    if (prop.value == "pausa") {obj.setInteractive().on("pointerdown", () => {eval(`this.${callback}("${animation_id}");`)}, this)}
                                    else if (prop.value == "pausaYMapa") {obj.setInteractive().on("pointerdown", () => {eval(`this.${callback}("${animation_id}", obj);`)}, this); this.boton_pausa = obj}
                                    else {
                                        element.properties.forEach(prop => {
                                            if (prop.name == "scene") {
                                                obj.setInteractive().on("pointerdown", () => {eval(`this.${callback}("${prop.value}");`)}, this)
                                            }else {
                                                obj.setInteractive().on("pointerdown", () => {eval(`this.${callback}(obj);`)}, this)
                                            }
                                        });
                                    };
                                }

                            });
                        }
                    }
                    this.grupos = grupos;
                    objetos.push(obj);
                });
            });
            this.objetos = objetos;
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

        this.tweensActivos = tweens;
        return ":D";
    }

    HEXToVBColor(rrggbb) {
        var bbggrr = rrggbb.substr(5, 3) + rrggbb.substr(3, 3) + rrggbb.substr(1, 3);
        return parseInt(bbggrr, 16);
    }

    mostrarHud(key: string) {
        this.mostrarHudPosta(key);
    }

    revertirPathPerma(nodos) {
        let nodosR = nodos.reverse();

        let path = new Phaser.Curves.Path(nodosR[0].x, nodosR[0].y);
        
        for(let i = 0; i < nodosR.length; i+=3) {
            if (i != nodosR.length - 1) {
                path.cubicBezierTo(nodosR[i+3].x, nodosR[i+3].y, nodosR[i+1].x, nodosR[i+1].y, nodosR[i+2].x, nodosR[i+2].y);
            }
        }

        return path;
    }

    revertirPath(nodos) {
        let nodosR = [];
        nodos.forEach(nodo => {
            nodosR.push(nodo);
        });
        nodosR = nodosR.reverse();

        let path = new Phaser.Curves.Path(nodosR[0].x, nodosR[0].y);
        
        for(let i = 0; i < nodosR.length; i+=3) {
            if (i != nodosR.length - 1) {
                path.cubicBezierTo(nodosR[i+3].x, nodosR[i+3].y, nodosR[i+1].x, nodosR[i+1].y, nodosR[i+2].x, nodosR[i+2].y);
            }
        }

        return path;
    }

    nodosToPath(nodos) {
        let nodosR = nodos;

        let path = new Phaser.Curves.Path(nodosR[0].x, nodosR[0].y);
        
        for(let i = 0; i < nodosR.length; i+=3) {
            if (i != nodosR.length - 1) {
                path.cubicBezierTo(nodosR[i+3].x, nodosR[i+3].y, nodosR[i+1].x, nodosR[i+1].y, nodosR[i+2].x, nodosR[i+2].y);
            }
        }

        return path;
    }

    mostrarAcciones(deck_lenght: number){
        if (!this.playable) return;
        if (this.texto_acciones) {
            this.texto_acciones.text = `ACCIONES  ${deck_lenght}`;
        }else {
            this.texto_acciones = this.add.text(532, 125, `ACCIONES  ${deck_lenght}`, { fontFamily: 'Arial', fontSize: '40px', color: '#D4D75B', fontStyle: 'bold'}).setOrigin(0.5).setDepth(4);
        }
    }

    updateAcciones(deck_lenght: number){
        if (!this.playable) return;
        return this.texto_acciones.setText('ACCIONES  ' + deck_lenght);
    }

    pausaYMapa(animation_id: string, obj: any) {
        if (obj.frame.name == 0) {
            obj.setFrame(1);
            this.play_animacion("nodos_0", true);
            this.blur_on();
            this.dato.pausa = true;
            if (this.tweensActivos[animation_id]) {
                if (!this.tweensActivos[animation_id].isPlaying()) {
                    this.tweens.add({
                        targets: this.blur,
                        alpha: this.blur.alpha == 0 ? 0.9 : 0,
                        duration: 1000,
                        ease: 'Power2',
                        yoyo: false,
                        repeat: 0
                    });
                }
            }
        }else {
            console.log("Se va pal mapa");
        }
    }

    mute_sonido_1(obj){
        obj.setFrame(obj.frame.name == 0 ? 1 : 0);
        
        if(obj.frame.name == 0){
            this.sm.muteMusic(false);
        }
        else{
            this.sm.muteMusic(true);
        }
    }

    mute_sonido_2(obj){
        obj.setFrame(obj.frame.name == 0 ? 1 : 0);
        if(obj.frame.name == 0){
            this.sm.muteSound(false);
        }
        else{
            this.sm.muteSound(true);
        }
    }

    play_animacion(animation_id: string, pingpong: boolean = true, blur: boolean = true) {
        let follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
        let initial_pos = [];
        let paths = this.paths;
        let nodos = this.nodos[animation_id];
        let grupos = this.grupos;
        this.tweensActivos[animation_id] = this.tweens.add({
            targets: follower,
            tiempo: 1,
            ease: 'Power2',
            duration: 1000,
            yoyo: false,
            repeat: 0,
            onStart: () => {
                this.blur_on();
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
                if (pingpong) {
                    follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                    initial_pos = [];
                }
            }
        });
    }

    play_animacion_invertida(animation_id: string, blur: boolean = false) {
        let follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
        let initial_pos = [];
        let path = this.revertirPath(this.nodos[animation_id]);
        let grupos = this.grupos;
        this.tweensActivos[animation_id] = this.tweens.add({
            targets: follower,
            tiempo: 1,
            ease: 'Power2',
            duration: 1000,
            yoyo: false,
            repeat: 0,
            onStart: () => {
                this.blur_off();
                if (initial_pos.length == 0) {
                    grupos[animation_id].forEach(element => {
                        initial_pos.push({x: element.x, y: element.y});
                    });
                }
            },
            onUpdate: () => {
                path.getPoint(follower.tiempo, follower.pos);
                grupos[animation_id].forEach((element, index) => {
                    element.x = follower.pos.x + (initial_pos[index].x - initial_pos[0].x);
                    element.y = follower.pos.y + (initial_pos[index].y - initial_pos[0].y);
                });
            },
            onComplete: () => {
                
            }
        });
    }

    blur_blur() {
        try {
            this.tweens.add({
                targets: this.blur,
                alpha: this.blur.alpha == 0 ? 0.9 : 0,
                duration: 1000,
                ease: 'Power2',
                yoyo: false,
                repeat: 0
            });
        }catch (e) {
            setTimeout(() => {
                this.tweens.add({
                    targets: this.blur,
                    alpha: this.blur.alpha == 0 ? 0.9 : 0,
                    duration: 1000,
                    ease: 'Power2',
                    yoyo: false,
                    repeat: 0
                });
            }, 1000);
        }
    }

    blur_off() {
        this.tweens.add({
            targets: this.blur,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            yoyo: false,
            repeat: 0
        });
    }

    blur_on() {
        this.tweens.add({
            targets: this.blur,
            alpha: .9,
            duration: 1000,
            ease: 'Power2',
            yoyo: false,
            repeat: 0
        });
    }

    desactivar_todo_menos(name: string) {
        this.botones.forEach(element => {
            if (element.name != name && element.name != "sonido_1" && element.name != "sonido_2") {
                element.disableInteractive();
            }
        });
    }

    reactivar_todo() {
        this.botones.forEach(element => {
            element.setInteractive();
        });
    }

    cambiar_boton_niveles() {
        this.boton_pausa.setFrame(this.boton_pausa.frame.name == 0 ? 1 : 0);
    }

    siguiente_nivel(nivel) {
        if (!nivel) return;
        if (typeof nivel !== "string") return;
        let scene_rayo = this.scene.get('Scene1');
        scene_rayo.scene.switch(nivel);
        let len = this.dato.deck.length;
        
        this.limpiarAtributos();
        this.mostrarHud("hud");
        this.mostrarAcciones(len);
        
    }

    limpiarAtributos(){
        this.objetos.forEach(element => {
            if (element.name == "sonido_1") {
                this.sonido_1 = element.frame.name == 0 ? true : false;
            }else if (element.name == "sonido_2") {
                this.sonido_2 = element.frame.name == 0 ? true : false;
            }
            element.destroy();
        });
        this.tiempo_inicial = 120;
        this.un_segundo = 1000;
        this.texto_tiempo = this.add.text(532, 50, '', { fontFamily: 'Arial', fontSize: '42px', color: '#D4D75B', fontStyle: 'bold'}).setOrigin(0.5).setDepth(5);
        this.blur = this.add.sprite(0, 0,'blur').setOrigin(0).setDepth(3).setVisible(true).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.blur.setTint(0x000000);
        this.tweensActivos = {};
        this.boton_pausa = null;
        this.paths = {};
        this.nodos = {};
        this.grupos = {};
        this.botones = [];
        this.hacer_una_vez = true;
        this.sm = this.scene.get("soundManager");
        this.dato.pausa = false;
    }

    reanudar() {
        this.reactivar_todo();
        this.boton_pausa.setFrame(0);
        this.play_animacion_invertida("nodos_0", true);
        this.blur_off();
        this.dato.pausa = false;
    }
 
    reiniciar_derrota() {
        let scene = this.scene.get("Scene1");
        this.tiempo_inicial = 120;
        this.un_segundo = 1000;
        this.texto_tiempo.setText("TIEMPO 02:00");
        scene.scene.restart();
        this.play_animacion_invertida("nodos_2", true);
        this.reactivar_todo();
        this.boton_pausa.setFrame(0);
        this.blur_off();
        this.dato.pausa = false;
        console.log("Reiniciar niveEEEEEEEEEEEEEEEEEEEEEEEELLL 😒😢😒😥😓😪")
    } 

    reiniciar_pausa() {
        let scene = this.scene.get("Scene1");
        this.tiempo_inicial = 120;
        this.un_segundo = 1000;
        this.texto_tiempo.setText("TIEMPO 02:00");
        scene.scene.restart();
        this.play_animacion_invertida("nodos_0", true);
        this.reactivar_todo();
        this.boton_pausa.setFrame(0);
        this.blur_off();
        this.dato.pausa = false;
        console.log("Reiniciar niveEEEEEEEEEEEEEEEEEEEEEEEELLL 😒😢😒😥😓😪")
    }
}