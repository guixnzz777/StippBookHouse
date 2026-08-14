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
// PAINEL LATERAL E AUTENTICAÇÃO
// ==============================

const loginButton = document.getElementById("loginButton");
const sidePanel = document.getElementById("sidePanel");
const sidePanelOverlay = document.getElementById("sidePanelOverlay");
const closeSidePanel = document.getElementById("closeSidePanel");

const loginPanel = document.getElementById("loginPanel");
const adminPanel = document.getElementById("adminPanel");

const sidePanelTitle = document.getElementById("sidePanelTitle");
const adminUserName = document.getElementById("adminUserName");

const logoutButton = document.getElementById("logoutButton");
const showCatalogForm = document.getElementById("showCatalogForm");

const catalogFormContainer =
    document.getElementById("catalogFormContainer");

const closeCatalogForm =
    document.getElementById("closeCatalogForm");

function openSidePanel() {
    sidePanel.classList.add("active");
    sidePanelOverlay.classList.add("active");
    document.body.classList.add("panel-open");
}

function closeSidePanelFunction() {
    sidePanel.classList.remove("active");
    sidePanelOverlay.classList.remove("active");
    document.body.classList.remove("panel-open");
}

if (loginButton) {
    loginButton.addEventListener("click", openSidePanel);
}

if (closeSidePanel) {
    closeSidePanel.addEventListener(
        "click",
        closeSidePanelFunction
    );
}

if (sidePanelOverlay) {
    sidePanelOverlay.addEventListener(
        "click",
        closeSidePanelFunction
    );
}


// ==============================
// VERIFICAR USUÁRIO
// ==============================

async function checkUser() {

    const {
        data: { user }
    } = await db.auth.getUser();

    // Usuário não está logado
    if (!user) {

        loginPanel.style.display = "block";
        adminPanel.style.display = "none";

        sidePanelTitle.textContent = "Entrar";

        return;
    }


    // Buscar perfil
    const { data: profile, error } = await db
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        return;
    }


    // Usuário administrador
    if (profile.role === "admin") {

        loginPanel.style.display = "none";
        adminPanel.style.display = "block";

        sidePanelTitle.textContent =
            "Painel da biblioteca";

        adminUserName.textContent =
            profile.full_name || "Administrador";

        loginButton.textContent =
            "Painel";

        return;
    }


    // Usuário autenticado, mas sem permissão administrativa

    loginPanel.style.display = "none";
    adminPanel.style.display = "none";

    sidePanelTitle.textContent =
        "Conta";

    loginButton.textContent =
        "Minha conta";
}


// ==============================
// LOGIN
// ==============================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "loginEmail"
                ).value;

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;

            loginMessage.textContent =
                "Entrando...";


            const { data, error } =
                await db.auth.signInWithPassword({
                    email,
                    password
                });


            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                loginMessage.textContent =
                    "E-mail ou senha incorretos.";

                return;
            }


            loginMessage.textContent =
                "Login realizado com sucesso!";


            await checkUser();


            setTimeout(() => {

                loginMessage.textContent = "";

            }, 1000);
        }
    );
}

// ==============================
// FORMULÁRIO DE CATALOGAÇÃO
// ==============================

if (showCatalogForm && catalogFormContainer) {
    showCatalogForm.addEventListener("click", () => {

        console.log("Botão Catalogar livros clicado");

        catalogFormContainer.classList.toggle("active");
    });
}

if (closeCatalogForm && catalogFormContainer) {
    closeCatalogForm.addEventListener("click", () => {

        catalogFormContainer.classList.remove("active");
    });
}

// ==============================
// LOGOUT
// ==============================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const { error } =
                await db.auth.signOut();


            if (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                return;
            }


            loginPanel.style.display =
                "block";

            adminPanel.style.display =
                "none";

            sidePanelTitle.textContent =
                "Entrar";

            loginButton.textContent =
                "Entrar";

            document.getElementById(
                "loginEmail"
            ).value = "";

            document.getElementById(
                "loginPassword"
            ).value = "";

        }
    );
}


// Verificar sessão ao carregar
checkUser();
