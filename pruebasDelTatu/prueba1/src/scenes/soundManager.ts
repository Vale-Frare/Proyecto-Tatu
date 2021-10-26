import Phaser from 'phaser';

export default class SoundManager extends Phaser.Scene{
    
    constructor(){
        super({key: 'soundManager', active: true});
    }

    preload(){

        this.load.audio("derrota", "assets/audio/derrota.mp3");
        this.load.audio("lvl_1", "assets/audio/lvl_1.mp3");
        this.load.audio("poco_tiempo", "assets/audio/poco_tiempo.mp3");
        this.load.audio("tatu_choca_color_correcto", "assets/audio/tatu_choca_color_correcto.mp3");
        this.load.audio("tatu_choca_color_incorrecto", "assets/audio/tatu_choca_color_incorrecto.mp3");
        this.load.audio("tatu_lanzado", "assets/audio/tatu_lanzado.mp3");
        this.load.audio("tatu_rodando", "assets/audio/tatu_rodando.mp3");
        this.load.audio("victoria", "assets/audio/victoria.mp3");

    }

    create(){
        let musica = this.sound.add('lvl_1', {volume: 0.2, loop: true});
        
        musica.play();
    }

}