import Phaser from 'phaser';
import {translateHelper} from '../classes/translateHelper';

export default class TranslateManager extends Phaser.Scene {
    public contenido = {
        'es_AR': {
            'key': 'texto',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null
        },
        'en_US': {
            'key': 'text',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null
        },
        'pt_BR': {
            'key': 'textinho',
            'menuinicio.jugar.var0': null,
            'menuinicio.jugar.var1': null,
            'menuinicio.niveles': null
        }
    };

    constructor() {
        super({key:'TranslateManager', active: true});
    }

    async create() {
        console.log('%c TranslateManager iniciado correctamente! ', 'background: #a4a4a4; color: #fada55');

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