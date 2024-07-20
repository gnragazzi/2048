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
    mover(dirección){
        const {exito, indiceElemComparable,proxElem,proxFilCol} = this.puedeMoverse(dirección);
        if(exito)
        {
            
            for(let i = 0; i < 4; i++)
            {
                let actual = indiceElemComparable + proxFilCol * i;
                const ultimoElemento = actual + proxElem * 3;
                while(actual!=ultimoElemento)
                {
                    const valorActual = this.#casilleros[actual].getValor();
                    let proximo = actual + proxElem;
                    while(proximo != ultimoElemento + proxElem && this.#casilleros[proximo].estáVacío())
                        proximo += proxElem;
                    if(proximo != ultimoElemento + proxElem)
                    {
                        if(this.#casilleros[actual].estáVacío())
                        {
                            this.intercambiar(actual,proximo);
                            continue;
                        }
                        else if( valorActual == this.#casilleros[proximo].getValor())
                        {
                            this.#casilleros[actual].setValor(valorActual*2);
                            this.#casilleros[proximo].setValor(0);
                        }
                    }
                    actual += proxElem;
                }
            }
            const valorAlAzar = Math.random()<0.9 ? 2: 4;           
            this.elegirVacíaAlAzar().setValor(valorAlAzar);
            this.imprimir();
        }
    }
    intercambiar(a,b){
        const aux = this.#casilleros[a].getValor();
        this.#casilleros[a].setValor(this.#casilleros[b].getValor());
        this.#casilleros[b].setValor(aux);
    }
    imprimir(){
        console.log(this.#casilleros[0].getValor(), this.#casilleros[1].getValor(),this.#casilleros[2].getValor(),this.#casilleros[3].getValor())
            console.log(this.#casilleros[4].getValor(), this.#casilleros[5].getValor(),this.#casilleros[6].getValor(),this.#casilleros[7].getValor())
            console.log(this.#casilleros[8].getValor(), this.#casilleros[9].getValor(),this.#casilleros[10].getValor(),this.#casilleros[11].getValor())
            console.log(this.#casilleros[12].getValor(), this.#casilleros[13].getValor(),this.#casilleros[14].getValor(),this.#casilleros[15].getValor())
    }
    puedeMoverse(dirección){
        let indiceElemComparable;
        let indiceElemComparado;
        let proxFilCol;
        let proxElem;
        switch(dirección){
            case Dirección.IZQUIERDA:{
                indiceElemComparable = 0;
                indiceElemComparado = 1;
                proxFilCol = 4;
                proxElem = 1;
            }
            break;
            case Dirección.ARRIBA:{
                indiceElemComparable = 0;
                indiceElemComparado = 4;
                proxFilCol = 1;
                proxElem = 4;
            }
            break;
            case Dirección.DERECHA:{
                indiceElemComparable = 3;
                indiceElemComparado = 2;
                proxFilCol = 4;
                proxElem = -1;
            }
            break;
            case Dirección.ABAJO:{
                indiceElemComparable = 12;
                indiceElemComparado = 8;
                proxFilCol = 1;
                proxElem = -4;
            }   
            break;
        }
        for(let i = 0; i < 4; i++)
        {
            let valorComparable = this.#casilleros[indiceElemComparable+proxFilCol*i].getValor();
            for(let j = 0; j< 3; j++)
                {
                    const valorComparado = this.#casilleros[indiceElemComparado+proxElem*j+proxFilCol*i].getValor();
                    if(!valorComparable && valorComparado)
                        return {exito: true, indiceElemComparable,indiceElemComparado,proxElem,proxFilCol};
                    else if(!valorComparable && !valorComparado)
                        continue;
                    else if(valorComparable == valorComparado)
                        return {exito: true, indiceElemComparable,indiceElemComparado,proxElem,proxFilCol};
                    else
                        valorComparable = valorComparado;
                }
        }

        return {exito: false, indiceElemComparable,indiceElemComparado,proxElem,proxFilCol};
    }
    elegirVacíaAlAzar(){
        const listaDeVacios = this.#casilleros.filter((elem)=>elem.estáVacío());
        return listaDeVacios[Math.floor(Math.random()*listaDeVacios.length)]
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