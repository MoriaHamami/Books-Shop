'use strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5


var gBooks
var gCurrBookModal = 0
var gCurrChosenRate = 0
var gFilterBy = {
    maxPrice: 300,
    minRate: 0,
    name: ''
}
var gPageIdx = 0

_createBooks()

function getPageNumber() {
    return gPageIdx + 1
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
    }
}

function getBooks() {

    var books = gBooks.filter(book => book.name.includes(gFilterBy.name) &&
        book.price <= +gFilterBy.maxPrice &&
        (book.rating >= +gFilterBy.minRate || (book.rating === undefined && gFilterBy.minRate === 0)))
    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price = 0) {
    const book = _createBook(name, price, '')
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}

function updateBook(bookId, newPrice) {
    const book = getBookById(bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function setCurrBookModal(book) {
    gCurrBookModal = book
    _saveBooksToStorage()
}

function getCurrBookModal() {
    return gCurrBookModal
}

function setCurrChosenrate(rate) {
    gCurrChosenRate = rate
    _saveBooksToStorage()
}

function getCurrChosenrate() {
    return gCurrChosenRate
}

function setBookFilter(filterBy) {
    gPageIdx = 0

    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = +filterBy.maxPrice
    else if (filterBy.minRate !== undefined) gFilterBy.minRate = +filterBy.minRate
    else gFilterBy.name = filterBy

    return gFilterBy
}


function setBookSort(sortBy) {
    gPageIdx = 0

    if (sortBy === 'price') {
        gBooks.sort((book1, book2) => (book1.price - book2.price))
    } else {
        gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name))
    }
}

function _createBook(name, price = 0, imgUrl = '', rating = undefined) {
    return {
        id: makeId(3),
        name,
        price,
        imgUrl,
        isRated: false,
        rating,
        description: makeLorem(20)
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        books.push(_createBook('The Lorax', 40, 'img/the-lorax-book.jpg'))
        books.push(_createBook('Alice in Wonderland', 55, 'img/alice-in-wonderland-book.jpg'))
        books.push(_createBook('Rumble in the Jungle', 20, 'img/rumble-in-the-jungle-book.jpg'))
        books.push(_createBook('Yawn', 56, 'img/yawn-book.jpg'))
        books.push(_createBook('Finding Nemo', 29, 'img/finding-nemo-book.jpg'))
        books.push(_createBook('Lost and Found', 59, 'img/lost-and-found-book.jpg'))
        books.push(_createBook('The Lion Inside', 67, 'img/the-lion-inside-book.jpg'))
        books.push(_createBook('Monkey Puzzle', 37, 'img/monkey-puzzle-book.jpg'))
        books.push(_createBook('The Rainbow Fish', 22, 'img/the-rainbow-fish-book.jpg'))
        books.push(_createBook('Grumpy Monkey', 41, 'img/grumpy-monkey-book.jpg'))
    }

    gBooks = books
    _saveBooksToStorage()
}


function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
