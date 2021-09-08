import Phaser from 'phaser';

export default class Data {
    text1;

    lanzador;

    deckTween;

    bolitas = [];
    
    burbujas = [
        {color: 0x0384fc},   //  Azulinho
        {color: 0xffda52},   //  Amarello
        {color: 0xff5252},   //  Roujo
        {color: 0xf18412},   //  Naranja
        {color: 0x55ae5f}    //  Verde
    ];


    bolitaRomper = {
        basurita_0: this.burbujas[4].color,
        basurita_1: this.burbujas[2].color,
        basurita_2: this.burbujas[3].color,
        basurita_3: this.burbujas[0].color,
        basurita_4: this.burbujas[1].color
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
        'basurita_3': 0x0384fc, //  AZUL
        'basurita_4': 0xffda52, //  AMARILLO
        'basurita_1': 0xff5252, //  ROJA
        'basurita_2': 0xf18412, //  NARANJA
        'basurita_0': 0x55ae5f //   VERDE
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
