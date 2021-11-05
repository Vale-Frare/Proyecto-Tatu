import Phaser from 'phaser';
import {translateHelper} from '../classes/translateHelper';
import {hudHelper} from '../classes/hudHelper';

export default class TranslateManager extends Phaser.Scene {
    public lang = 'es_AR'
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
            'hud.tiempo': null
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
            'hud.tiempo': null
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
            'hud.tiempo': null
        }
    };

    constructor() {
        super({key:'TranslateManager', active: true});
        this.lang = localStorage.getItem('lang') || 'es_AR';
    }

    async preload(){
        this.load.image("logo_carga", "assets/hud/logo_carga.png");
        this.load.image("carga", "assets/hud/carga.png");
        this.load.image("boton_chico", "assets/hud/boton_chico.png");

        this.load.on('complete', async i => {
            await hudHelper.cargarHudDesdeJson("assets/nivel/carga.json");

            let hud: any = this.scene.get("hud");
            hud.mostrarHud('carga');

            this.add.text(0, 0, '', {fontFamily: 'lapsus_pro', fontSize: '50px', color: '#D4D75B'});
        })
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
        console.log('%c TranslateManager iniciado correctamente! ', 'background: #a4a4a4; color: #fada55');

        await Promise.all([
            this.loadFont('just_kids', 'assets/fonts/Just Kids.ttf'),
            this.loadFont('franklin_gothic_heavy', 'assets/fonts/franklin_gothic_heavy.ttf'),
            this.loadFont('lapsus_pro', 'assets/fonts/lapsus_pro.otf'),
        ]);

        for (let keyLang in this.contenido) {
            let langData: any = await translateHelper.cargarTraducciones(keyLang);
            langData.words.forEach(word => {
                if (this.contenido[keyLang][word.key] === null) {
                    this.contenido[keyLang][word.key] = word.translate;
                }
            });
        }

        this.scene.start('Preloads');
        console.log(this.contenido);
    }

    update() {
        
    }
}