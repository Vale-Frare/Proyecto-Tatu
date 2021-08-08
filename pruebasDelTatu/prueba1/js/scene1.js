class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    create() {
        text1 = this.add.text(0, 0, `Cantidad de bolitas: ${bolitas.length}`, {fontSize: '75px', fill: 'white'}).setOrigin(0);

        lanzador = this.add.sprite(900,1800,'flecha');

        this.input.on('pointerup', this.tiro, this);

        for(let i = deck.length - 1; i > -1; i--) {
            let bolita = this.add.sprite(900 - (i * 300),1800,'bolita');
            deck[i].obj = bolita;
            bolita.setTint(deck[i].color);
            bolita.setScale(0.4);
        }

        this.cargarNivelNuevo();
    }

    update() {
        text1.text = `Cantidad de bolitas: ${bolitas.length}`;

        lanzador.rotation = (game.input.mousePointer.x*.001)-.9;

        bolitas.forEach(bolita => {
            if (bolita.scene == undefined){
                bolitas.splice(bolitas.indexOf(bolita), 1);
            }
            else{
                this.physics.velocityFromRotation(bolita.angle, 2600, bolita.body.velocity);
                if (bolita.y < 0) {
                    bolitas.splice(bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });
    }

    tiro() {
        if (bolitaALanzar >= deck.length) {
            return;
        }
        if (bolitaALanzar >= deck.length - 1) {
            deck.forEach(bolita => {
                bolita.obj.x += 300;
            });
        }
        deck.forEach(bolita => {
            bolita.obj.x += 300;
        });
        
        let bolita = this.physics.add.sprite(900,1800,'bolita');
        bolita.setTint(deck[bolitaALanzar].color);
        bolita.setScale(0.4);
        bolita.depth = -1;
        bolita.angle = lanzador.rotation - 1.57;
        bolitas.push(bolita);
        bolita.body.setCircle(bolita.width/2);

        //  vale: hice una pequeña modificacion porque el nivel cargado ahora es una matriz.
        nivelCargado.forEach(fila_bolitas => {
            fila_bolitas.forEach(bolita_nivel => {
                this.physics.add.collider(bolita_nivel, bolita, this.romperGrupoDeBolitas, null, this);
            });
        }, this);
        
        bolitaALanzar += 1;
    }

    //  vale: tremenda función que hace una matriz usando simplex y que calcula sus grupos.
    crearMatrizYFormarGrupos(xSize, ySize, scale) {
        let noise = this.plugins.get('rexperlinplugin').add("nyo");
        let matriz = [];
        //  vale: conteo que se usa para calcular el grupo.
        let count = 0;
        for (let i = 0; i < xSize; i++) {
            let fila = [];
            for (let j = 0; j < ySize; j++) {
                let random = Math.random() * 10;
                //  vale: se guarda el color aleatorio en una variable para usarlo despues.
                let color = Phaser.Math.Clamp(Math.floor((noise.simplex2((i + (random)) * .9,(j + (random)) * .9) + 1) * scale), 0, 2)

                //  vale: se pushea un objeto que contiene el color y el grupo el cual se calcula en la función calcularGrupo.
                fila.push(
                    {color: color,
                    grupo: this.calcularGrupo(fila, matriz, i, j, color, count)}
                );
                count++;
            }
            matriz.push(fila);
        }
        return matriz;
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

    fundirGrupos(matriz, fila, grupo1, grupo2) {
        //  vale: se crea una matriz completa agregando la fila sin pushear a la matriz en progreso.

        let matrizCompleta = [];
        matriz.forEach(filaM => {
            matrizCompleta.push(filaM);
        });
        matrizCompleta.push(fila);

        let nuevoGrupo;
        let grupoAFundir;

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
        
        //  vale: se retorna el valor del nuevo grupo.

        return nuevoGrupo;
    }

    createRandomMatrix() {
        let matrix = [];
        let nivel = niveles[0];
        for (let y = 0; y < nivel.length; y++) {
            let row = [];
            for (let x = 0; x < nivel[y].length; x++) {
                row.push(Math.floor(Math.random() * 3));
            }
            matrix.push(row);
        }
        return matrix;
    }

    //  vale: generación de matriz con simplex, un poco menos aleatoria que el random(?
    //  vale: parametros, tamaño en x, tamaño en y, scale para la escala, a mayor escala
    //  menos aleatoriedad y mas abundancia de pelotitas rojas.
    getSimplexMatrix(x, y, scale) {
        let noise = this.plugins.get('rexperlinplugin').add("nyo");
        let matriz = [];
        for (let i = 0; i < x; i++) {
            let fila = [];
            for (let j = 0; j < y; j++) {
                fila.push(
                    Phaser.Math.Clamp(
                        Math.floor(
                            (noise.simplex2(
                                (i + (Math.random() * 10)) * .9,
                                (j + (Math.random() * 10)) * .9) 
                                + 1) * scale)
                        , 0, 2
                    )
                );
            }
            matriz.push(fila);
        }
        return matriz;
    }

    //  sergio: hice un copy-paste de crear matriz para modificarlo y usarlo en la función de crear nivel nuevo
    crearMatrizAleatoria(n) {
        let nivel = niveles[0];
        let colores_usados =
        [
            [0,1,2],
            [0,0,0]
        ]
        console.log(colores_usados);
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

                while(repetir){
                    if(colores_usados[1][colores[aleatorio]] == 2){

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
            return false;
        }else{
            return nivel;
        }
    }

    //  sergio: hice un copy-paste del cargar nivel de abajo para modificarlo y usarlo en el create
    cargarNivelNuevo() {
        //  sergio: ponele un numerito adentro, 1 para 1x1, 2 para 2x2, 3 para 3x3 y así
        //let nivel = this.getSimplexMatrix(5, 6, 0);
        //  sergio: los colores no se repiten ni en vertical, ni en horizontal
        //  sergio: lo que tengo que ver es en el caso cuando haya un 2x2, puede existir la posibilidad de que no se muestren los 3 colores, o de que haya más grupos de colores que otros
        /*let nivel = false;
        while(!nivel){
            nivel = this.crearMatrizAleatoria(2);
        }*/

        let nivel = this.crearMatrizYFormarGrupos(5, 8, 2);

        console.log(nivel);

        for (let y = 0; y < nivel.length; y++) {
            let fila = [];
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x] != -1) {
                    let bolita;
                    bolita = this.physics.add.sprite((x * 125) + 90, (y * 125) + 120, 'bolita');
                    bolita.setScale(0.3);
                    bolita.depth = -1;
                    bolita.setTint(burbujas[nivel[y][x].color].color);
                    bolita.body.setImmovable(true);
                    bolita.body.moves = false;
                    bolita.body.setCircle(bolita.width/2);

                    //  vale: si usas el modo debug podes ver un texto sobre cada bolita con el numero de su grupo ;)
                    if (config.physics.arcade.debug) this.add.text(bolita.x, bolita.y, `${nivel[y][x].grupo}`, {fontSize: '75px', fill: 'white'}).setOrigin(0.5);

                    // if (y % 2 == 0) {
                    // } else {
                    // }
                    
                    //  vale: se pushea la bolita a la fila.
                    fila.push(bolita);
                }
            }
            //  vale: se pushea la fila al nivel cargado.
            nivelCargado.push(fila);
        }

        //  vale: se guardan los valores de los grupos en una matriz aparte.
        nivelCargadoGrupos = nivel;
    }
    
    cargarNivel(index) {
        console.log(this.createRandomMatrix());
        let nivel = niveles[index];

        for (let y = 0; y < nivel.length; y++) {
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x] != -1) {
                    let bolita;

                    if (y % 2 == 0) {
                        bolita = this.physics.add.sprite((x * 160) + 90, (y * 120) + 90, 'bolita');
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.setTint(burbujas[nivel[y][x]].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);
                    } else {
                        bolita = this.physics.add.sprite((x * 160) + 170, (y * 120) + 90, 'bolita');
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.setTint(burbujas[nivel[y][x]].color);
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);
                    }

                    nivelCargado.push(bolita);
                }
            }
        }
    }

    desaparecerBolitas(bola_level, bola_lanzada){
        if (bola_level.tintTopLeft == bola_lanzada.tintTopLeft) {
            this.destruirCercanos(bola_level);
            bola_lanzada.destroy();
        }else {
            bola_lanzada.destroy();
        }
    }

    //  vale: con esto rompes un grupo de bolitas.
    romperGrupoDeBolitas(bola_level, bola_lanzada){
        //  vale: se compara el color.

        if (bola_lanzada.tintTopLeft == bola_level.tintTopLeft) {
            //  vale: se obtiene el grupo de la bolita a romper en base a la posición.
            
            let grupo = nivelCargadoGrupos[(bola_level.y-120)/125][(bola_level.x-90)/125];

            for (let y = 0; y < nivelCargado.length; y++) {
                for (let x = 0; x < nivelCargado[y].length; x++) {
                    //  vale: se recorre toda la matriz y se destruye cada bolita perteneciente al grupo.

                    if (nivelCargadoGrupos[y][x].grupo == grupo.grupo) {
                        nivelCargado[y][x].destroy();
                    }
                }
            }
        }
        //  vale: finalmente se rompe la bolita lanzada.

        bola_lanzada.destroy();
    }

    destruirCercanos(bola) {
        let bolitasbolosas = [];

        function interno(bola) {
            bolitasbolosas = [];
            console.log(bola);
            if (bola != undefined) {
                let pos = {x: (bola.x-90)/125, y: (bola.y-120)/125};
                
                nivelCargado.splice(nivelCargado.indexOf(bola), 1);
                nivelCargado.forEach(function(bolita){ 
                    if (bola.tintTopLeft == bolita.tintTopLeft) {
                        let bolitaPos = {x: (bolita.x-90)/125, y: (bolita.y-120)/125};

                        if (bolitaPos.x == pos.x + 1 && bolitaPos.y == pos.y) {                        
                            bolitasbolosas.push(bolita);
                        }else if (bolitaPos.x == pos.x - 1 && bolitaPos.y == pos.y) {
                            bolitasbolosas.push(bolita);
                        }else if (bolitaPos.y == pos.y + 1 && bolitaPos.x == pos.x) {
                            bolitasbolosas.push(bolita);
                        }else if (bolitaPos.y == pos.y - 1 && bolitaPos.x == pos.x) {
                            
                            console.log(bolitaPos.x, bolitaPos.y);
                            bolitasbolosas.push(bolita);
                        }
                    }
                });
                bola.destroy();
            }
        }
        interno(bola);
        for(let i = 0; i < nivelCargado.length*50; i++) {
            console.log(bolitasbolosas);
            bolitasbolosas.forEach(function(bola){
                if (bola != null) {
                    interno(bola);
                }
            });
        }
    }
}