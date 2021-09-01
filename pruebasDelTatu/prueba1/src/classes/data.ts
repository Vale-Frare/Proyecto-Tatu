import Phaser from 'phaser';

export default class Data {
    text1;

    lanzador;

    deckTween;

    bolitas = [];

    burbujas = [
        {score: 10, color: 0x0384fc},   //  Azulinho
        {score: 20, color: 0xffda52},   //  Amarello
        {score: 30, color: 0xff5252}    //  Roujo
    ];


    bolitaRomper = {
        basura_1: this.burbujas[1].color,
        basura_2: this.burbujas[2].color,
        basura_3: this.burbujas[0].color
    };

    deck = [
        {obj: null, type: 0, color: 0},
        {obj: null, type: 0, color: 0},
        {obj: null, type: 0, color: 0},
        {obj: null, type: 0, color: 0},
        {obj: null, type: 0, color: 0},
        {obj: null, type: 0, color: 1},
        {obj: null, type: 0, color: 1},
        {obj: null, type: 0, color: 1},
        {obj: null, type: 0, color: 1},
        {obj: null, type: 0, color: 1},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2}
    ];

    bolitasTextYColors = {
        'basura_3': 0x0384fc, //  AZUL
        'basura_1': 0xffda52, //  AMARILLO
        'basura_2': 0xff5252 //  ROJA
    };

    niveles = [
        [
            [0,0,0,0,0,0],
            [1,1,1,1,1,1],
            [2,2,2,2,2,2],
            [0,1,2,2,1,0],
        ]
    ];

    nivelCargado = [];

    nivelCargadoGrupos = [];

    bolitaALanzar = 0;

    constructor() {
        //  no hay nada
    }

    setObjInDeck(obj, index) {
        this.deck[index].obj = obj;
    }
}
