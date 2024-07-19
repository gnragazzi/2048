const Dirección = {
    ARRIBA:"ARRIBA",
    ABAJO:"ABAJO",
    IZQUIERDA:"IZQUIERDA",
    DERECHA:"DERECHA",
}

class Casillero{
    #valor;
    constructor(){
        this.#valor = 0;
    }
    getValor() {return this.#valor};
    setValor(val) {this.#valor = val};
    estáVacío(){
        return this.#valor == 0;
     };
}

class Tablero{
    #puntaje;
    #casilleros = [];
    constructor(){
        this.#puntaje = 0;
        for(let i=0;i<16;i++){
            this.#casilleros.push(new Casillero());
        }
        this.elegirVacíaAlAzar().setValor(2);
        this.elegirVacíaAlAzar().setValor(2);
    }
    sumarPuntos(puntos){this.#puntaje += puntos};
    mover(dirección){
        //Falta implementar!
        console.log(`Se movió en la dirección ${dirección}`)
    }
    reordenarTablero(dirección){
        //Falta implementar!
        console.log(`Se reordenó el tablero en la dirección ${dirección}`)
    }
    puedeMoverse(){
        //Falta implementar!
        return true;
    }
    moverEjeX(dirección){
        //Falta implementar!
        console.log(`Se movió en la dirección ${dirección}`)
    }
    moverEjeY(dirección){
        //Falta implementar!
        console.log(`Se movió en la dirección ${dirección}`)
    }
    elegirVacíaAlAzar(){
        const listaDeVacios = this.#casilleros.filter((elem)=>elem.estáVacío());
        return this.#casilleros[Math.floor(Math.random()*listaDeVacios.length)]
    }
}

class Juego{
    #puntajeMax;
    
    actualizarPuntajeMaximo(valor){
        this.#puntajeMax = valor
    }
    nuevaPartida(){
        //Falta Implementar!
        console.log("Se creo una nueva partida");
    }
    partidaGanada(puntaje){
        //Falta Implementar
        console.log(`se gano la partida con puntaje ${puntaje}`)
    }
    partidaPerdida(puntaje){
        //Falta implementar
        console.log(`Se perdió la partida, con puntaje ${puntaje}`)
    }
}

class Pantalla{
    desplegarPantalla(){
        //Falta Implementar
        console.log("Se desplegó la pantalla")

    }
    escucharMovimiento(){
        //Falta Implementar
        console.log("Se está esperando por movimientos")
    }
    desplegarModal(victoria = false, puntaje)
    {
        console.log("Se despliega modal con la victoria o el fracaso")
    }
    cerrarPantalla()
    {
        Console.log("Se cierra la pantalla y se termina el juego.")
    }
}

const tablero = new Tablero();
console.log(tablero.elegirVacíaAlAzar())