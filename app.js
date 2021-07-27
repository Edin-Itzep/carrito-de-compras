//paso 3


const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content 
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

//agregar info al carrito, crear el objeto
let carrito = {} 

//debemos esperar a se ejecute todo nuestro html
// y luego ejecute la funcion

//paso 2
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

//paso 5, funcion para escuchar el evento del boton
cards.addEventListener('click', e => {

    addCarrito(e)
})

items.addEventListener('click', (e)=> {
    btnAccion(e)
})


//Para consumir la api utilizamos la constante fetch 
// y creamos una funcion async await

//paso 1
const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json')
        const data = await respuesta.json()
        pintarData(data)
    } catch (error) {
        console.log(error);
    }
}

//paso 4
const pintarData = (data)=> {
    //foreach para leer data json
    data.forEach(producto => {
    templateCard.querySelector('h5').textContent = producto.title
    templateCard.querySelector('p').textContent = producto.precio   
    templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
    //vinculamos el boton con el id para jugar con el 
    templateCard.querySelector('.btn-dark').dataset.id = producto.id
    const clone = templateCard.cloneNode(true)  
    fragment.appendChild(clone)
})
    cards.appendChild(fragment)
    
} 

//paso 5 Operacion comprar con addEventListener para 
//detectar el boton

const addCarrito = (e) => {
    /* console.log(e.target); */
    /* console.log(e.target.classList.contains('btn-dark')); */
    if(e.target.classList.contains('btn-dark')){
        /* console.log(e.target.parentElement); */
        //empujamos el nodo traido a la funcion 
        //set carrito

        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
} 

const setCarrito = objeto => {

    console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1

    }

    //le damos una copia de producto al carrito
    carrito[producto.id] = {...producto}
    pintarCarrito()

    
}


const pintarCarrito = () => {


    //iniciar en blanco el template
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title 
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad 
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id  
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio 
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify('carrito'))
}


const pintarFooter = ()=>{

    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){

        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        ` 
        return  
    }

    const nCantidad = Object.values(carrito).reduce((acum, {cantidad}) => acum + cantidad,0)         
    const nPrecio = Object.values(carrito).reduce((acum, {cantidad, precio}) => acum + cantidad * precio,0)
            
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=> {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = (e) => {
    e.target
    //accion de aumentar el boton
    if(e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]

        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        //o producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
          pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --

        if(producto.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}
