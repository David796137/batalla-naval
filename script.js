const TAM = 10;
const BARCOS = [5, 4, 3, 3, 2]; // Tamaños de los barcos

let tablero1 = [];
let tablero2 = [];
let vista1 = [];
let vista2 = [];
let turno = 1;
let fase = 'colocar'; // 'colocar', 'jugar'
let barcoActual = 0;
let orientacion = 'H'; // 'H' o 'V'
let mensaje = document.getElementById('mensaje');

function crearTablero() {
    let t = [];
    for (let i = 0; i < TAM; i++) {
        t.push(Array(TAM).fill(0));
    }
    return t;
}

function reiniciarJuego() {
    tablero1 = crearTablero();
    tablero2 = crearTablero();
    vista1 = crearTablero();
    vista2 = crearTablero();
    turno = 1;
    fase = 'colocar';
    barcoActual = 0;
    orientacion = 'H';
    mensaje.innerText = "Jugador 1: coloca tu barco de tamaño " + BARCOS[barcoActual];
    dibujarTableros();
    mostrarInstruccionesColocacion();
}

function dibujarTableros() {
    let t1 = document.getElementById('tablero1');
    let t2 = document.getElementById('tablero2');
    t1.innerHTML = '';
    t2.innerHTML = '';

    for (let f = 0; f < TAM; f++) {
        for (let c = 0; c < TAM; c++) {
            let celda1 = document.createElement('div');
            celda1.className = 'celda';
            // Mostrar barcos sólo si le toca al jugador 1 colocar o jugar
            if ((fase === 'colocar' && turno === 1) || (fase === 'jugar' && turno === 1 && tablero1[f][c] === 1)) {
                if (tablero1[f][c] === 1) celda1.classList.add('barco');
            }
            if (vista1[f][c] === 1) celda1.classList.add('agua');
            if (vista1[f][c] === 2) celda1.classList.add('tocado');
            celda1.onclick = () => clickTablero(1, f, c);
            t1.appendChild(celda1);

            let celda2 = document.createElement('div');
            celda2.className = 'celda';
            // Mostrar barcos sólo si le toca al jugador 2 colocar o jugar
            if ((fase === 'colocar' && turno === 2) || (fase === 'jugar' && turno === 2 && tablero2[f][c] === 1)) {
                if (tablero2[f][c] === 1) celda2.classList.add('barco');
            }
            if (vista2[f][c] === 1) celda2.classList.add('agua');
            if (vista2[f][c] === 2) celda2.classList.add('tocado');
            celda2.onclick = () => clickTablero(2, f, c);
            t2.appendChild(celda2);
        }
    }
}

function mostrarInstruccionesColocacion() {
    mensaje.innerText = `Jugador ${turno}: coloca tu barco de tamaño ${BARCOS[barcoActual]}. Haz click en la celda de inicio. Cambia orientación con barra espaciadora.`;
}

function puedeColocar(tablero, fila, col, tam, orient) {
    for (let i = 0; i < tam; i++) {
        let x = fila + (orient === 'V' ? i : 0);
        let y = col + (orient === 'H' ? i : 0);
        if (x >= TAM || y >= TAM || tablero[x][y] !== 0) return false;
    }
    return true;
}

function colocarBarco(tablero, fila, col, tam, orient) {
    for (let i = 0; i < tam; i++) {
        let x = fila + (orient === 'V' ? i : 0);
        let y = col + (orient === 'H' ? i : 0);
        tablero[x][y] = 1;
    }
}

function clickTablero(jugador, fila, col) {
    if (fase === 'colocar') {
        if (jugador !== turno) return;
        let tablero = turno === 1 ? tablero1 : tablero2;
        if (puedeColocar(tablero, fila, col, BARCOS[barcoActual], orientacion)) {
            colocarBarco(tablero, fila, col, BARCOS[barcoActual], orientacion);
            barcoActual++;
            if (barcoActual >= BARCOS.length) {
                if (turno === 1) {
                    turno = 2;
                    barcoActual = 0;
                    orientacion = 'H';
                    mensaje.innerText = "Jugador 2: coloca tus barcos";
                    dibujarTableros();
                    setTimeout(mostrarInstruccionesColocacion, 700);
                } else {
                    fase = 'jugar';
                    turno = 1;
                    mensaje.innerText = "¡Comienza la batalla! Turno de Jugador 1.";
                    dibujarTableros();
                }
            } else {
                mostrarInstruccionesColocacion();
            }
            dibujarTableros();
        } else {
            mensaje.innerText = "No puedes colocar el barco aquí. Intenta otra celda.";
        }
    } else if (fase === 'jugar') {
        if (jugador !== turno % 2 + 1) return;
        let vista = turno === 1 ? vista2 : vista1;
        let tablero = turno === 1 ? tablero2 : tablero1;
        if (vista[fila][col] > 0) {
            mensaje.innerText = "¡Ya disparaste aquí!";
            return;
        }
        if (tablero[fila][col] === 1) {
            vista[fila][col] = 2;
            mensaje.innerText = "¡Tocado!";
        } else {
            vista[fila][col] = 1;
            mensaje.innerText = "Agua.";
        }
        dibujarTableros();
        if (verificarVictoria(tablero, vista)) {
            mensaje.innerText = `¡Jugador ${turno} gana!`;
            fase = 'fin';
        } else {
            turno = turno % 2 + 1;
            mensaje.innerText += ` Turno de Jugador ${turno}.`;
        }
    }
}

function verificarVictoria(tablero, vista) {
    // Si todos los barcos han sido tocados
    for (let f = 0; f < TAM; f++) {
        for (let c = 0; c < TAM; c++) {
            if (tablero[f][c] === 1 && vista[f][c] !== 2) return false;
        }
    }
    return true;
}

document.getElementById('reiniciar').onclick = reiniciarJuego;

document.addEventListener('keydown', function(e) {
    if (fase === 'colocar' && (e.key === ' ' || e.code === 'Space')) {
        orientacion = orientacion === 'H' ? 'V' : 'H';
        mensaje.innerText = `Jugador ${turno}: coloca tu barco de tamaño ${BARCOS[barcoActual]} (Orientación: ${orientacion === 'H' ? 'Horizontal' : 'Vertical'})`;
    }
});

reiniciarJuego();