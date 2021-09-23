import Phaser from 'phaser';

export default class Data {
    deckController;

    debugRayita;

    mapaCargado;

    text1;

    lanzador;

    deckTween;

    bolitas = [];

    bordes = [];
    
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
        {obj: null, type: 0, color: 4},
        {obj: null, type: 0, color: 4},
        {obj: null, type: 0, color: 4},
        {obj: null, type: 0, color: 4},
        {obj: null, type: 0, color: 4},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 2},
        {obj: null, type: 0, color: 3},
        {obj: null, type: 0, color: 3},
        {obj: null, type: 0, color: 3},
        {obj: null, type: 0, color: 3},
        {obj: null, type: 0, color: 3}
    ];

    bolitaColorATextura = {
        0x0384fc: 'basurita_3', //  AZUL
        0xffda52: 'basurita_4', //  AMARILLO
        0xff5252: 'basurita_1', //  ROJA
        0xf18412: 'basurita_2', //  NARANJA
        0x55ae5f: 'basurita_0' //   VERDE
    };

    bolitasTextYColors = {
        'basurita_3': 0x0384fc, //  AZUL
        'basurita_4': 0xffda52, //  AMARILLO
        'basurita_1': 0xff5252, //  ROJA
        'basurita_2': 0xf18412, //  NARANJA
        'basurita_0': 0x55ae5f //   VERDE
    };

    bolitasTextYColorsInt = {
        'basurita_3': 0, //  AZUL
        'basurita_4': 1, //  AMARILLO
        'basurita_1': 2, //  ROJA
        'basurita_2': 3, //  NARANJA
        'basurita_0': 4 //   VERDE
    };

    tatusTextYColors = {
        'tatu_3': 0x0384fc, //  AZUL
        'tatu_4': 0xffda52, //  AMARILLO
        'tatu_1': 0xff5252, //  ROJA
        'tatu_2': 0xf18412, //  NARANJA
        'tatu_0': 0x55ae5f //   VERDE
    };

    diccionarioDeColores = [
        4,
        2,
        3,
        0,
        1
    ]

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
