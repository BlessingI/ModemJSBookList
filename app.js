//Book constructor
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


//UI constructor
class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');

        //create tr element
        const row = document.createElement('tr')

        //insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row)
          
    }
    //show alert
    showAlert(message, className){
        //create div
        const div = document.createElement('div')
        //add classes
        div.className = `alert ${className}`
        //Add text
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.container')
        //get form
        const form = document.getElementById('book-form');
        //insert alert
        container.insertBefore(div, form)


        //timeout after 3 seconds
        setTimeout(()=> {
            document.querySelector('.alert').remove()
        }, 3000)

    }

    //Delete bbok
    deleteBook(target){
        if(target.className === 'delete') {
            target.parentElement.parentElement.remove()
        }

    }

    //clear field
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

//Local storage class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks()

        books.push(book)
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks()

        books.forEach(function(book){
            const ui = new UI;

            //Add book to UI
            ui.addBookToList(book)
        })
    }

    static removeBook(isbn){
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books))

    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Event listener for delete
document.getElementById('book-form').addEventListener('submit', function(e){
    //Get form value
    const title = document.getElementById('title').value,
          author= document.getElementById('author').value,
          isbn = document.getElementById('isbn').value

    //instantiate a book
    const book = new Book(title, author, isbn)

    //instatiate UI
    const ui = new UI()

    if(title === '' || author === '' || isbn === ''){
        //Error alert
        ui.showAlert("Please fill in all field", 'error')
    } else {

        //Add book to list
        ui.addBookToList(book);

        //Add to LS
        Store.addBook(book)

        // show success Message
        ui.showAlert('Book Added', 'success')

        //clear field
        ui.clearFields();

    }



    e.preventDefault()
})

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', (e)=>{
    //instatiate UI
    const ui = new UI();

    //delete book
    ui.deleteBook(e.target)

    //remove from ls
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    
    //show message
    ui.showAlert('Book removed!', 'success')

    e.preventDefault(e)
})