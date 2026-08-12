const SUPABASE_URL = "https://frtgxcpyhvzwwvdmuhts.supabase.co";
const SUPABASE_KEY = "sb_publishable_eCoQvkELqyJoLnhyBWqx6A_yCP7XGFp";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");

let books = [];

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
            <div class="book-cover">
                ${
                    book.cover_url
                        ? `<img src="${book.cover_url}" alt="Capa de ${book.title}">`
                        : "📖"
                }
            </div>

            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.genre || "Sem gênero informado"}</p>
            </div>
        `;

        bookGrid.appendChild(card);
    });
}

async function loadBooks() {
    bookGrid.innerHTML = `
        <p>Carregando catálogo...</p>
    `;

    try {
        const { data, error } = await db
            .from("books")
            .select("*")
            .order("title", { ascending: true });

        if (error) {
            throw error;
        }

        books = data || [];

        renderBooks(books);

    } catch (error) {
        console.error("Erro ao carregar livros:", error);

        bookGrid.innerHTML = `
            <p>Erro ao carregar catálogo.</p>
            <p>${error.message}</p>
        `;
    }
}

function searchBooks() {
    const query = searchInput.value
        .toLowerCase()
        .trim();

    const filteredBooks = books.filter((book) => {
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            (book.genre || "").toLowerCase().includes(query)
        );
    });

    renderBooks(filteredBooks);
}

searchInput.addEventListener("input", searchBooks);

loadBooks();
