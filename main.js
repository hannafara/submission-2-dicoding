// Langkah 1 => buat variable utk form, data, validasi dan rak buku
const form = document.getElementById('inputBook'); // variabe form utk data buku baru

let data = {} // variabe data utk penyimpanan form setelah di submit

let bookShelf = {
    unreadBooks:[],
    readedBooks:[]

} // variable bookshelf(rak buku) sebagai inisiasi awal penyimpanan data buku
let isPass = false // variable isPass(validasi) sebagai argumen untuk validasi form ketika di submit

// Langkah 2 => buat fungsi utk atur data awal pada rak buku
function setData(){
    return new Promise((resolve, reject) => { // buat promise baru
        data = JSON.parse(localStorage.getItem("data")) // ambil data dari localstorage
            if(data === null){ // jika data null
                resolve(true) // kembalikan nilai true

            }else{
                reject(false) // jika tidak kembalikan false

            }
    })
}

// Langkah 3 => buat fungsi utk dapatkan data awal pada rak buku
async function getData(){
    try {   // inisiasi fungsi try catch
       return await setData() // jalankan fungsi setData

    } catch (error) {
        console.log(error) // jika terjadi eror tampilkan pada konsol

    }
}


// Langkah 4 => buat fungsi deleteBook untuk menghapus buku pada rak yang akan di jalankan ketika tombol hapus di click
function deleteBook(bookType, id){
    let newData = bookType ? data.readedBooks : data.unreadBooks // buat variable newData untuk menerima nilai property readedBooks atau unreadBooks
    
    if(bookType){ // jika nilai bookType true
        newData.splice(newData.findIndex(el => el.id === id), 1); // temukan index dari buku dengan menggunakan method splice sesuai dengan id kemudian hapus buku menggunakan method splice
        data.readedBooks = newData // ubah nilai property readBooks sama dengan newData
        
    }else{ // jika nilai bookType false
        newData.splice(newData.findIndex(el => el.id === id), 1); // temukan index dari buku dengan menggunakan method splice sesuai dengan id kemudian hapus buku menggunakan method splice
        data.unreadBooks = newData // ubah nilai property unreadBooks sama dengan newData

    }
    localStorage.setItem("data", JSON.stringify(data)) // kirim varibale data ke localstorage

    window.location.reload() // reload page
}

// Langkah 5 => buat fungsi changeStatus untuk memindahkan buku pada rak yang akan di jalankan ketika tombol selesai/belum selesai di click
async function changeStatus(bookType, id){
    let newData = await bookType ? data.readedBooks : data.unreadBooks // buat variable newData untuk menerima nilai property readedBooks atau unreadBooks
    
    let changeData = {} // buat variable changeData untuk menerima data buku sesuai property id pada newData

    if(bookType){ // jika nilai bookType true
        changeData = newData.filter(function(el) { return el.id == id }); // nilai changeDate data sama dengan newDate(card yg di klik)
        changeData[0].isComplete = !bookType // ubah nilai property isComplete index ke 0 changeDate menjadi false
        data.unreadBooks.push(changeData[0]) // masukkan changeDate index ke 0 ke dalam property array unreadBooks

    }else{ // jika nilai bookType false
        changeData = newData.filter(function(el) { return el.id == id }); // nilai changeDate data sama dengan newDate(card yg di klik)
        changeData[0].isComplete = !bookType // ubah nilai property isComplete index ke 0 changeDate menjadi true
        data.readedBooks.push(changeData[0]) // masukkan changeDate index ke 0 ke dalam property array readedBooks

    }
    deleteBook(bookType, id) // jalankan fungsi deleteBook dengan property pertama booktype dan id sebagai property ke dua

}

// langkah 6 => buat fungsi untuk men generate component card yang akan me mapping data pada varibale data
async function displayCard (id, props){
    document.getElementById(id).innerHTML = await props.map(book =>

        // component card yang akan di tampilkan pada html ketika fungsi ini dijalankan
        `<article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
    
            <div class="action">
                <button class="green" onclick="changeStatus(${book.isComplete}, ${book.id})">${id == 'incompleteBookshelfList' ? 'Selesai dibaca' : 'Belum selesai di Baca' }</button>
                <button class="red" onclick="deleteBook(${book.isComplete}, ${book.id})">Hapus buku</button>
            </div>
        </article>`
    ).join('')
}

