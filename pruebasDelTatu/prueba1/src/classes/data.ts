export default class Data {
    pausa: boolean = false;

    armadillon: boolean = false;

    slider;

    deckController;

    debugRayita;

    mapaCargado;

    text1;

    lanzador;

    deckTween;

    bolitas = [];

    bordes = [];
    
    burbujas = [
        {color: 0x19B2FF},   //  Azulinho
        {color: 0xFAFF19},   //  Amarello
        {color: 0xFF1919},   //  Roujo
        {color: 0xFF8404},   //  Naranja
        {color: 0x04FF20},   //  Verde
        {color: 0xCDCDCD}    //  Gris 5 - Arnadillon
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
        0x19B2FF: 'basurita_3', //  AZUL
        0xFAFF19: 'basurita_4', //  AMARILLO
        0xFF1919: 'basurita_1', //  ROJA
        0xFF8404: 'basurita_2', //  NARANJA
        0x04FF20: 'basurita_0' //   VERDE
    };

    bolitasTextYColors = {
        'basurita_3': 0x19B2FF, //  AZUL
        'basurita_4': 0xFAFF19, //  AMARILLO
        'basurita_1': 0xFF1919, //  ROJA
        'basurita_2': 0xFF8404, //  NARANJA
        'basurita_0': 0x04FF20 //   VERDE
    };

    bolitasTextYColorsInt = {
        'basurita_3': 0, //  AZUL
        'basurita_4': 1, //  AMARILLO
        'basurita_1': 2, //  ROJA
        'basurita_2': 3, //  NARANJA
        'basurita_0': 4 //   VERDE
    };

    tatusTextYColors = {
        'tatu_3': 0x19B2FF, //  AZUL
        'tatu_4': 0xFAFF19, //  AMARILLO
        'tatu_1': 0xFF1919, //  ROJA
        'tatu_2': 0xFF8404, //  NARANJA
        'tatu_0': 0x04FF20 //   VERDE
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

    tiros = 0;

    bolas_destruidas = 0;

    bolas_lanzadas = [];

    constructor() {
        
    }

    setObjInDeck(obj, index) {
        this.deck[index].obj = obj;
    }
}
