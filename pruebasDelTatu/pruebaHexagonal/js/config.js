let text1;

let deckTween;

let lanzador;
let bolitas = [];

let burbujas = [
    {score: 10, color: 0x0000ff},
    {score: 20, color: 0x00ff00},
    {score: 30, color: 0xff0000}
]

let deck = [
    {obj: null, type: 0, color: 0x0000ff},
    {obj: null, type: 0, color: 0x0000ff},
    {obj: null, type: 0, color: 0x0000ff},
    {obj: null, type: 0, color: 0x0000ff},
    {obj: null, type: 0, color: 0x0000ff},
    {obj: null, type: 0, color: 0x00ff00},
    {obj: null, type: 0, color: 0x00ff00},
    {obj: null, type: 0, color: 0x00ff00},
    {obj: null, type: 0, color: 0x00ff00},
    {obj: null, type: 0, color: 0x00ff00},
    {obj: null, type: 0, color: 0xff0000},
    {obj: null, type: 0, color: 0xff0000},
    {obj: null, type: 0, color: 0xff0000},
    {obj: null, type: 0, color: 0xff0000},
    {obj: null, type: 0, color: 0xff0000}
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