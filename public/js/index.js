//iniciamos el socket

const socket = io();


//escuchamos desde el app.js el metodo del manager que nos trae los producto , y lo destructuramos para que se vean en tiempo real por medio de un ID 

socket.on("products", (products) => {

    let contenedorProductos = document.getElementById("idProductos")

    contenedorProductos.innerHTML = ""

    products.forEach(product => {

        contenedorProductos.innerHTML += '<div>' + '</br>' +
            '<p>' + 'ID : ' + product.id + '</p>' +
            '<p>' + 'Nombre : ' + product.title + '</p>' +
            '<p>' + 'Descripcion : ' + product.description + '</p>' +
            '<p>' + 'Codigo : ' + product.code + '</p>' +
            '<p>' + 'Precio : ' + product.price + '</p>' +
            '<p>' + 'Stock : ' + product.stock + '</p>' +
            '<p>' + 'Categoria : ' + product.category + '</p>' +
            '</div>'

    });


})

//por medio de este ID escuchamos el click , que va a guardar en variables los valores de cada campo , al ingresarlos los metemos en otra variable para que 
//tenga la estructura de cada campo en el que trabajamos en nuestro manager para agregar producto , al hacer click y enviar los datos desde el app.js
//usamos el metodo del manager ADD , para que pase las validaciones automaticamente  

let button = document.getElementById("idBoton")

button.addEventListener("click", (e) => {

    e.preventDefault()

    let title = document.getElementById("idTitulo").value

    let price = document.getElementById("idPrecio").value

    let thumbnail = document.getElementById("idImagen").value

    let stock = document.getElementById("idStock").value

    let code = document.getElementById("idCodigo").value

    let description = document.getElementById("idDescripcion").value

    let category = document.getElementById("idCategoria").value


    let producto = {

        title, price, thumbnail, stock, code, description, category

    }

    socket.emit("productoAdd", producto

    )

})

//pasamos una id , la cual escucha el evento click , esta tiene el metodo preventDefault(), para que la pagina no genere errrores y se recargue 
//proximo el valor que pasamos en el campo idEliminar (ID), lo emitimos al socket del app.js para que use metodo del manager y lo borre.


let buttonDelete = document.getElementById("botonEliminar")

buttonDelete.addEventListener("click", (e) => {

    e.preventDefault()

    let eliminado = document.getElementById("idEliminar").value

    socket.emit("eliminado", eliminado)

})


