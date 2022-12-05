'use strict'

function onInit() {
    renderBooks()
    renderFilterByQueryStringParams()
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    const elPage = document.querySelector('.page')
    elPage.innerHTML = `     <button class="page-btn" onclick="onPrevPage()">&#60</button><span class="page-number" >Page ${getPageNumber()}</span><button class="page-btn" onclick="onNextPage()">&#62</button>`
    var strHtmls = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}</td>
            <td><button class="actions btn-read" onclick="onReadBook('${book.id}')">Read</button></td>
            <td><button class="actions btn-update" onclick="onUpdateBook('${book.id}')">Update</button></td>
            <td><button class="actions btn-delete" onclick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>
    `)
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

function onRemoveBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onAddBook() {
    const name = prompt('What is the name of the book?')
    const bookPrice = prompt('What is the price of the book? (in USD)')
    if (name) {
        const book = addBook(name, bookPrice)
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('What is the new price of the book?')
    if (newPrice && book.price !== newPrice) {
        updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${book.price}`)
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')

    elModal.querySelector('h5').innerText = book.name
    if(book.description) elModal.querySelector('p').innerText = book.description
    elModal.querySelector('.book-img').innerHTML = `<img src="${book.imgUrl}">`
    elModal.querySelector('.to-rate').hidden = book.isRated
    elModal.querySelector('.after-rate-msg').hidden = !book.isRated

    if (book.isRated) elModal.querySelector('.after-rate-msg span').innerText = book.rating
    else elModal.querySelector('.book-rate-value').innerText = 0
    elModal.classList.add('open')
    setCurrBookModal(book)
}



function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    setCurrChosenrate(0)
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onChangeRateBook(change) {
    var currRate = getCurrChosenrate()
    if (change === 'higher') {
        if (currRate === 10) return flashMsg(`Highest rate is 10`)
        var newRate = ++currRate
        setCurrChosenrate(newRate)
    } else {
        if (currRate === 0) return flashMsg(`Lowest rate is 0`)
        var newRate = --currRate
        setCurrChosenrate(newRate)
    }
    var elRate = document.querySelector('.book-rate-value')
    elRate.innerText = newRate
}

function onRateBook() {
    const currRate = getCurrChosenrate()
    const book = getCurrBookModal()
    book.isRated = true
    book.rating = currRate
    document.querySelector('.to-rate').hidden = true
    document.querySelector('.after-rate-msg').hidden = false
    document.querySelector('.after-rate-msg span').innerText = currRate
}
function onSetFilterBy(filterBy) {

    // } else {
    //     // else if the user typed a filter
    //     filterBy.preventDefault()
    //     const regex = /\b.+\b/gi
    //     const words = str.match(regex, word=> word.toLowerCase())
    //     if(!words.length) return
    //     if(words.includes('price')) {
    //         if(words.includes('min' || 'minimum')) setBookFilter('minPrice')
    //         else setBookFilter('maxPrice')
    //     } else if(words.includes('rate')) {
    //         if(words.includes('min' || 'minimum')) setBookFilter('minRate')
    //         else setBookFilter('maxRate')
    //     } else return flashMsg('Invalid Input')
    //     const elTxt = document.querySelector('input[name="filter"]')
    //     const txt = elTxt.value
    //     // console.log('txt', txt)
    //     elTxt.value = ''
    // }

    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function onKeyUpSearch() {
    setTimeout(() => {
        const searchStr = document.querySelector('input[name="search"]').value
        // console.log(':', )
        const filterBy = setBookFilter(searchStr)
        renderBooks()
        document.querySelector('input[name="search"]').value = searchStr

        const queryStringParams = `?name=${filterBy.name}`
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
        window.history.pushState({ path: newUrl }, '', newUrl)
    }, 1500)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryStringParams.get('name') || '',
        minRate : +queryStringParams.get('minRate') || 0,
        maxPrice : +queryStringParams.get('maxPrice') || 0
    }

    if (!filterBy.name && !filterBy.minRate && !filterBy.maxPrice) return

    // document.querySelector('.filter-vendor-select').value = filterBy.vendor
    // document.querySelector('.filter-speed-range').value = filterBy.minSpeed
    setBookFilter(filterBy)

}

function onSortBooks(sortBy) {
    setBookSort(sortBy)
    renderBooks()
}


// function onNextPage() {
//     nextPage()
//     renderCars()
// }
