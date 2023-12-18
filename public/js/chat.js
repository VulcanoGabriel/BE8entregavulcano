//chat Socket.io



let socket 


//declaro una variable para almacenar los usuarios

let user = sessionStorage.getItem("user") || ""

if (user) {
    
        //hace que muestre el nombre del usuario ingresado al lado de la caja de chat principal

        document.getElementById("userNombre").innerHTML = user + " :"


        //inicia la conexcion con el servidor despues de pasar la validacion inicial , para que no entre en conflicto con errores

        initIo()
} else {

//uso sweet alert para dar mejora a la interfaz para ingresar el usuario

Swal.fire(
    {

        //titulo del cartel
        title: 'auth',

        //tipo de ingreso en el formato de la casilla
        input: 'text',

        //el texto que dice prefefinido
        text: 'set user name',

        //valida que el valor ingresado este escrito y le da formato con el metodo trim()
        inputValidator: value => {

            return !value.trim() && 'please write an username'
        },

        //hace que no podamos clickear fuera de la ventana de sweet alert
        allowOutsideClick: false,
    })
    //si pasa la validacion de arriba hace que se setee el valor del usuario con el valor ingresado en el sweet alert
    .then(result => {

        user = result.value


        sessionStorage.setItem("user", user)

        //hace que muestre el nombre del usuario ingresado al lado de la caja de chat principal

        document.getElementById("userNombre").innerHTML = user + " :"


        //inicia la conexcion con el servidor despues de pasar la validacion inicial , para que no entre en conflicto con errores

        initIo()

    })
}

//con el id de la entrada del chat escucha cuando presionamos enter si ese evento es igual a la tecla enter y el evento es mayor a 0 , envia el mensaje con el valor que pusimos en este caso es el texto del chat

const inputChat = document.getElementById('idChatInput')

inputChat.addEventListener("keyup", event => {

    if (event.key === 'Enter') {
        sendMessage(event.currentTarget.value)
    }
})



document.getElementById('send').addEventListener("click", event => {
    sendMessage(inputChat.value)
    
})




//funcion que envia mensaje con usuario y mensaje texto , recibe por parametro cada uno y lo emite por el socket hacia el app.js donde esta el socket central

function sendMessage(message) {


    if (message.trim().length > 0) {

        socket.emit("message", {

            user,
            message
        }
        )

        //borra el valor de la casilla mensaje
        inputChat.value = ""
    }

}


//recibe los mensajes por el socket y los dibuja en el chatbox por la ID , los recorre en el foreach y los pone con su usuario y mensaje por separado de todo lo que reciba

function initIo() {


    //ejecuta el socket (la conexion)
    socket = io()


    //el socket escucha los mensajes
    socket.on("logs", messages => {


        //guardo en una constante el id de la caja de chat
        const box = document.getElementById("idChatBox")



        let html = ""

        //recorro lo que trae el socket lo revierto en orden con el metodo reverse y lo recorro para separar todos los mensajes
        messages.reverse().forEach(msg => {


            html += `<p> <i> ${msg.user}   <i>:   ${msg.message}  </p>`

        })

        //dibujo en el box lo que esta dentro del html de variable vacia al principio pero despues guarda el mensaje y el susuario que lo envia para verlo en el index principal

        box.innerHTML = html

    })
}

