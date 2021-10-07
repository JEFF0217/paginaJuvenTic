const items = document.getElementById('items')
const total = document.getElementById('total')
const form = document.getElementById('form')
const detallesCompra = document.getElementById('detallesCompra')
const templateCarrito = document.getElementById('template-carrito').content
const templateTotal = document.getElementById('template-total').content
const fragment = document.createDocumentFragment()
const btnVaciar = document.getElementById('vaciar-carrito')
const btnEnviar = document.getElementById('enviarEmail')

let carrito = {}



document.addEventListener('DOMContentLoaded', () => {

    carrito = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito()

})
window.addEventListener('storage', () => {
    location.reload();
});

const pintarCarrito = () => {
    items.innerHTML = ""

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = producto.precio
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('.btn-warning').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    });
    items.appendChild(fragment)


    pintarTotal()
    localStorage.setItem("carrito", JSON.stringify(carrito))

}

items.addEventListener('click', e => {
    btnAction(e)
})


const pintarTotal = () => {
    total.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        total.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th> 
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((contCantidad, { cantidad }) => contCantidad + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((contPrecio, { cantidad, precio }) => contPrecio + cantidad * precio, 0)
    templateTotal.querySelectorAll('td')[0].textContent = nCantidad
    templateTotal.querySelector('span').textContent = nPrecio

    const clone = templateTotal.cloneNode(true)
    fragment.appendChild(clone)
    total.appendChild(fragment)

    

    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAction = e => {

    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()

    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--

        if (producto.cantidad === 0) {

            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()

    } 
    if (e.target.classList.contains('btn-warning')) {
        
        delete carrito[e.target.dataset.id]
        pintarCarrito()
    }
}


function finalizarCompra() {
    document.getElementById("detallesCompra1").innerHTML = '';

    Object.values(carrito).forEach(producto => {

        document.getElementById("detallesCompra1").innerHTML += producto.cantidad + " x " + producto.title + " = " + "$" + producto.cantidad * producto.precio + "<br>"
        document.getElementById("detallesCompra2").innerHTML = "Total: " + "$" + Object.values(carrito).reduce((i, { cantidad, precio }) => i + cantidad * precio, 0)

        return;

    })

}



function sendEmail() {
    document.getElementById('form').submit();

    let name = document.getElementById('toName').value
    let correo = document.getElementById('toEmail').value
    let mensaje = "<h2 style='font-size: 1.1vw; color: black;'>" + document.getElementById("detallesCompra1").innerHTML + "</h2> "
    mensaje += "<h1 style='font-size: 1.5vw; color: black;'>" + document.getElementById("detallesCompra2").innerHTML + "</h1>"


    sendEmailCliente(correo,name,mensaje)
    sendEmailRestaurant(correo,name,mensaje)
    alert("mensaje enviado correctamente, el carrito fue borrado")

    carrito = {}
    pintarCarrito()

    var myModal = new bootstrap.Modal(document.getElementById('modalCompra'), options)
    myModal.hide()

}

function sendEmailCliente(correo,name,mensaje){

    
    Email.send({
        Host: "smtp.gmail.com",
        Username: "jefferson.z0217@gmail.com",
        Password: "dplaenyauatyrchs",
        To: correo,
        From: "jefferson.z0217@gmail.com",
        Subject: name + " aqui esta tú pedido",
        Body: mensaje,
    })
}

function sendEmailRestaurant(correo,name,mensaje){

    
    Email.send({
        Host: "smtp.gmail.com",
        Username: "jefferson.z0217@gmail.com",
        Password: "dplaenyauatyrchs",
        To: "jefferson.1701717549@ucaldas.edu.co",
        From: "jefferson.z0217@gmail.com",
        Subject: name + " realizo uno nueva compra",
        Body: name+"<br>"+ correo+ "<br> "+mensaje,
    })
}



