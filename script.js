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

        <p class="book-author">
            ${book.author}
        </p>

        <p class="book-genre">
            ${book.genre || "Sem gênero informado"}
        </p>

        <div class="book-details">
            ${
                book.publication_year
                    ? `<span>${book.publication_year}</span>`
                    : ""
            }

            <span>
                ${
                    book.available_copies > 0
                        ? "Disponível"
                        : "Indisponível"
                }
            </span>
        </div>

        <p class="book-copies">
            ${book.available_copies} de ${book.total_copies} exemplar(es) disponível(is)
        </p>
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

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        loginMessage.textContent = "Entrando...";

        const { data, error } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error("Erro no login:", error);
            loginMessage.textContent = "E-mail ou senha incorretos.";
            return;
        }

        loginMessage.textContent = "Login realizado com sucesso!";

        console.log("Usuário conectado:", data.user);

        setTimeout(() => {
            window.location.href = "#catalogo";
        }, 1000);
    });
}



// ==============================
// PAINEL ADMINISTRATIVO
// ==============================

const adminPanel = document.getElementById("adminPanel");
const logoutButton = document.getElementById("logoutButton");
const showCatalogForm = document.getElementById("showCatalogForm");
const catalogFormContainer = document.getElementById("catalogFormContainer");

async function checkUser() {
    const {
        data: { user }
    } = await db.auth.getUser();

    if (!user) {
        return;
    }

    const { data: profile, error } = await db
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Erro ao carregar perfil:", error);
        return;
    }

    console.log("Perfil:", profile);

    if (profile.role === "admin") {
        adminPanel.style.display = "block";
    }
}

if (showCatalogForm) {
    showCatalogForm.addEventListener("click", () => {
        catalogFormContainer.style.display = "block";
        showCatalogForm.style.display = "none";
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        const { error } = await db.auth.signOut();

        if (error) {
            console.error("Erro ao sair:", error);
            return;
        }

        window.location.reload();
    });
}

checkUser();
