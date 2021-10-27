import Phaser from 'phaser';

export default class SoundManager extends Phaser.Scene{
    
    private musica;
    private musica_poco_tiempo;
    private sonido_tatu_rodando;
    private sonido_tatu_lanzado;
    private sonido_tatu_choca_color_correcto;
    private sonido_tatu_choca_color_incorrecto;
    private mute_sound: boolean = false;

    constructor(){
        super({key: 'soundManager', active: true});
    }

    create() {
        let canvas = document.getElementsByTagName("canvas")[0];
        canvas.addEventListener("onFocus", () => {
            this.muteMusic(false);
        });
    }

    muteMusic(bool){
        if(bool){
            this.musica.pause();
            if(this.musica_poco_tiempo){
                this.musica_poco_tiempo.pause();
            }
        }
        else{
            this.musica.resume();
            if(this.musica_poco_tiempo){
                this.musica_poco_tiempo.resume();
            }
        }
    }

    playMusic(nombre, volumen, lup){
        if(this.musica){
            this.musica.stop();
        }
        this.musica = this.sound.add(nombre, {volume: volumen, loop: lup});
        this.musica.play();
    }

    playMusicPocoTiempo(){
        this.musica_poco_tiempo = this.sound.add("poco_tiempo", {volume: 0.2, loop: true});
        this.musica_poco_tiempo.play();
    }

    stopMusicPocoTiempo(){
        this.musica_poco_tiempo.stop();
    }

    playSoundTatuRodando(){
        this.sonido_tatu_rodando = this.sound.add("tatu_rodando", {volume: this.volumenFunction(), loop: true});
        this.sonido_tatu_rodando.play();
    }

    playSoundTatuLanzado(){
        this.sonido_tatu_lanzado = this.sound.add("tatu_lanzado", {volume: this.volumenFunction(), loop: false});
        this.sonido_tatu_lanzado.play();
    }

    playSoundTatuChocaColorCorrecto(){
        this.sonido_tatu_choca_color_correcto = this.sound.add("tatu_choca_color_correcto", {volume: this.volumenFunction(), loop: false});
        this.sonido_tatu_choca_color_correcto.play();
    }

    playSoundTatuChocaColorIncorrecto(){
        this.sonido_tatu_choca_color_incorrecto = this.sound.add("tatu_choca_color_incorrecto", {volume: this.volumenFunction(), loop: false});
        this.sonido_tatu_choca_color_incorrecto.play();
    }

    volumenFunction(){
        let volumen;
        if(!this.mute_sound){
            volumen = 0.3;
        }
        else{
            volumen = 0;
        }
        return volumen;
    }

    muteSound(bool){
        if(bool){
            this.mute_sound = true;
        }
        else{
            this.mute_sound = false;
        }
    }

}