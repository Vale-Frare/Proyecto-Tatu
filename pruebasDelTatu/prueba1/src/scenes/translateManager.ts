import Phaser from 'phaser';
import {translateHelper} from '../classes/translateHelper';
import {hudHelper} from '../classes/hudHelper';

let tatu_girando;
let boton_continuar;
let texto_continuar;

export default class TranslateManager extends Phaser.Scene {
    public lang = 'en_US'
    public contenido = {
        'es_AR': {
            'key': 'texto',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null,
            'hud.reiniciar.var0': null,
            'rayo.titulo.var0': null,
            'rayo.continuar.var0': null,
            'niveles.titulo.var0': null,
            'hud.titulopausa.var0': null,
            'hud.reanudar.var0': null,
            'hud.titulovictoria.var0': null,
            'hud.siguientenivel.var0': null,
            'rayo.texto.var0': null,
            'rayo.texto.var1': null,
            'rayo.texto.var2': null,
            'rayo.texto.var3': null,
            'rayo.texto.var4': null,
            'hud.tituloderrota.var0': null,
            'hud.acciones': null,
            'menu.tituloidioma.var0': null,
            'hud.tiempo': null,
            'nivel.creditos.var0': null,
            'nivel.volver.var0': null
        },
        'en_US': {
            'key': 'text',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null,
            'hud.reiniciar.var0': null,
            'rayo.titulo.var0': null,
            'rayo.continuar.var0': null,
            'niveles.titulo.var0': null,
            'hud.titulopausa.var0': null,
            'hud.reanudar.var0': null,
            'hud.titulovictoria.var0': null,
            'hud.siguientenivel.var0': null,
            'rayo.texto.var0': null,
            'rayo.texto.var1': null,
            'rayo.texto.var2': null,
            'rayo.texto.var3': null,
            'rayo.texto.var4': null,
            'hud.tituloderrota.var0': null,
            'hud.acciones': null,
            'menu.tituloidioma.var0': null,
            'hud.tiempo': null,
            'nivel.creditos.var0': null,
            'nivel.volver.var0': null
        },
        'pt_BR': {
            'key': 'textinho',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null,
            'hud.reiniciar.var0': null,
            'rayo.titulo.var0': null,
            'rayo.continuar.var0': null,
            'niveles.titulo.var0': null,
            'hud.titulopausa.var0': null,
            'hud.reanudar.var0': null,
            'hud.titulovictoria.var0': null,
            'hud.siguientenivel.var0': null,
            'rayo.texto.var0': null,
            'rayo.texto.var1': null,
            'rayo.texto.var2': null,
            'rayo.texto.var3': null,
            'rayo.texto.var4': null,
            'hud.tituloderrota.var0': null,
            'hud.acciones': null,
            'menu.tituloidioma.var0': null,
            'hud.tiempo': null,
            'nivel.creditos.var0': null,
            'nivel.volver.var0': null
        }
    };

    constructor() {
        super({key:'TranslateManager', active: true});
        this.lang = localStorage.getItem('lang') || this.getLangFromNavigator();
    }

    getLangFromNavigator() {
        const langs = {
            'es': 'es_AR',
            'en': 'en_US',
            'pt': 'pt_BR'
        }
        if (langs[navigator.language.substring(0, 2)]){
            return langs[navigator.language.substring(0, 2)];
        }else {
            return 'en_US';
        }
    }

    async preload(){
        this.load.image("logo_carga", "assets/hud/logo_carga.png");
        this.load.image("carga", "assets/hud/carga.png");
        this.load.image("boton_chico", "assets/hud/boton_chico.png");
        
        this.load.on('complete', async i => {
            await hudHelper.cargarHudDesdeJson("assets/nivel/carga.json");

            let hud: any = this.scene.get("hud");
            hud.mostrarHud('carga');
            tatu_girando = hud.posible_tatu_girando;
            tatu_girando.alpha = 1;
            boton_continuar = hud.posible_boton_continuar;
            boton_continuar.alpha = 0;
            texto_continuar = hud.texto_boton_continuar;
            texto_continuar.alpha = 0;

            this.add.text(0, 0, '', {fontFamily: 'lapsus_pro', fontSize: '50px', color: '#D4D75B'});

            this.load.on('progress', i => {
                tatu_girando.alpha = i;
            })
        }, this);
    }

    async loadFont(name, url) {
        var newFont = new FontFace(name, `url("${url}")`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('lang', lang);
    }

    getTextoEnLenguajeActual(key: string) {
        return this.contenido[this.lang][key];
    }


    async create() {
        const style = 'font-family: Helvetica, sans-serif;background-color: black;padding: 10px;color: aquamarine;text-shadow: 0px 0px 10px aquamarine;border-radius: 20px;box-shadow: 0px 0px 10px aquamarine;font-weight: bolder;text-align: center;letter-spacing: 5px;';
        console.log('%cTranslateManager iniciado correctamente! ', style);

        await Promise.all([
            this.loadFont('just_kids', 'assets/fonts/Just Kids.ttf'),
            this.loadFont('franklin_gothic_heavy', 'assets/fonts/franklin_gothic_heavy.ttf'),
            this.loadFont('lapsus_pro', 'assets/fonts/lapsus_pro.otf'),
        ]);

        let tm: any = new translateHelper();
        for (let keyLang in this.contenido) {
            let langData: any = await tm.cargarTraducciones(keyLang);
            langData.words.forEach(word => {
                if (this.contenido[keyLang][word.key] === null) {
                    this.contenido[keyLang][word.key] = word.translate;
                }
            });
        }

        texto_continuar.setText(this.getTextoEnLenguajeActual('rayo.continuar.var0'));

        this.scene.start('Preloads', {tatuCarga: tatu_girando, botonContinuar: boton_continuar, textoContinuar: texto_continuar});
    }

    update() {
        
    }
}