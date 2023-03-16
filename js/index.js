const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'save-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function isStorageExist() /* boolean */ {
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            todos.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

function makeTodo(todoObject) {
    const { id, title, author, year, isCompleted } = todoObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    // const container = document.createElement('div');
    // container.classList.add('item', 'shadow')
    // container.append(textContainer);
    // container.setAttribute('id', `todo-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerHTML = `<i class="fa fa-solid fa-rotate-left" aria-hidden="true"></i> Belum Selesai Dibaca`;
        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerHTML = `<i class="fa fa-sharp fa-solid fa-trash" aria-hidden="true"></i> Delete`;
        trashButton.addEventListener('click', function() {
            deleteDialog(id);
        });

        textContainer.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.innerHTML = `<i class="fa fa-sharp fa-solid fa-check-circle" aria-hidden="true"></i> Selesai Dibaca`;
        checkButton.addEventListener('click', function() {
            addTaskToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.innerHTML = `<i class="fa fa-sharp fa-solid fa-trash" aria-hidden="true"></i> Delete`;
        trashButton.addEventListener('click', function() {
            deleteDialog(id);
        });

        textContainer.append(checkButton, trashButton);
    }
    return textContainer;
}

function addTodo() {
    const textTodo = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, textAuthor, textYear, isCompleted);
    todos.push(todoObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(todoId /* HTMLELement */ ) {

    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Buku Selesai Dibaca'
    })
}

function removeTaskFromCompleted(todoId /* HTMLELement */ ) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteDialog(todoId) {
    var id = todoId;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            removeTaskFromCompleted(id);
            Swal.fire(
                'Deleted!',
                'Your Book has been deleted.',
                'success'
            )
        }
    })
}

function undoTaskFromCompleted(todoId /* HTMLELement */ ) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'info',
        title: 'Buku Belum Selesai Dibaca'
    })
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Berhasil Menambahkan Buku'
        })
    });
});

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function() {
    // ...
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');

    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
            listCompleted.append(todoElement);
        } else {
            uncompletedTODOList.append(todoElement);
        }
    }
});

document.getElementById('searchSubmit').addEventListener("click", function(event) {
    event.preventDefault();

    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (book of bookList) {
        if (searchBook !== '') {
            if (searchBook !== book.innerText.toLowerCase()) {
                book.parentElement.style.display = 'none';
            } else {
                book.parentElement.style.display = 'block';
            }
        } else {
            book.parentElement.style.display = 'block';
        }

    }
});