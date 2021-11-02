import Phaser from 'phaser';
import {translateHelper} from '../classes/translateHelper';

export default class TranslateManager extends Phaser.Scene {
    public contenido = {
        'es_AR': {
            'key': 'texto',
            'mainmenu.jugar.var0': null,
            'mainmenu.jugar.var1': null,
            'mainmenu.niveles': null
        },
        'en_US': {
            'key': 'text',
            'mainmenu.jugar.var0': null,
            'mainmenu.jugar.var1': null,
            'mainmenu.niveles': null
        },
        'pt_BR': {
            'key': 'textinho',
            'mainmenu.jugar.var0': null,
            'mainmenu.jugar.var1': null,
            'mainmenu.niveles': null
        }
    };

    constructor() {
        super({key:'TranslateManager', active: true});
    }

    async create() {
        console.log('%c TranslateManager iniciado correctamente! ', 'background: #a4a4a4; color: #fada55');

        for (let keyLang in this.contenido) {
            for (let keyText in this.contenido[keyLang]) {
                if (this.contenido[keyLang][keyText] === null) {
                    this.contenido[keyLang][keyText] = await translateHelper.cargarTraducciones(`https://voluminouslegalmeasurements.frasesegundo.repl.co/tatu/?key=${keyText}&lang=${keyLang}`);
                }
            }
        }

        this.scene.start('Preloads');
        console.log(this.contenido);
    }

    update() {
        
    }
}