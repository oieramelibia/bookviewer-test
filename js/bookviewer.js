export class BookViewer {

    constructor(data, base) {
        this.base = base;
        this.search_base = 'https://openlibrary.org/search.json?isbn=';
        this.data = data;
        this.index = 0;

        this.irudia = document.getElementById("irudia");
        this.egilea = document.getElementById("egilea");
        this.izenburua = document.getElementById("izenburua");
        this.dataElem = document.getElementById("data");
        this.isbn = document.getElementById("isbn");
        this.liburuKopuru = document.getElementById("liburuKopuru");

        this.initButtons();
        this.updateView();
    }

    initButtons() {
        // aurrera, atzera eta bilatu botoiak hasieratu
        // bilatu botoia sakatzean, erabiltzaileak sartu duen isbn-a duen liburua lortu
        // eta handleSearchData funtzioa exekutatu
        document.getElementById('aurrera').addEventListener('click', () => this.nextBook());
        document.getElementById('atzera').addEventListener('click', () => this.prevBook());
        document.getElementById('bilatu').addEventListener('click', () => {
            const isbn = this.isbn.value;
            this.searchBookByISBN(isbn);
        });
    }

    extractBookData = (book) => {
        // json objektu egoki bat bueltatu, zure webgunean erabili ahal izateko
        const { cover_i, title, author_name, first_publish_year, isbn } = book;
        return {
            filename: cover_i ? `${cover_i}-M.jpg` : "default-cover.jpg",
            izenburua: title || "Unknown Title",
            egilea: author_name && author_name.length > 0 ? author_name[0] : "Unknown Author",
            data: first_publish_year || "Unknown Year",
            isbn: isbn && isbn.length > 0 ? isbn[0] : "Unknown ISBN"
        };
    }
    addBookToData = (book, data) => {
        // data array-ean sartu liburua, eta liburu berriaren posizioa bueltatu
        data.push(book);
        return data.length - 1;
    };

    handleSearchData = (data) => {
        // lortu liburua data objektutik
        // extractBookData eta addBookToData funtzioak erabili, indizea berria lortuz
        // updateView funtzioa erabili, liburu berria bistaratzeko
        const book = data.docs?.[0];
        if (book) {
            const bookData = this.extractBookData(book);
            this.index = this.addBookToData(bookData, this.data);
            this.updateView();
        } else {
            alert("Ez da liburua aurkitu");
        }
    };

    updateView() {
        // liburuaren datu guztiak bistaratu
        // liburu kopurua bistaratu
        const { filename, izenburua, egilea, data, isbn } = this.data[this.index];
        this.irudia.src = `${this.base}${filename}`;
        this.izenburua.value = izenburua;
        this.egilea.value = egilea;
        this.dataElem.value = data;
        this.isbn.value = isbn;
        this.liburuKopuru.innerText = `${this.index + 1}/${this.data.length}`;
    }

    nextBook() {
        // Hurrengo indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu liburu kopurua gainditu
        if (this.index < this.data.length - 1) {
            this.index++;
            this.updateView();
        }
    }

    prevBook() {
        // Aurreko indizea lortu eta updateView funtzioa erabili bistaratzeko
        // ez ezazu 0 indizea gainditu
        if (this.index > 0) {
            this.index--;
            this.updateView();
        }
    }
}
