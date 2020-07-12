
const bookList = document.querySelector('#book-list')

class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }

}

class UI {

    showAlert(message, classname) {
        const div = document.createElement('div')
        div.className = `alert ${classname}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)

        setTimeout(function () {
            document.querySelector('.alert').remove()
        }, 2000)

    }

    addBookToList(book) {
        const row = document.createElement('tr')
        row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a class="delete">X</a></td>`
        bookList.appendChild(row)

    }

    deleteBook(target) {
        target.parentElement.parentElement.remove()
    }

    clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''

    }
}

class Store {

    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static displayBooks() {
        const books = Store.getBooks()
        const ui = new UI()
        books.forEach(function (book) {
            ui.addBookToList(book)
        })

    }

    static addBook(book) {
        let books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))

    }

    static removeBook(isbn) {
        const books = Store.getBooks()
        books.forEach(function (book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))

    }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks)

document.querySelector('#book-form').addEventListener('submit', function (e) {

    const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value

    const book = new Book(title, author, isbn)

    const ui = new UI()

    if (title == '' || author == '' || isbn == '') {
        ui.showAlert('Fill all the fields', 'error')
    }
    else {
        ui.addBookToList(book)
        Store.addBook(book)
        ui.showAlert('Book succesfully added!', 'success')
        ui.clearFields()
    }


    e.preventDefault()
})

document.querySelector('#book-list').addEventListener('click', function (e) {

    const ui = new UI()

    ui.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    ui.showAlert('Book Deleted!', 'error')

    e.preventDefault()
})