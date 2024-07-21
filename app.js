const Dirección = {
    ARRIBA:"ARRIBA",
    ABAJO:"ABAJO",
    IZQUIERDA:"IZQUIERDA",
    DERECHA:"DERECHA",
}

class Casillero{
    #valor;
    #id;
    constructor(indice){
        this.#valor = 0;
        this.#id = indice;
    }
    getValor() {return this.#valor};
    getId(){return this.#id};
    setValor(val) {this.#valor = val};
    estáVacío(){
        return this.#valor == 0;
     };
}

class Tablero{
    #puntaje;
    #casilleros = [];
    #pantalla;
    constructor(pantalla){
        this.#pantalla = pantalla
        this.#puntaje = 0;
        for(let i=0;i<16;i++){
            this.#casilleros.push(new Casillero(i));
            this.#pantalla.modificarCasilla(i,0);
        }
        for(let i = 0; i < 2; i++)
        {
            const aux = this.elegirVacíaAlAzar()
            aux.setValor(2);
            this.#pantalla.modificarCasilla(aux.getId(),2);
        }
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
                            const nuevoValor = valorActual*2;
                            this.#casilleros[actual].setValor(nuevoValor);
                            this.#casilleros[proximo].setValor(0);
                            this.#puntaje += nuevoValor;
                            this.#pantalla.modificarPuntaje(this.#puntaje);
                            if(nuevoValor == 2048)
                            {
                                this.#pantalla.desplegarModal(true,this.#puntaje);
                            }
                        }
                    }
                    actual += proxElem;
                }
            }
            const valorAlAzar = Math.random()<0.9 ? 2: 4;           
            this.elegirVacíaAlAzar().setValor(valorAlAzar);
            for(const casilla of this.#casilleros){
                this.#pantalla.modificarCasilla(casilla.getId(),casilla.getValor());
            }
            //this.imprimir();
        }
        else
        {
            for(const dir in Dirección){
                if(dir != dirección)
                {
                    const {exito} = this.puedeMoverse(dir);
                    if(exito) return;
                }
            }
            this.#pantalla.desplegarModal(false,this.#puntaje);
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

class Pantalla{
    #puntajeMaximo;
    #puntajeActual;
    #tablero;
    #casillas;

    constructor(){
        this.#puntajeMaximo = document.getElementById("puntaje_maximo");
        const p = window.localStorage.getItem("puntaje_maximo");
        if(p) this.#puntajeMaximo.innerHTML = p;
        else this.#puntajeMaximo.innerHTML = 0;
        this.#puntajeActual = document.getElementById("puntaje_actual");
        this.#casillas = Array.from(document.querySelectorAll(".casillero"));
        this.#tablero = new Tablero(this);
        
        window.addEventListener("keydown",this.escucharMovimiento.bind(this))
    }
    
    escucharMovimiento(e){
        switch(e.key){
            case "w":
                this.#tablero.mover(Dirección.ARRIBA)
                break;
            case "a":
                this.#tablero.mover(Dirección.IZQUIERDA);
                break;
            case "s":
                this.#tablero.mover(Dirección.ABAJO);
                break;
            case "d":
                this.#tablero.mover(Dirección.DERECHA);
                break;
        }
    }
    modificarCasilla(indice, valor){
        if(valor)
            this.#casillas[indice].innerHTML = `<p>${valor}</p>`;
        else
            this.#casillas[indice].innerHTML = `<p></p>`;
    }
    modificarPuntaje(puntaje){
        this.#puntajeActual.innerHTML = puntaje;
        if (puntaje > parseInt(this.#puntajeMaximo.innerHTML))
        {
            this.#puntajeMaximo.innerHTML = puntaje;
            window.localStorage.setItem("puntaje_maximo",puntaje);
        }
    }
    desplegarModal(victoria = false, puntaje)
    {
        const modal = document.querySelector(".modal");
        const caja = document.querySelector(".caja_modal");
        modal.classList.remove("oculto");
        window.removeEventListener("keydown",this.escucharMovimiento);
        caja.innerHTML= `
            <h1>${victoria?"Victoria!" : "Fin del Juego"}</h1>
            <p>${victoria?"Felicitaciones! ":""}Su puntaje fue <strong>${puntaje}</strong></p>
            ${victoria?'<button class="button" id="continuar">Continuar Jugando</button>':""}
            <button class="button" id="volver">Volver al menú Principal</button>
        `
        if(victoria){
            const btn_continuar = document.getElementById("continuar");
            btn_continuar.addEventListener("click",()=>{
                window.addEventListener("keydown",this.escucharMovimiento);
                modal.classList.add("oculto");
            })
        }
        const btn_volver = document.getElementById("volver");
        btn_volver.addEventListener("click", ()=>{
            window.location.assign("./index.html");
        })
    }
}

const pantalla = new Pantalla();