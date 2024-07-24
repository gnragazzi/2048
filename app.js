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
            const valorAlAzar = Math.random()<0.9 ? 1024: 512;           
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
    getPuntaje(){
        return this.#puntaje;
    }
}

class Pantalla{
    #puntajeMaximo;
    #puntajeActual;
    #tablero;
    #casillas;
    #funcionMov;
    #juego;
    constructor(juego){
        this.#puntajeMaximo = document.getElementById("puntaje_maximo");
        const p = window.localStorage.getItem("puntaje_maximo");
        if(p) this.#puntajeMaximo.innerHTML = p;
        else this.#puntajeMaximo.innerHTML = 0;
        this.#puntajeActual = document.getElementById("puntaje_actual");
        this.#puntajeActual.innerHTML = 0;
        this.#casillas = Array.from(document.querySelectorAll(".casillero"));
        this.#tablero = new Tablero(this);
        this.#funcionMov = this.escucharMovimiento.bind(this);
        this.#juego = juego;
    }

    
    escucharMovimiento(e){
        switch(e.key){
            case "w":
                this.#tablero.mover(Dirección.ARRIBA)
                break;
            case "ArrowUp":
                this.#tablero.mover(Dirección.ARRIBA)
                break;
            case "a":
                this.#tablero.mover(Dirección.IZQUIERDA);
                break;
            case "ArrowLeft":
                this.#tablero.mover(Dirección.IZQUIERDA);
                break;
            case "s":
                this.#tablero.mover(Dirección.ABAJO);
                break;
            case "ArrowDown":
                this.#tablero.mover(Dirección.ABAJO);
                break;
            case "d":
                this.#tablero.mover(Dirección.DERECHA);
                break;
            case "ArrowRight":
                this.#tablero.mover(Dirección.DERECHA);
                break;
        }
    }

