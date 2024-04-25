const dateNow = document.querySelector('#dateNow')
const listTask = document.querySelector('#list')
const item = document.querySelector('#item')
const input = document.querySelector('#input')
const btnAdd = document.querySelector('#btn-add')
const check = 'fa-check-circle'
const uncheck = 'fa-circle'
const lineThrough = 'line-through'
let LIST

let id = 0 // para que inicie en 0 cada tarea tendra un id diferente

//creacion de LocalDate actualizada 

const LocalDate = new Date()
dateNow.innerHTML = LocalDate.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' })

// funcion de agregar tarea 

function addTask(task, id, success, deleted) {
    if (deleted) { return } // si existe eliminado es true si no es false 

    const taskOk = success ? check : uncheck // si success es verdadero check si no uncheck

    const taskChecked = success ? lineThrough : ''

    const item = `
                        <li id="item">
                        <i class="far ${taskOk}" data="success" id="${id}"></i>
                        <i><input 
                            class="input-task" 
                            disabled 
                            class="text ${taskChecked}"
                            value=${task} 
                        /></i>
                        <i class="fas fa-edit de" data="edited" id="${id}"></i>
                        <i class="fas fa-trash de" data="deleted" id="${id}"></i> 
                        </li>
                    `
    listTask.insertAdjacentHTML("beforeend", item)

}

//funcion editar tarea

function editTask(element) {
    console.log(element.parentNode.querySelector('.input-task').value);
    element.parentNode.querySelector('.input-task').disabled = false    
    element.parentNode.querySelector('.input-task').focus()
    element.parentNode.querySelector('.input-task').addEventListener('keyup',  (event) => {
        if (event.key == 'Enter') {
            element.parentNode.querySelector('.input-task').disabled = true
            LIST[element.id].name = element.parentNode.querySelector('.input-task').value
            localStorage.setItem('TODO', JSON.stringify(LIST))
        }
    })
}

// funcion de Tarea Realizada 

function taskDone(element) {
    element.classList.toggle(check)
    element.classList.toggle(uncheck)
    element.parentNode.querySelector('.input-task').classList.toggle(lineThrough)
    LIST[element.id].success = LIST[element.id].success ? false : true //Si
}

function deletedTask(element) {
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].deleted = true
    console.log(LIST)
}


// crear un evento para escuchar el enter y para habilitar el boton 

btnAdd.addEventListener('click', () => {
    const task = input.value
    if (task) {
        addTask(task, id, false, false)
        LIST.push({
            name: task,
            id: id,
            success: false,
            deleted: false
        })
        localStorage.setItem('TODO', JSON.stringify(LIST))
        id++
        input.value = ''
    }

})

document.addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        const task = input.value
        if (task) {
            addTask(task, id, false, false)
            LIST.push({
                name: task,
                id: id,
                success: false,
                deleted: false
            })
            localStorage.setItem('TODO', JSON.stringify(LIST))

            input.value = ''
            id++
            console.log(LIST)
        }
    }

})


listTask.addEventListener('click',  (event)=> {
    const element = event.target
    const elementData = element.attributes.data.value
    console.log(elementData)

    if (elementData == 'success') {
        taskDone(element)
    }
    else if (elementData == 'deleted') {
        deletedTask(element)
        console.log("deleted")
    }
    else if (elementData == 'edited') {
        editTask(element)
    }
    localStorage.setItem('TODO', JSON.stringify(LIST))
})




let data = localStorage.getItem('TODO')
if (data) {
    LIST = JSON.parse(data)
    console.log(LIST)
    id = LIST.length
    loadTask(LIST)
} else {
    LIST = []
    id = 0
}


function loadTask(array) {
    array.forEach( (item)=> addTask(item.name, item.id, item.success, item.deleted))
}