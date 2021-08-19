let text1;

let lanzador;

let contador = 0;
let activo = false;

let bolitas = [];

let burbujas = [
    {score: 10, color: 0x0384fc},   //  Azulinho
    {score: 20, color: 0xffda52},   //  Amarello
    {score: 30, color: 0xff5252}    //  Roujo
]


const bolitaRomper = {
    basura_1: burbujas[1].color,
    basura_2: burbujas[2].color,
    basura_3: burbujas[0].color
}

let deck = [
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

const bolitasTexturas = [
    'basura_3', //  AZUL
    'basura_1', //  AMARILLO
    'basura_2', //  ROJA
];

let niveles = [
    [
        [0,0,0,0,0,0],
        [1,1,1,1,1,1],
        [2,2,2,2,2,2],
        [0,1,2,2,1,0],
    ]
]

let nivelCargado = []

let nivelCargadoGrupos = []

let bolitaALanzar = 0;

resizeGame = function () {
    let canvas = document.querySelector("canvas");
    const {innerWidth, innerHeight} = window;

    const ratio = innerWidth / innerHeight;

    const gameRatio = game.config.width / game.config.height;

    if (ratio < gameRatio) {
        canvas.style.width = innerWidth + "px";
        canvas.style.height = innerWidth / gameRatio + "px";
    } else {
        canvas.style.width = innerHeight * gameRatio + "px";
        canvas.style.height = innerHeight + "px";
    }
}

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        width: 1080,
        height: 1920,
        soundOn: true,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: "template",
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1080,
            height: 1920
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 300 },
                debug: true
            }
        },
        audio: {
            disableWebAudio: true
        },
        pixelArt: false,
        scene: [Preloads, Scene1]
    };

    game = new Phaser.Game(config);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame());
};