    getFuncionMovimiento(){
        return this.#funcionMov;
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
                casilla.animate({transform: ["scale(0.05)","scale(1)"]},200);
            }
            else if(animacion[indice] && Math.abs(indice - animacion[indice])<=3)
            {
                cantCasillas = (animacion[indice] - indice);
                casilla.animate({transform: [`translateX(${100*cantCasillas}%)`,"translateX(0%)"]},Math.abs(40*cantCasillas))
            }
            else if(animacion[indice])
            {
                cantCasillas = (Math.floor(animacion[indice]/4)-Math.floor(indice/4)) 
                casilla.animate({transform: [`translateY(${100*cantCasillas}%)`,"translateX(0%)"]},Math.abs(40*cantCasillas))
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
        window.removeEventListener("keydown",this.#funcionMov);
        caja.innerHTML= `
            <h1>${victoria?"Victoria!" : "Fin del Juego"}</h1>
            <p>${victoria?"Felicitaciones! ":""}Su puntaje fue <strong>${puntaje}</strong></p>
            ${victoria?'<button class="button" id="continuar_modal">Continuar Jugando</button>':""}
            <button class="button" id="volver_modal">Volver al menú Principal</button>
        `
        if(victoria){
            const btn_continuar = document.getElementById("continuar_modal");
            this.#tablero.cambiarObjetivo();
            btn_continuar.addEventListener("click",()=>{
                modal.classList.add("oculto");
                window.addEventListener("keydown",this.#funcionMov);
            })
        }
        const btn_volver = document.getElementById("volver_modal");
        btn_volver.addEventListener("click", ()=>{
            modal.classList.add("oculto");
            this.#juego.volverAlMenuPrincipalDesdePantallaDeJuego();
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

class Juego{
    #cuerpo = document.querySelector(".cuerpo");
    #pantallaPrincipal; 
    #comoJugar;
    #pantallaJuego;
    #pantalla
    constructor(){
        // CREAR NODOS
        this.#pantallaPrincipal = document.createElement("div");
        this.#pantallaPrincipal.innerHTML = `<ul>
            <li><button class="enlace" id="nuevo_juego">Nuevo Juego</button></li>
            <li><button class="enlace" id="como_jugar">¿Cómo Jugar?</button></li>
            <li><a class="enlace" href="https://es.wikipedia.org/wiki/2048" target="_blank">Acerca de 2048</a></li>
        </ul>`
        this.#comoJugar = document.createElement("div");
        this.#comoJugar.classList.add("oculto");
        this.#comoJugar.innerHTML =  `<p>El juego se juega en una cuadrícula de 4x4 y el jugador puede desplazar las fichas en cuatro direcciones: arriba, abajo, izquierda y derecha. Cuando el jugador desliza las fichas en una dirección específica, todas las fichas de la cuadrícula se mueven en esa dirección y aparece una nueva ficha en la cuadrícula. La nueva ficha será un 2 o un 4. Si dos fichas con el mismo número se tocan, se combinan en una sola ficha con la suma de sus valores.
            El objetivo del juego es combinar las fichas numeradas y crear una ficha con el número 2048. Sin embargo, el juego termina cuando la cuadrícula está llena y no quedan más movimientos. </p>
        <p>
            fuente: <a class="enlace" href="https://www.elconfidencialdigital.com/articulo/noticias/como-jugar-2048/20230315194104538288.html" target="_blank">https://www.elconfidencialdigital.com/articulo/noticias/como-jugar-2048/20230315194104538288.html</a>
        </p>
        <p>Utilice las teclas w, s, a, d para mover las casillas hacia arriba, abajo, izquierda o derecha, respectivamente. </p>
        <button class="enlace volver" id="volver">Volver al Menú Principal</a>`
        this.#pantallaJuego = document.createElement("div");
        this.#pantallaJuego.classList.add("oculto");
        this.#pantallaJuego.innerHTML = `<div>
            <p>puntaje máximo: <strong id="puntaje_maximo">0</strong></p>
            <p>puntaje actual: <strong id="puntaje_actual">0</strong></p>
        </div>
        <div>
            <div class="tablero">
                <div class="casillero" ><p class="casilla">11</p></div>
                <div class="casillero" ><p class="casilla">12</p></div>
                <div class="casillero" ><p class="casilla">13</p></div>
                <div class="casillero" ><p class="casilla">14</p></div>
                <div class="casillero" ><p class="casilla">21</p></div>
                <div class="casillero" ><p class="casilla">22</p></div>
                <div class="casillero" ><p class="casilla">23</p></div>
                <div class="casillero" ><p class="casilla">24</p></div>
                <div class="casillero" ><p class="casilla">31</p></div>
                <div class="casillero" ><p class="casilla">32</p></div>
                <div class="casillero" ><p class="casilla">33</p></div>
                <div class="casillero" ><p class="casilla">34</p></div>
                <div class="casillero" ><p class="casilla">41</p></div>
                <div class="casillero" ><p class="casilla">42</p></div>
                <div class="casillero" ><p class="casilla">43</p></div>
                <div class="casillero" ><p class="casilla">44</p></div>
            </div>
        </div>
        <div class="modal oculto">
            <div class="caja_modal">
                
            </div>
        </div>
        <button class="enlace" id="salir" >Volver al Menú Principal</button>`
        //Agregar Nodos al documento.
        this.#cuerpo.appendChild(this.#pantallaPrincipal);
        this.#cuerpo.appendChild(this.#comoJugar);
        this.#cuerpo.appendChild(this.#pantallaJuego);

        const btnComoJugar = document.getElementById("como_jugar");
        btnComoJugar.addEventListener("click",()=>{
            this.#pantallaPrincipal.classList.add("oculto");
            this.#comoJugar.classList.remove("oculto");
        })
        const btnNuevoJuego = document.getElementById("nuevo_juego");
        btnNuevoJuego.addEventListener("click",()=>{
            this.#pantallaPrincipal.classList.add("oculto");
            this.#pantallaJuego.classList.remove("oculto");
            this.#pantalla = new Pantalla(this);
            window.addEventListener("keydown",this.#pantalla.getFuncionMovimiento())
        })
        const btnVolver = document.getElementById("volver")
        btnVolver.addEventListener("click",()=>{
            this.#pantallaPrincipal.classList.remove("oculto");
            this.#comoJugar.classList.add("oculto");
        })
        const btnSalir = document.getElementById("salir")
        btnSalir.addEventListener("click",()=>{
            //this.#pantalla.confirmarSalida(this.#pantallaPrincipal, this.#pantallaJuego, this.#pantalla);
            const modal = document.querySelector(".modal");
            const caja = document.querySelector(".caja_modal");
            modal.classList.remove("oculto");
            window.removeEventListener("keydown",this.#pantalla.getFuncionMovimiento())
            caja.innerHTML= `
                <h1>Confirmar Salida</h1>
                <p>¿Está Seguro de querer salir?</p>
                <button class="button" id="continuar">Continuar Jugando</button>
                <button class="button" id="volver_pantallaJuego">Volver al menú Principal</button>
            `
            const btn_continuar = document.getElementById("continuar");
            btn_continuar.addEventListener("click",()=>{
                window.addEventListener("keydown",this.#pantalla.getFuncionMovimiento())
                modal.classList.add("oculto");
            })
            const btn_volver = document.getElementById("volver_pantallaJuego");
            btn_volver.addEventListener("click", ()=>{
                modal.classList.add("oculto");
                this.volverAlMenuPrincipalDesdePantallaDeJuego();
            })
        })
        
    }
    volverAlMenuPrincipalDesdePantallaDeJuego(){
        this.#pantallaPrincipal.classList.remove("oculto")
        this.#pantallaJuego.classList.add("oculto")
    }
}

const juego = new Juego();