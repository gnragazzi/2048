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
    #hasta2048 = true;
    constructor(pantalla){
        this.#pantalla = pantalla
        this.#puntaje = 0;
        const a = [];
        for(let i=0;i<16;i++){
            this.#casilleros.push(new Casillero(i));
            a[i] = 0;
            this.#pantalla.modificarCasilla(i,0,a);
        }
        for(let i = 0; i < 2; i++)
        {
            const aux = this.elegirVacíaAlAzar()
            aux.setValor(2);
            a[aux.getId()] = -1;
            this.#pantalla.modificarCasilla(aux.getId(),2,a);
        }
    }
    mover(dirección){
        const {exito, indiceElemComparable,proxElem,proxFilCol} = this.puedeMoverse(dirección);
        const movimientoFinal = []
        
        //console.log(movimientoFinal)
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
                            movimientoFinal[actual] = proximo;
                            this.intercambiar(actual,proximo);
                            continue;
                        }
                        else if( valorActual == this.#casilleros[proximo].getValor())
                        {
                            movimientoFinal[actual] = proximo;
                            const nuevoValor = valorActual*2;
                            this.#casilleros[actual].setValor(nuevoValor);
                            this.#casilleros[proximo].setValor(0);
                            this.#puntaje += nuevoValor;
                            this.#pantalla.modificarPuntaje(this.#puntaje);
                            
                            if(nuevoValor == 2048 && this.#hasta2048)
                            {
                                this.#pantalla.desplegarModal(true,this.#puntaje);
                            }
                        }
                    }
                    actual += proxElem;
                }
            }
            const valorAlAzar = Math.random()<0.9 ? 2: 4;           
            const casillaAlAzar = this.elegirVacíaAlAzar();
            casillaAlAzar.setValor(valorAlAzar);
            movimientoFinal[casillaAlAzar.getId()] = -1;
            
            for(const casilla of this.#casilleros){
                this.#pantalla.modificarCasilla(casilla.getId(),casilla.getValor(),movimientoFinal);
            }
            
            //console.log(movimientoFinal);
            for(const dir in Dirección){
                const {exito} = this.puedeMoverse(dir);
                if(exito) return;
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
    cambiarObjetivo(){
        this.#hasta2048 = false;
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
	    const btn_salir = document.querySelector(".salir");
	    btn_salir.addEventListener("click",this.confirmaciónSalida);
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
    modificarCasilla(indice, valor,animacion){
        const casilla = this.#casillas[indice].querySelector(".casilla");
        //casilla.style.animation = "";
        casilla.style.background = this.elegirColor(valor);
        let cantCasillas;
        if(casilla.classList.contains("oculto"))
            casilla.classList.remove("oculto");
        if(valor)
        {
            casilla.innerHTML = `${valor}`;
            if(animacion[indice] && animacion[indice] < 0){
                casilla.animate({transform: ["scale(0.1)","scale(1)"]},120);
            }
            else if(animacion[indice] && Math.abs(indice - animacion[indice])<=3)
            {
                cantCasillas = (animacion[indice] - indice);
                casilla.animate({transform: [`translateX(${100*cantCasillas}%)`,"translateX(0%)"]},Math.abs(50*cantCasillas))
            }
            else if(animacion[indice])
            {
                cantCasillas = (Math.floor(animacion[indice]/4)-Math.floor(indice/4)) 
                casilla.animate({transform: [`translateY(${100*cantCasillas}%)`,"translateX(0%)"]},Math.abs(50*cantCasillas))
            }
        }
        else{
            casilla.innerHTML = ``;
            casilla.classList.add("oculto");
        }
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
            this.#tablero.cambiarObjetivo();
            btn_continuar.addEventListener("click",()=>{
                window.addEventListener("keydown",this.escucharMovimiento.bind(this));
                modal.classList.add("oculto");
            })
        }
        const btn_volver = document.getElementById("volver");
        btn_volver.addEventListener("click", ()=>{
            window.location.assign("./index.html");
        })
    }
    confirmaciónSalida(){
	const modal = document.querySelector(".modal");
        const caja = document.querySelector(".caja_modal");

        modal.classList.remove("oculto");
        window.removeEventListener("keydown",this.escucharMovimiento);
        caja.innerHTML= `
            <h1>Confirmar Salida</h1>
            <p>¿Está Seguro de querer salir?</p>
            <button class="button" id="continuar">Continuar Jugando</button>
            <button class="button" id="volver">Volver al menú Principal</button>
        `
        const btn_continuar = document.getElementById("continuar");
        btn_continuar.addEventListener("click",()=>{
            window.addEventListener("keydown",this.escucharMovimiento);
            modal.classList.add("oculto");
        })
	const btn_volver = document.getElementById("volver");
        btn_volver.addEventListener("click", ()=>{
            window.location.assign("./index.html");
        })
    }
    elegirColor(valor){
        switch (valor){
            case 0:
                return "#d7d7d7";
                break;
            case 2:
                return "#f57a7a"
                break;
            case 4:
                return "#F5A17A"
                break;
            case 8:
                return "#F5CE7A"
                break;
            case 16:
                return "#DEF57A"
                break;
            case 32:
                return "#8FF57A"
                break;
            case 64:
                return "#7AF5CE"
                break;
            case 128:
                    return "#7AD4F5"
                    break;
            case 256:
                return "#7AA5F5"
                break;
            case 512:
                return "#7A7EF5"
                break;
            case 1024:
                return "#9F7AF5"
                break;
            case 2048:
                return "#D67AF5"
                break;
            default:
                return "#F57ABC"
                break;

        }

    }
}

const pantalla = new Pantalla();
