import Phaser from 'phaser';
import Config from '../config';

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
    private sm: any;
    private playable: boolean = false;
    private objetos;
    private refreshIdiomas = [];
    private botones_idiomas = {ingles: null, portugues: null, espaniol: null};

    constructor(tiempo_inicial: number = 60) {
        super({ key: "hud" , active: true});
        this.tiempo_inicial = tiempo_inicial;
        this.dato = {pausa: false};
    }

    preload() {
        this.load.image("blur", "assets/img/blur.png"); 
    }

    create(){
        this.sm = this.scene.get("soundManager");
        this.texto_tiempo = this.add.text(532, 50, '', { fontFamily: 'franklin_gothic_heavy', fontSize: '50px', color: '#D4D75B'}).setOrigin(0.5).setDepth(5);
    }

    update(time, delta){
        
        if(!this.dato.pausa){
            this.updateTiempo(delta);
        }

        let tm: any = this.scene.get('TranslateManager');
        Object.keys(this.botones_idiomas).forEach(key => {
            if (this.botones_idiomas[key]) {
                if(key == 'ingles' && tm.lang == 'en_US') {
                    this.botones_idiomas[key].alpha = 1;
                }else if(key == 'portugues' && tm.lang == 'pt_BR') {
                    this.botones_idiomas[key].alpha = 1;
                }else if(key == 'espaniol' && tm.lang == 'es_AR') {
                    this.botones_idiomas[key].alpha = 1;
                }else {
                    this.botones_idiomas[key].alpha = 0.5;
                }
            }
        });
        
    }

    pasarData(dato){
        this.dato = dato;
    }

    initTiempo() {
        let tm: any = this.scene.get('TranslateManager');
        this.texto_tiempo.setText(`${tm.getTextoEnLenguajeActual('hud.tiempo')}  60`).setVisible(false);
        this.blur = this.add.sprite(0, 0,'blur').setOrigin(0).setDepth(3).setVisible(true).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.blur.setTint(0x000000);
    }

    updateTiempo(delta){

        this.un_segundo -= delta;
        
        if(this.un_segundo <= 0 && this.tiempo_inicial > 0){
            this.tiempo_inicial--
            this.un_segundo += 1000;

            let tm: any = this.scene.get('TranslateManager');
            this.texto_tiempo.setText(`${tm.getTextoEnLenguajeActual('hud.tiempo')} ${this.tiempo_inicial}`);
        }
        else{
            if(this.tiempo_inicial <= 0){
                let tm: any = this.scene.get('TranslateManager');
                this.texto_tiempo.setText(`${tm.getTextoEnLenguajeActual('hud.tiempo')}  0`);
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
            if (key === "rayo_concientizador") {
                let pm:any = this.scene.get('ProgressManager');
                
                objetos.push(this.add.image(0, 0, pm.getLevelToPlay()).setOrigin(0).setDepth(3).setVisible(true));
            }else {
                objetos.push(this.add.image(0, 0, hudAMostrar.fondo).setOrigin(0).setDepth(3).setVisible(true));
            }
            this.dato.pausa = true;
        }

        if (hudAMostrarLayers != null) {
            Object.keys(hudAMostrarLayers).forEach(key => {
                let layer = hudAMostrarLayers[key];
                layer.content.forEach(element => {
                    let obj;
                    if (element.name.slice(0,6) == "titulo") {
                        obj = scene.add.image(element.x, element.y, element.name).setAlpha(0).setVisible(false);
                    }
                    else if (element.name.slice(0,5) == "texto") {
                        obj = scene.add.image(element.x, element.y, element.name).setAlpha(0).setVisible(false);
                    }else {
                        obj = scene.add.image(element.x, element.y, element.name).setAlpha(0);
                    }

                    if (element.name == "boton_espaniol") {
                        this.botones_idiomas.espaniol = obj;
                    }
                    if (element.name == "boton_ingles") {
                        this.botones_idiomas.ingles = obj;
                    }
                    if (element.name == "boton_portugues") {
                        this.botones_idiomas.portugues = obj;
                    }

                    this.playable = hudAMostrar.playable;
                    if (hudAMostrar.playable) {
                        this.initTiempo();
                        this.texto_tiempo.setVisible(true);
                    }

                    obj.x += obj.width/2;
                    obj.y -= obj.height/2;
                    obj.setDepth(layer.depth);

                    let pretexto;

                    if (element.name) {
                        if (element.name.slice(0,6) == "titulo") {
                            pretexto = objetos[objetos.push(this.add.rectangle(element.x, element.y, element.width, element.height, 0x000000).setOrigin(0,0).setDepth(5).setVisible(false)) - 1];
                        }
                        if (element.name.slice(0,5) == "texto") {
                            if (element.name.slice(0,10) == "texto_rayo") {
                                pretexto = objetos[objetos.push(this.add.rectangle(element.x, element.y, element.width, element.height, 0x000000).setOrigin(0,0).setDepth(5).setVisible(false)) - 1];
                            }else {
                                pretexto = objetos[objetos.push(this.add.rectangle(element.x, element.y, element.width, element.height, 0x000000).setOrigin(0,0).setDepth(5).setVisible(false)) - 1];
                            }
                        }
                    }

                    let texto;

                    if (element.properties) {
                        element.properties.forEach(prop => {
                            if (prop.name == "anim") {
                                if (prop.value == "girar") {
                                    this.tweens.add({
                                        targets: obj,
                                        angle: 360,
                                        duration: 1000,
                                        ease: 'Power1',
                                        yoyo: true,
                                        repeat: -1
                                    });
                                }
                            }
                            if (prop.name == "depth_offset") {
                                obj.setDepth(obj.depth + parseInt(prop.value));
                            }
                            if (prop.name == "text") {
                                let tm: any = this.scene.get("TranslateManager");

                                let px = element.properties.find(p => p.name === "text_font" );
                                let text_px = `${px ? px.value : 60}px`;

                                let family = element.properties.find(p => p.name === "text_font_family" );
                                let text_family = `${family ? family.value : 'Arial'}`;

                                let color = element.properties.find(p => p.name === "text_font_color" );
                                let text_color = `${color ? color.value : '#000'}`;

                                let style = element.properties.find(p => p.name === "text_font_style" );
                                let text_style = `${style ? style.value : 'normal'}`;

                                let stroke = element.properties.find(p => p.name === "text_font_stroke" );
                                let text_stroke = `${stroke ? stroke.value : '#fff 0'}`;

                                if (pretexto){
                                    if (element.name.slice(0,10) == "texto_rayo") {
                                        let pm:any = this.scene.get('ProgressManager');
                                        texto = this.add.text(pretexto.x + (pretexto.width/2), pretexto.y + (pretexto.height/2), tm.getTextoEnLenguajeActual(`rayo.texto.var${pm.getLevelToPlayInt() - 1}`), 
                                        { 
                                            fontFamily: text_family,
                                            fontSize: text_px, 
                                            color: text_color, 
                                            align:'center', 
                                            fontStyle: style,
                                            stroke: text_stroke.split(' ')[0],
                                            strokeThickness: parseInt(text_stroke.split(' ')[1])
                                        }
                                        ).setOrigin(0.5).setDepth(obj.depth + 1);
                                        objetos.push(texto);
                                        texto.name = prop.value;
                                        element.name == "boton" ? this.refreshIdiomas.push(texto): null;
                                        element.name == "titulo_idiomas" ? this.refreshIdiomas.push(texto): null;
                                    }else {
                                        texto = this.add.text(pretexto.x + (pretexto.width/2), pretexto.y + (pretexto.height/2), tm.getTextoEnLenguajeActual(prop.value), 
                                        { 
                                            fontFamily: text_family,
                                            fontSize: text_px, 
                                            color: text_color, 
                                            align:'center', 
                                            fontStyle: style,
                                            stroke: text_stroke.split(' ')[0],
                                            strokeThickness: parseInt(text_stroke.split(' ')[1])
                                        }
                                        ).setOrigin(0.5).setDepth(obj.depth + 1);
                                        objetos.push(texto);
                                        texto.name = prop.value;
                                        element.name == "boton" ? this.refreshIdiomas.push(texto): null;
                                        element.name == "titulo_idiomas" ? this.refreshIdiomas.push(texto): null;
                                    }
                                }else {
                                    texto = this.add.text(obj.x, obj.y, tm.getTextoEnLenguajeActual(prop.value), 
                                    { 
                                        fontFamily: text_family, 
                                        fontSize: text_px, 
                                        color: text_color, 
                                        align:'center', 
                                        fontStyle: style,
                                        stroke: text_stroke.split(' ')[0],
                                        strokeThickness: parseInt(text_stroke.split(' ')[1])
                                    }
                                    ).setOrigin(0.5).setDepth(obj.depth + 1);
                                    objetos.push(texto);
                                    texto.name = prop.value;
                                    element.name == "boton" ? this.refreshIdiomas.push(texto): null;
                                    element.name == "titulo_idiomas" ? this.refreshIdiomas.push(texto): null;
                                }
                            }
                        });
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
                                if (texto) {
                                    grupos[prop.value].push(texto);
                                    if (pretexto){
                                        grupos[prop.value].push(pretexto);
                                    }
                                }
                            }
                        });
                    }

                    if (key == "hud_botones") {
                        obj.name = element.name;
                        this.botones.push(obj);
                        let follower = {tiempo: 0, pos: new Phaser.Math.Vector2()};
                        let path;
                        let graphics = this.add.graphics();
                        graphics.fillStyle(0x555555, 1);
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
                                        
                                        let circle = new Phaser.Geom.Circle(50, 50, 255)
                                        graphics.fillCircleShape(circle);

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
                                if (prop.name == "level") {
                                    let zone = element.properties.find(propiedad => propiedad.name === "zone").value;
                                    let progressManager: any = this.scene.get('ProgressManager');
                                    let progress = progressManager.getProgressOfLevel(
                                        `zone${zone}`,
                                        prop.value
                                    );
                                    if (progress == true) {
                                        if (progressManager.getCurrentOfZone(`zone${zone}`) == `lvl${prop.value}`) {
                                            obj.setFrame(1);
                                            objetos.push(
                                                this.add.text(obj.x, obj.y, `${prop.value}`, { fontFamily: 'Arial', fontSize: '84px', color: 'Black', fontStyle: 'bold'}).setOrigin(0.5).setDepth(5)
                                            );
                                        }else {
                                            obj.setFrame(0);
                                            objetos.push(
                                                this.add.text(obj.x, obj.y, `${prop.value}`, { fontFamily: 'Arial', fontSize: '84px', color: 'Black', fontStyle: 'bold'}).setOrigin(0.5).setDepth(5)
                                            );
                                        }
                                    }else {
                                        obj.setFrame(2);
                                    }
                                }
                            });
                        }
                        let configTatu = {hitArea: new Phaser.Geom.Circle(obj.width/2, obj.height/2, obj.width/2), hitAreaCallback: Phaser.Geom.Circle.Contains}
                        let configTodo = {hitArea: new Phaser.Geom.Rectangle(0, 0, obj.width, obj.height), hitAreaCallback: Phaser.Geom.Rectangle.Contains}

                        obj.setInteractive(element.name == "tatusitos_niveles" ? configTatu: configTodo);
                        let tweenDelObj;
                        let tweenDelTextoDelObj;
                        obj
                        .on("pointerover", () => {
                            obj.setScale(1);
                            if (element.properties) {
                                if (element.properties.find(propiedad => propiedad.name === "text")) {
                                    tweenDelTextoDelObj = scene.tweens.add({
                                        targets: texto,
                                        scale: 1.1,
                                        duration: 200,
                                        ease: "Power1",
                                        yoyo: true,
                                        loop: -1
                                    });
                                }
                            }
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
                            if (element.properties) {
                                if (element.properties.find(propiedad => propiedad.name === "text")) {
                                    tweenDelTextoDelObj.stop();
                                    tweenDelTextoDelObj = scene.tweens.add({
                                        targets: texto,
                                        scale: 1,
                                        duration: 400,
                                        ease: "Power1",
                                        loop: 0
                                    });
                                }
                            }
                            tweenDelObj = scene.tweens.add({
                                targets: obj,
                                scale: 1,
                                duration: 400,
                                ease: "Power1",
                                loop: 0
                            });
                        }).on("pointerup", () => {
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
                                            if(animation_type == "pingpong") {
                                                this.idioma();
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
                                            if(animation_type == "pingpong") {
                                                paths[animation_id] = this.revertirPathPerma(nodos);
                                                
                                            }else {
                                                paths[animation_id] = this.revertirPath(nodos);
                                            }
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
                                    if (prop.value == "pausa") {obj.setInteractive().on("pointerup", () => {eval(`this.${callback}("${animation_id}");`)}, this)}
                                    else if (prop.value == "pausaYMapa") {obj.setInteractive().on("pointerup", () => {eval(`this.${callback}("${animation_id}", obj);`)}, this); this.boton_pausa = obj}
                                    else if (prop.value == "jugar_nivel_rapido") {(texto.text = this.evaluar_continuar_o_play()); obj.setInteractive().on("pointerup", () => {eval(`this.${callback}(obj);`)}, this)}
                                    else if (prop.value == "play_level") {obj.setInteractive().on("pointerup", () => {eval(`this.${callback}("${element.properties.find(propiedad => propiedad.name === "level").value}", ${element.properties.find(propiedad => propiedad.name === "zone").value});`)}, this);}
                                    else {
                                        let sehace = true;
                                        element.properties.forEach(prop => {
                                            if (prop.name == "scene") {
                                                obj.setInteractive().on("pointerup", () => {eval(`this.${callback}("${prop.value}");`)}, this)
                                                sehace = false;
                                            }
                                        });
                                        if (sehace) {
                                            obj.setInteractive().on("pointerup", () => {eval(`this.${callback}(obj);`)}, this);
                                        }
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

    evaluar_continuar_o_play() {
        let pm:any = this.scene.get('ProgressManager');
        let tm:any = this.scene.get('TranslateManager');

        if (pm.getProgressOfLevel('zone1', 2) == true) {
            return tm.getTextoEnLenguajeActual(`menuinicio.jugar.var1`)
        }
        else {
            return tm.getTextoEnLenguajeActual(`menuinicio.jugar.var0`)
        }
    }

    play_level(level: number, zone: number) {
        let progressManager: any = this.scene.get('ProgressManager');
        let progress = progressManager.getProgressOfLevel(`zone${zone}`, level);
        if (progress){
            progressManager.playLevelOfZone(level, zone);
            let scene = this.scene.get('SceneLvlSelect');
            scene.scene.switch('SceneRayo');
            scene.scene.resume();
            this.sm.playMusic("lvl_1", 0.1, true);
        }else {

        }
    }

    HEXToVBColor(rrggbb) {
        var bbggrr = rrggbb.substr(5, 3) + rrggbb.substr(3, 3) + rrggbb.substr(1, 3);
        return parseInt(bbggrr, 16);
    }

    mostrarHud(key: string) {
        this.limpiarAtributos();
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
        let tm: any = this.scene.get('TranslateManager');
        if (this.texto_acciones) {
            this.texto_acciones.text = `${tm.getTextoEnLenguajeActual('hud.acciones')}  ${deck_lenght}`;
        }else {
            this.texto_acciones = this.add.text(532, 125, `${tm.getTextoEnLenguajeActual('hud.acciones')}  ${deck_lenght}`, { fontFamily: 'franklin_gothic_heavy', fontSize: '42px', color: '#D4D75B'}).setOrigin(0.5).setDepth(4);
        }
    }

    updateAcciones(deck_lenght: number){
        if (!this.playable) return;
        let tm: any = this.scene.get('TranslateManager');
        return this.texto_acciones.setText(`${tm.getTextoEnLenguajeActual('hud.acciones')}  ${deck_lenght}`);
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
            let scene = this.scene.get("Scene1");

            this.sm.playMusic("main_menu", 0.1, true);

            this.mostrarHud("seleccion_niveles");
            scene.scene.switch("SceneLvlSelect");
            scene.scene.resume();
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

    blur_on(deptho: number = 3) {
        this.blur.depth = deptho;
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
            if (!this.si_no_es(element.name, [name, "sonido_1", "sonido_2", "boton_alargado", "arriba_izquierda", "boton_espaniol", "boton_ingles", "boton_portugues"])) {
                element.disableInteractive();
            }
        });
    }

    si_no_es(input: string, cosas: string[]) {
        let ret = false
        cosas.forEach(cosa => {
            if (input === cosa) {
                ret = true;
            }
        });
        return ret;
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
        let scene_rayo = this.scene.get('SceneRayo');
        scene_rayo.scene.switch(nivel);
        scene_rayo.scene.resume();
        this.mostrarHud("hud");        
    }

    nivel_mas_uno() {
        let pm: any = this.scene.get('ProgressManager');
        let nivel = pm.getNextLevel();
        pm.playLevelString(nivel);
        let scene_main = this.scene.get('Scene1');
        scene_main.scene.switch('SceneRayo');
        scene_main.scene.resume();
        this.sm.playMusic("lvl_1", 0.1, true);
    }

    jugar_nivel_rapido(obj) {
        let scene_main = this.scene.get('SceneMainmenu');
        let pm: any = this.scene.get('ProgressManager');
        pm.playLevelOfZone(pm.getCurrentOfZone(pm.getCurrentZone()).replace('lvl', ''), pm.getCurrentZone().replace('zone', ''));
        scene_main.scene.switch('SceneRayo');
        scene_main.scene.resume();
        this.sm.playMusic("lvl_1", 0.1, true);
    }

    limpiarAtributos(){
        if (this.objetos) {
            this.objetos.forEach(element => {
                if (element.name == "sonido_1") {
                    this.sonido_1 = element.frame.name == 0 ? true : false;
                }else if (element.name == "sonido_2") {
                    this.sonido_2 = element.frame.name == 0 ? true : false;
                }
                element.removeInteractive();
                element.destroy();
            });
        }
        this.refreshIdiomas = [];
        this.tiempo_inicial = 60;
        this.un_segundo = 1000;
        this.texto_acciones ? this.texto_acciones.destroy(): null;
        this.texto_tiempo ? this.texto_tiempo.destroy(): null;
        this.texto_acciones = null;
        // ACA SE CAMBIA EL TESTO
        this.texto_tiempo = this.add.text(532, 50, '', { fontFamily: 'franklin_gothic_heavy', fontSize: '50px', color: '#D4D75B'}).setOrigin(0.5).setDepth(5);
        this.blur ? this.blur.destroy(): null;
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
        this.tiempo_inicial = 60;
        this.un_segundo = 1000;
        let tm: any = this.scene.get('TranslateManager');
        this.texto_tiempo.setText(`${tm.getTextoEnLenguajeActual('hud.tiempo')} 60`);
        scene.scene.restart();
        this.play_animacion_invertida("nodos_2", true);
        this.reactivar_todo();
        this.boton_pausa.setFrame(0);
        this.blur_off();
        this.dato.pausa = false;
        this.hacer_una_vez = true;
        this.sm.playMusic("lvl_1", 0.1, true);
    } 

    reiniciar_pausa() {
        let scene = this.scene.get("Scene1");
        this.tiempo_inicial = 60;
        this.un_segundo = 1000;
        let tm: any = this.scene.get('TranslateManager');
        this.texto_tiempo.setText(`${tm.getTextoEnLenguajeActual('hud.tiempo')} 60`);
        scene.scene.restart();
        this.play_animacion_invertida("nodos_0", true);
        this.reactivar_todo();
        this.boton_pausa.setFrame(0);
        this.blur_off();
        this.dato.pausa = false;
        this.hacer_una_vez = true;
    }

    seleccion_niveles() {
        let scene = this.scene.get("SceneMainmenu");
        scene.scene.switch("SceneLvlSelect");
        scene.scene.resume();
    }

    main_menu(){
        let scene = this.scene.get("SceneLvlSelect");
        scene.scene.switch("SceneMainmenu");
        scene.scene.resume();
    }

    idioma() {
        if (this.blur.alpha == 0.9) {
            this.blur_off();
            this.reactivar_todo();
        } else {
            this.blur_on(7);
            this.desactivar_todo_menos('configuracion');
        }
    }

    portugues_on() {
        let tm: any = this.scene.get('TranslateManager');
        tm.setLang('pt_BR');

        this.refreshIdiomas.forEach(element => {
            if (element.name == "menuinicio.jugar.var0") {
                element.setText(this.evaluar_continuar_o_play());
            }else {
                element.setText(tm.getTextoEnLenguajeActual(element.name));
            }
        });
    }

    espaniol_on() {
        let tm: any = this.scene.get('TranslateManager');
        tm.setLang('es_AR');

        this.refreshIdiomas.forEach(element => {
            if (element.name == "menuinicio.jugar.var0") {
                element.setText(this.evaluar_continuar_o_play());
            }else {
                element.setText(tm.getTextoEnLenguajeActual(element.name));
            }
        });
    }

    ingles_on() {
        let tm: any = this.scene.get('TranslateManager');
        tm.setLang('en_US');

        this.refreshIdiomas.forEach(element => {
            if (element.name == "menuinicio.jugar.var0") {
                element.setText(this.evaluar_continuar_o_play());
            }else {
                element.setText(tm.getTextoEnLenguajeActual(element.name));
            }
        });
    }
}