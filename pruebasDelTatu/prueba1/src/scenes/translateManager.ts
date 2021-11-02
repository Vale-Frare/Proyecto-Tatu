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
            let langData: any = await translateHelper.cargarTraducciones(`https://voluminouslegalmeasurements.frasesegundo.repl.co/tatu/?lang=${keyLang}`);
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