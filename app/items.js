const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}



const showMessage = () => {
    const alert = document.getElementById('alert');
    alert.className = 'alert alert-success';
    alert.innerText = 'Producto agregado al carrito';
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {
    
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
})


cards.addEventListener('click', e => {
    addCarrito(e)
    showMessage()
})

window.addEventListener('storage', () => {
    carrito = JSON.parse(localStorage.getItem("carrito"))
});

const fetchData = async () => {
    try {
        const res = await fetch('app/productos.json')
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {

    data.forEach(producto => {

        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.url)
        templateCard.querySelector('button').dataset.id = producto.id

        const clon = templateCard.cloneNode(true)
        fragment.appendChild(clon)
    });
    cards.appendChild(fragment)

}

const addCarrito = e => {

    if (e.target.classList.contains('btn-dark')) {        
        setCarrito(e.target.parentElement)
        
    }
    e.stopPropagation()   

}

const setCarrito = objeto => {

    const producto = {
        id: objeto.querySelector('button').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }

    localStorage.setItem("carrito", JSON.stringify(carrito))

    



}
