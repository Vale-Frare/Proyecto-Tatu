import Phaser from 'phaser';
import Data from '../classes/data';
import Config from '../config';

let data: Data = new Data();

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    tiro() {
        if (data.deckTween != undefined) {
            if (data.deckTween.isPlaying()) {return;}
        }
        if (data.bolitaALanzar >= data.deck.length) {
            return;
        }
        // if (bolitaALanzar >= deck.length - 1) {
        //     deck.forEach(bolita => {
        //         bolita.obj.x += 300;
        //     });
        // }
        data.deck.forEach(bolita => {
            data.deckTween = this.tweens.add({
                targets: bolita.obj,
                x: bolita.obj.x + 300,
                duration: 350,
                yoyo: false,
                ease: 'Power2',
                loop: 0
            });
        });
        
        let bolita = this.physics.add.sprite(900,1800, 'tatu_bebe');
        bolita.setTint(data.burbujas[data.deck[data.bolitaALanzar].color].color);

        //  vale: Esto desaparece la bolita lanzada para dar el efecto de que es la misma.
        data.deck[data.bolitaALanzar].obj.setVisible(false);

        bolita.setScale(0.3);
        bolita.depth = 1;
        bolita.angle = data.lanzador.rotation - 1.57;
        data.bolitas.push(bolita);
        bolita.body.setCircle(bolita.width/2);

        //  vale: hice una pequeña modificacion porque el nivel cargado ahora es una matriz.
        data.nivelCargado.forEach(fila_bolitas => {
            fila_bolitas.forEach(bolita_nivel => {
                //  vale: hice otra modificacion para que no intente leer las bolitas que son null.
                if (bolita_nivel === null) {} else {
                    this.physics.add.collider(bolita_nivel, bolita, this.romperGrupoDeBolitasHexagonales, null, this);
                }
            });
        }, this);
        
        data.bolitaALanzar += 1;
    }

    create() {
        const map = this.make.tilemap({ key: 'tilemap' });

        let objetos = map.createFromObjects('pelotas',{name:'pelota_1', key:'basura_1'});

        let fondo = this.add.image(0, 0, 'fondo').setOrigin(0);
        fondo.depth = -1;
        let texto = `Cantidad de bolitas: ${data.bolitas.length}`;
        data.text1 = new Phaser.GameObjects.Text(this, 0, 0, texto, { fontFamily: 'Arial', fontSize: '75px', color: 'white' }).setOrigin(0);

        data.lanzador = this.add.sprite(900,1800,'flecha');
        let posicion_inicial;

        data.lanzador.setInteractive({ draggable: true })
        .on('dragstart', function(pointer, dragX, dragY){
            posicion_inicial = pointer.x;
        })
        .on('drag', function(pointer, dragX, dragY){
            data.lanzador.rotation = Phaser.Math.Clamp(data.lanzador.rotation + ((pointer.x - posicion_inicial)*.0005), -0.8, 0.3);
        })
        .on('dragend', function(pointer, dragX, dragY, dropped){
            this.tiro();
        }, this)

        //this.input.on('pointerup', this.tiro, this);

        for(let i = data.deck.length - 1; i > -1; i--) {
            //let bolita = new Phaser.GameObjects.Sprite(this, 900 - (i * 300),1800,'tatu_bebe');
            let bolita = this.add.sprite(900 - (i * 300),1800,'tatu_bebe');
            bolita.setTint(data.burbujas[data.deck[i].color].color);
            //data.deck[i].obj = bolita;
            data.setObjInDeck(bolita, i);
            bolita.setDepth(5);
            bolita.setScale(0.3);
        }

        this.cargarNivelNuevo();
    }

    update() {
        data.text1.text = `Cantidad de bolitas: ${data.bolitas.length}`;

        //lanzador.rotation = (game.input.mousePointer.x*.001)-.9;

        data.bolitas.forEach(bolita => {
            if (bolita.scene == undefined){
                data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
            }
            else{
                this.physics.velocityFromRotation(bolita.angle, 2600, bolita.body.velocity);
                if (bolita.y < 0) {
                    data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });
    }

    //  vale: Funcion que crea la matriz hexagonales con colores random y tambien agujeros.
    crearMatrizHexagonalRandom(xSize, ySize) {
        let matriz = [];
        let count = 0;
        for (let y = 0; y < ySize; y++) {
            let fila = [];
            if (this.esPar(y)) {
                for (let x = 0; x < xSize-1; x++) {
                    let color = Phaser.Math.Between(-1, 2);
                    fila.push({color:color, grupo:this.calcularGruposHexagonalmente(fila, matriz, y, x, color, count)});
                    count++;
                }
            }else{
                for (let x = 0; x < xSize; x++) {
                    let color = Phaser.Math.Between(-1, 2);
                    fila.push({color:color, grupo:this.calcularGruposHexagonalmente(fila, matriz, y, x, color, count)});
                    count++;
                }
            }
            matriz.push(fila);
        }
        return matriz;
    }

    crearMatrizConPatron(xSize, ySize, cellSize) {
        let matriz = [];
        
        let count = 0;
        let cellCount = 0;

        let colors = [0, 1, 2];

        colors = colors.sort(function (a, b) { 
            return (Math.random() * 2) - 1;
        })

        for (let y = 0; y < ySize; y++) {
            let fila = [];
            for (let x = 0; x < xSize; x++) {

                fila.push({
                    color: colors[0],
                    grupo: this.calcularGrupo(fila, matriz, y, x, colors[0], count)
                });

                if (cellCount == cellSize) {
                    colors = this.arrayUnPasito(colors);
                    cellCount = 0;
                }

                cellCount++;
                count++;
            }
            
            matriz.push(fila);
        }

        return matriz;
    }

    arrayUnPasito(array) {
        let newArray = [array.length];

        newArray[0] = array[array.length-1];

        for (let i = 0; i < array.length - 1; i++) {
            newArray[i+1] = array[i];
        }
        return newArray;
    }

    calcularGrupo(fila, matriz, y, x, color, count) {
        //  vale: se determina el caso para poder evaluar su grupo.

        if ((x - 1) < 0 && (y - 1) < 0)  {
            //  vale: en el caso de ser la ezquina se retorna el valor del count.

            return count;
        }else if ((x - 1) >= 0 && (y - 1) >= 0) {
            //  vale: en el caso de tener una bolita arriba y una a la izquierda se evalua.

            let colorArriba = matriz[y - 1][x].color;
            let colorIzquierda = fila[x - 1].color;

            if (colorArriba == color && colorIzquierda == color) {
                //  vale: en el caso de colores iguales se procede a fundir los grupos en uno.

                return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, fila[x - 1].grupo);
            }else if (colorArriba == color && colorIzquierda != color) {
                //  vale: en el caso de color igual solo arriba se devuelve el grupo del de arriba.

                return matriz[y - 1][x].grupo;
            }else if (colorIzquierda == color && colorArriba != color) {
                //  vale: en el caso de color igual solo a la izquierda se devuelve el grupo de la izquierda.

                return fila[x - 1].grupo;
            }else if (colorIzquierda != color && colorArriba != color){
                //  vale: en el caso de colores diferentes se devuelve el valor del count.

                return count;
            }
        }else if ((x - 1) >= 0 && (y - 1) < 0) {
            //  vale: en el caso de tener una bolita a la izquierda se evalua si el color coincide.

            let colorIzquierda = fila[x - 1].color;

            if (colorIzquierda == color) {
                return fila[x - 1].grupo;
            }else {
                return count;
            }
        }else if ((x - 1) < 0 && (y - 1) >= 0) {
            //  vale: en el caso de tener una bolita arriba y no una a la izquierda se evalua si el color coincide.

            let colorArriba = matriz[y - 1][x].color;

            if (colorArriba == color) {
                return matriz[y - 1][x].grupo;
            }else {
                return count;
            }
        }
    }   

    //  vale: Funcion que hice que calcula los grupos de bolitas hexagonales.
    //        La hice en un delirio cosmico asi que no es muy facil de comprender pero funciona.
    calcularGruposHexagonalmente(fila, matriz, y, x, color, count) {
        if ((x - 1) < 0 && (y - 1) < 0)  {
            //  vale: en el caso de ser la ezquina se retorna el valor del count.

            return count;
        }else if ((x - 1) >= 0 && (y - 1) >= 0) {
            //  vale: en el caso de tener una bolita arriba y una a la izquierda se evalua.

            if (this.esPar(y)) {
                let colorArribaIzquierda = matriz[y - 1][x].color;
                let colorArribaDerecha = matriz[y - 1][x+1].color;
                let colorIzquierda = fila[x - 1].color;

                if (colorArribaDerecha == color && colorIzquierda == color && colorArribaIzquierda == color) {
                    return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo, true, fila[x - 1].grupo);
                }else if(colorIzquierda != color) {
                    if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                        return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo);
                    }else if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                        return matriz[y - 1][x].grupo;
                    }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                        return matriz[y - 1][x+1].grupo;
                    }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                        return count;
                    }
                }else if(colorIzquierda == color) {
                    if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                        return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x].grupo);
                    }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                        return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x+1].grupo);
                    }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                        return fila[x - 1].grupo;
                    }
                }
            }else {
                if (matriz[y - 1].length != x) {
                    let colorArribaIzquierda = matriz[y - 1][x-1].color;
                    let colorArribaDerecha = matriz[y - 1][x].color;
                    let colorIzquierda = fila[x - 1].color;

                    if (colorArribaDerecha == color && colorIzquierda == color && colorArribaIzquierda == color) {
                        return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x-1].grupo, true, fila[x - 1].grupo);
                    }else if(colorIzquierda != color) {
                        if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x-1].grupo);
                        }else if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                            return matriz[y - 1][x-1].grupo;
                        }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                            return matriz[y - 1][x].grupo;
                        }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                            return count;
                        }
                    }else if(colorIzquierda == color) {
                        if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x-1].grupo);
                        }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                            return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x].grupo);
                        }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                            return fila[x - 1].grupo;
                        }
                    }
                }else {
                    let colorArribaIzquierda = matriz[y - 1][x-1].color;
                    let colorIzquierda = fila[x - 1].color;

                    if (colorArribaIzquierda == color && colorIzquierda == color) {
                        return this.fundirGrupos(matriz, fila, matriz[y - 1][x-1].grupo, fila[x - 1].grupo);
                    }else if (colorArribaIzquierda == color && colorIzquierda != color) { 
                        return matriz[y - 1][x-1].grupo;
                    }else if (colorIzquierda == color && colorArribaIzquierda != color) { 
                        return fila[x - 1].grupo;
                    }else if (colorArribaIzquierda != color && colorIzquierda != color) { 
                        return count;
                    }
                }
            }
        }else if ((x - 1) >= 0 && (y - 1) < 0) {
            //  vale: en el caso de tener una bolita a la izquierda se evalua si el color coincide.

            let colorIzquierda = fila[x - 1].color;

            if (colorIzquierda == color) {
                return fila[x - 1].grupo;
            }else {
                return count;
            }
        }else if ((x - 1) < 0 && (y - 1) >= 0) {
            //  vale: en el caso de tener una bolita arriba y no una a la izquierda se evalua si el color coincide.

            if (this.esPar(y)) {
                // vale: si es par se evaluan dos colores en la parte superior.

                let colorArribaIzquierda = matriz[y - 1][x].color;
                let colorArribaDerecha = matriz[y - 1][x+1].color;

                if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                    return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo);
                }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                    return matriz[y - 1][x+1].grupo;
                }else if (colorArribaIzquierda == color && colorArribaDerecha != color) {
                    return matriz[y - 1][x].grupo;
                }else if (colorArribaIzquierda != color && colorArribaDerecha != color){
                    return count;
                }
            }else {
                // vale: si es inpar solo se evalua un color en la parte superior.

                let colorArriba = matriz[y - 1][x].color;

                if (colorArriba == color) {
                    return matriz[y - 1][x].grupo;
                }else {
                    return count;
                }
            }
        }
    }

    esPar(num) {
        return num % 2 == 0;
    }

    //  vale: se puede usar sin necesidad de agregar los ultimos dos parametros.
    fundirGrupos(matriz, fila, grupo1, grupo2, triple=false, grupo3=null) {
        //  vale: se crea una matriz completa agregando la fila sin pushear a la matriz en progreso.

        let matrizCompleta = [];
        matriz.forEach(filaM => {
            matrizCompleta.push(filaM);
        });
        matrizCompleta.push(fila);

        let nuevoGrupo;
        let grupoAFundir;

        if (!triple) {
            //  vale: se evalua que grupo tiene el menor valor para determinar el valor del grupo fundido.

            if (grupo1 < grupo2) { 
                nuevoGrupo = grupo1;
                grupoAFundir = grupo2;
            }else {
                nuevoGrupo = grupo2;
                grupoAFundir = grupo1;
            }

            //  vale: se reemplazan todos los de valor mayor por el valor menor fundiendo el grupo.

            for (let y = 0; y < matrizCompleta.length; y++) { 
                for (let x = 0; x < matrizCompleta[y].length; x++) { 
                    if (matrizCompleta[y][x].grupo == grupoAFundir) {
                        matrizCompleta[y][x].grupo = nuevoGrupo;
                    }
                }
            }

            //  vale: se modifica la matriz en progreso para cambiar el valor de los grupos.

            for (let y = 0; y < matrizCompleta.length; y++) { 
                if (y == (matrizCompleta.length - 1)) {
                    fila = matrizCompleta[y];
                }else {
                    matriz[y] = matrizCompleta[y];
                }
            }
        }else {
            //  vale: este es un pequeño arreglo que hice para que pueda fusionar 3 grupos.
            //        se evalua que grupo tiene el menor valor para determinar el valor del grupo fundido
            //        y los otros dos quedan en un array.

            let gruposAFundir;
            nuevoGrupo = Math.max(...[grupo1, grupo2, grupo3]);
            gruposAFundir = [grupo1, grupo2, grupo3].sort(function(a, b) {return a - b;});
            gruposAFundir = gruposAFundir.splice(0, 2);

            for (let y = 0; y < matrizCompleta.length; y++) { 
                for (let x = 0; x < matrizCompleta[y].length; x++) { 
                    if (matrizCompleta[y][x].grupo == gruposAFundir[0] || matrizCompleta[y][x].grupo == gruposAFundir[1]) {
                        matrizCompleta[y][x].grupo = nuevoGrupo;
                    }
                }
            }

            for (let y = 0; y < matrizCompleta.length; y++) { 
                if (y == (matrizCompleta.length - 1)) {
                    fila = matrizCompleta[y];
                }else {
                    matriz[y] = matrizCompleta[y];
                }
            }
        }

        //  vale: se retorna el valor del nuevo grupo.
        return nuevoGrupo;
    }

    // pruebita(xSize, ySize) {
    //     matriz = []
    //     for(let y = 0; y < ySize; y++){ fila = []; for(let x = 0; x < xSize; x++){ fila.push(0) } matriz.push(fila) };

    //     matriz.forEach(fila =>{
    //         fila.forEach(item =>{
                
    //         });
    //     });
    // }    
    
    //  sergio: hice un copy-paste de crear matriz para modificarlo y usarlo en la función de crear nivel nuevo
    crearMatrizAleatoria(x1, y1, n) {
        let nivel = [];
        for (let x = 0; x < x1; x++) {
            let fila = [];
            for (let y = 0; y < y1; y++) {
                fila.push(0);
            }
            nivel.push(fila);
        }
        //  sergio: pongo los colores que se van a usar y el número de veces que se repiten al usarse
        let colores_usados =
        [
            [0,1,2],
            [0,0,0]
        ]
        let grupos = Math.ceil((x1 * y1)/(n*2)/3);
        //  sergio: el romper es un break, para terminar los for en caso de que la aleatoriedad del algoritmo salga mal
        let romper = false;
        for (let x = 0; x < nivel.length; x+=n) {
            if(romper){
                break;
            }
            for (let y = 0; y < nivel[x].length; y+=n) {
                //  sergio: toda esta parte la hice pensando para ser medianamente usable a largo plazo, igual es muy modificable... te conozco vale, mas o menos
                if(romper){
                    break;
                }
                let colores = [0, 1, 2];
                if(x-1 >= 0){
                    Phaser.Utils.Array.Remove(colores, nivel[x-1][y]);
                }
                if(y-1 >= 0){
                    Phaser.Utils.Array.Remove(colores, nivel[x][y-1]);
                }

                let aleatorio = (Phaser.Math.Between(1,colores.length)) - 1;
                let repetir = true;

                // sergio: acá se intenta hacer que los colores sean equitativos a lo largo del nivel
                while(repetir){
                    if(colores_usados[1][colores[aleatorio]] == grupos){

                        Phaser.Utils.Array.Remove(colores, colores[aleatorio]);
                        if(colores.length == 0){
                            romper = true;
                            repetir = false;
                        }
                        else{
                            aleatorio = (Phaser.Math.Between(1,colores.length)) - 1;
                        }

                    }
                    else{

                        colores_usados[1][colores[aleatorio]]++;
                        repetir = false;
                        for (let wx = 0; wx < n; wx++) {
                            for (let zy = 0; zy < n; zy++) {
                                if(x+wx > nivel.length - 1 || y+zy > nivel[x].length - 1){
                                
                                }
                                else{
                                    nivel[x+wx][y+zy] = colores[aleatorio];
                                }
                            }
                        }

                    }
                }

            }
        }
        if(romper){
            return null;
        }else{
            return nivel;
        }
    }

    convertirAGrupos(matriz) {
        let matrizNueva = []
        let count = 0;
        for (let y = 0; y < matriz.length; y++) {
            let fila = [];
            for (let x = 0; x < matriz[y].length; x++) {
                fila.push({
                    color: matriz[y][x],
                    grupo: this.calcularGrupo(fila, matrizNueva, y, x, matriz[y][x], count)
                });
                count++;
            }
            matrizNueva.push(fila);
        }
        return matrizNueva;
    }

    cargarNivelNuevo() {
        //  sergio: ponele un numerito adentro, 1 para 1x1, 2 para 2x2, 3 para 3x3 y así
        //  sergio: los colores no se repiten ni en vertical, ni en horizontal
        //let nivel = null;
        // while(nivel == null){
        //     nivel = this.crearMatrizAleatoria(6, 6, 2);
        // }

        // nivel = this.convertirAGrupos(nivel);

        //let nivel = this.crearMatrizYFormarGrupos(6, 8, 3);

        //let nivel = this.crearMatrizConPatron(6, 6, 8);

        let nivel = this.crearMatrizHexagonalRandom(6,6);

        const bolitasTexturas = [
            'basura_3', //  AZUL
            'basura_1', //  VERDE
            'basura_2', //  ROJA
        ];

        for (let y = 0; y < nivel.length; y++) {
            let fila = [];
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x].color != -1) {
                    if (this.esPar(y)) {
                        let bolita;
                        bolita = this.physics.add.sprite((x * 125) + 230, (y * 125) + 400, bolitasTexturas[nivel[y][x].color]);
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        //bolita.setTint(data.burbujas[nivel[y][x].color].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);

                        //  vale: si usas el modo debug podes ver un texto sobre cada bolita con el numero de su grupo ;)
                        if (Config.config.physics.arcade.debug) new Phaser.GameObjects.Text(this, bolita.x, bolita.y, `${nivel[y][x].grupo}`, { font: 'bold 85px Arial', color: 'black'}).setOrigin(0.5);

                        //  vale: se pushea la bolita a la fila.
                        fila.push(bolita);
                    }else {
                        let bolita;
                        bolita = this.physics.add.sprite((x * 125) + 170, (y * 125) + 400, bolitasTexturas[nivel[y][x].color]);
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        //bolita.setTint(data.burbujas[nivel[y][x].color].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);

                        //  vale: si usas el modo debug podes ver un texto sobre cada bolita con el numero de su grupo ;)
                        if (Config.config.physics.arcade.debug) new Phaser.GameObjects.Text(this, bolita.x, bolita.y, `${nivel[y][x].grupo}`, { font: 'bold 85px Arial', color: 'black'}).setOrigin(0.5);
                        
                        //  vale: se pushea la bolita a la fila.
                        fila.push(bolita);
                    }
                }else {
                    fila.push(null);
                }
            }
            //  vale: se pushea la fila al nivel cargado.
            data.nivelCargado.push(fila);
        }

        //  vale: se guardan los valores de los grupos en una matriz aparte.
        data.nivelCargadoGrupos = nivel;
    }

    //  vale: con esto rompes un grupo de bolitas.
    romperGrupoDeBolitas(bola_level, bola_lanzada){
        //  vale: se compara el color.

        if (bola_lanzada.tintTopLeft == data.bolitaRomper[bola_level.texture.key]) {
            //  vale: se obtiene el grupo de la bolita a romper en base a la posición.
            
            let grupo = data.nivelCargadoGrupos[(bola_level.y-400)/125][(bola_level.x-240)/125];

            for (let y = 0; y < data.nivelCargado.length; y++) {
                for (let x = 0; x < data.nivelCargado[y].length; x++) {
                    //  vale: se recorre toda la matriz y se destruye cada bolita perteneciente al grupo.

                    if (data.nivelCargadoGrupos[y][x].grupo == grupo.grupo) {
                        data.nivelCargado[y][x].destroy();
                    }
                }
            }
        }
        //  vale: finalmente se rompe la bolita lanzada.

        bola_lanzada.destroy();
    }

    //  vale: con esto rompes un grupo de bolitas hexagonales.
    romperGrupoDeBolitasHexagonales(bola_level, bola_lanzada){
        //  vale: se compara el color.

        if (bola_lanzada.tintTopLeft == data.bolitasTextYColors[bola_level.texture.key]) {
            //  vale: se obtiene el grupo de la bolita a romper en base a la posición.

            //  vale: se comprueba si es par o no para evaluar la posición correcta.
            if (this.esPar((bola_level.y-400)/125)) {
                let grupo = data.nivelCargadoGrupos[(bola_level.y-400)/125][(bola_level.x-230)/125];

                for (let y = 0; y < data.nivelCargado.length; y++) {
                    for (let x = 0; x < data.nivelCargado[y].length; x++) {
                        //  vale: se recorre toda la matriz y se destruye cada bolita perteneciente al grupo.

                        if (data.nivelCargadoGrupos[y][x].grupo == grupo.grupo) {
                            data.nivelCargado[y][x].destroy();
                        }
                    }
                }
            }else{
                let grupo = data.nivelCargadoGrupos[(bola_level.y-400)/125][(bola_level.x-170)/125];

                for (let y = 0; y < data.nivelCargado.length; y++) {
                    for (let x = 0; x < data.nivelCargado[y].length; x++) {
                        //  vale: se recorre toda la matriz y se destruye cada bolita perteneciente al grupo.

                        if (data.nivelCargadoGrupos[y][x].grupo == grupo.grupo) {
                            data.nivelCargado[y][x].destroy();
                        }
                    }
                }
            }
        }
        //  vale: finalmente se rompe la bolita lanzada.

        bola_lanzada.destroy();
    }
    
}