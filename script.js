```javascript
const books = [
    {
        title: "O Pequeno Príncipe",
        author: "Antoine de Saint-Exupéry",
        genre: "Literatura"
    },
    {
        title: "Dom Casmurro",
        author: "Machado de Assis",
        genre: "Literatura Brasileira"
    },
    {
        title: "1984",
        author: "George Orwell",
        genre: "Ficção"
    },
    {
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        genre: "Literatura Brasileira"
    }
];

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");

function renderBooks(list) {
    bookGrid.innerHTML = "";

    if (list.length === 0) {
        bookGrid.innerHTML = `
            <p>Nenhum livro encontrado.</p>
        `;
        return;
    }

    list.forEach((book) => {
        const card = document.createElement("article");

        card.className = "book-card";

        card.innerHTML = `
            <div class="book-cover">📖</div>

            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.genre}</p>
            </div>
        `;

        bookGrid.appendChild(card);
    });
}

function searchBooks() {
    const query = searchInput.value
        .toLowerCase()
        .trim();

    const filteredBooks = books.filter((book) => {
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        );
    });

    renderBooks(filteredBooks);
}

searchInput.addEventListener("input", searchBooks);

renderBooks(books);
```
