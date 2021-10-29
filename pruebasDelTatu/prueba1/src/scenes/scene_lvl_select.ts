import Phaser from 'phaser';
import Hud from './hud';
import ProgressManager from './progressManager';

export default class SceneLvlSelect extends Phaser.Scene {
    private pm: ProgressManager;

    constructor() {
        super('SceneLvlSelect');
    }

    create() {
        this.pm = new ProgressManager();

        let hud: Hud = this.scene.get("hud");
        hud.mostrarHud('seleccion_niveles');

    }

    update() {

    }
}