// Langkah 7 => jalankan fungsi getData utk mendapatkan data buku pada rak buku dan menampilkan component card
getData().then(res => {
    if(res){ // res = pengembalian fungsi getData = pengembalian fungsi setData, jika res true
        data = bookShelf // nilai data = bookshelf

        displayCard('incompleteBookshelfList', data.unreadBooks) // jalankan fungsi displayCard dengan memasukkan nilai id pada line 58 di file html untuk prop pertama dan property unreadBooks pada data untuk prop ke dua
        displayCard('completeBookshelfList', data.readedBooks)  // jalankan fungsi displayCard dengan memasukkan nilai id pada line 65 di file html untuk prop pertama dan property unreadBooks pada data untuk prop ke dua

    }else{
        displayCard('incompleteBookshelfList', data.unreadBooks) // jika res false, jalankan fungsi displayCard dengan memasukkan nilai id pada line 65 di file html untuk prop pertama dan property unreadBooks pada data untuk prop ke dua
        displayCard('completeBookshelfList', data.readedBooks) // jalankan fungsi displayCard dengan memasukkan nilai id pada line 65 di file html untuk prop pertama dan property unreadBooks pada data untuk prop ke dua

    }
})


// Langkah 8 => buat fungsi utk validasi input pada form
function validation(prop){
    let validatePass = true // buat variable baru sebagai nilai akhir utk varibale isPass
    
    for(const item in prop){ // lakukan fungsi perulangan utk melihat apakah nilai pada input ada yg tidak di isi
        if(prop[item].value === ""){ // jika nilai pada input sama "" atau tidak diisi
            validatePass = false // rubah nilai validatePass menjadi false

        }
    }

    isPass = validatePass // kemudian rubah nilai isPass menjadi sma dengan validatePass
}

// Langkah 9 => buat fungsi addEventListener yang akan di jalankan ketika event submit di jalankan
form.addEventListener('submit', (event) => {
    event.preventDefault(); // panggil fungsi preventDefault agar nilai pada submit tidak ter reset

    // buat variable untuk menerima nilai input sesuai id
    let bookTitle = document.getElementById('inputBookTitle'); // variabe bookTitle utk menyimpan nilai title
    let bookAuthor = document.getElementById('inputBookAuthor'); // variabe bookAuthor utk menyimpan nilai author
    let bookYear = document.getElementById('inputBookYear'); // variabe bookIsComplete utk menyimpan nilai year
    let bookIsComplete = document.getElementById('inputBookIsComplete') // variabe bookIsComplete utk menyimpan nilai isComplete 

    let books = {
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isComplete: bookIsComplete
    } // buat varibale books untuk di validasi sebelum form dikirim sebagai data

    validation(books) // jalankan fungsi validasi dengan books sebagai prop

    if(isPass){ // jika hasil dari validasi merubah nilai isPass menjadi true
        let newBook = {
            id: parseInt(Math.random() * 10000000),
            title: books.title.value,
            author: books.author.value,
            year: books.year.value,
            isComplete: books.isComplete.checked
        } // buat varibale newBook sebagai data yang akan di kirim ke localstorage

        let length = 0 // buat variable length sebagai argument untuk pembuatan id newBook

        if(!newBook.isComplete){ // jika property isComplete false
            length = data.unreadBooks.length // rubah nilai length menjadi panjang property array unreadBooks
            newBook.id = length === 0 || data.unreadBooks[length - 1].id !== newBook.id ? newBook.id : parseInt(Math.random() * 10000000) // rubah nilai property id menggunakan operator ternary(?) dimana jika lenght = 0 atau(||) id dari property unreadBooks index length - 1 tidak sama dengan nilai awal property id pada newBook maka kondisi ternary terpenuhi dan nilai property id pada newBook sama dengan nilai awal, jika kondisi ternary tidak terpenuhi maka property id pada newBook akan membuat data random dan di ubah keadalam intager sebagai nilai akhirnya 
            data.unreadBooks.push(newBook) // masukkan newBook kedalam array unreadBooks

            localStorage.setItem("data", JSON.stringify(data)) // kirim varibale data ke localstorage

        }else{
            length = data.readedBooks.length // jika property isComplete true, rubah nilai length menjadi panjang property array readedBooks
            newBook.id = length === 0 || data.readedBooks[length - 1].id !== newBook.id ? newBook.id : parseInt(Math.random() * 10000000) // rubah nilai property id menggunakan operator ternary(?) dimana jika lenght = 0 atau(||) id dari property readedBooks index length - 1 tidak sama dengan nilai awal property id pada newBook maka kondisi ternary terpenuhi dan nilai property id pada newBook sama dengan nilai awal, jika kondisi ternary tidak terpenuhi maka property id pada newBook akan membuat data random dan di ubah keadalam intager sebagai nilai akhirnya 
            data.readedBooks.push(newBook) // masukkan newBook kedalam array readedBooks

            localStorage.setItem("data", JSON.stringify(data)) // kirim varibale data ke localstorage

        }
        data = JSON.parse(localStorage.getItem("data")) // ambil kembali data dari localstorage

        form.reset(); // reset input pada form

    }else{ // jika hasil dari validasi merubah nilai isPass menjadi false
        alert('lengkapi data buku') // panggil fungsi alert

    }

    window.location.reload() // reload page
});


