/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://frtgxcpyhvzwwvdmuhts.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_eCoQvkELqyJoLnhyBWqx6A_yCP7XGFp";

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   CATÁLOGO
========================================================= */

const bookGrid =
    document.getElementById("bookGrid");

const searchInput =
    document.getElementById("searchInput");

let books = [];

let currentUserIsAdmin = false;


/* =========================================================
   RENDERIZAR LIVROS
========================================================= */

function renderBooks(list) {

    bookGrid.innerHTML = "";

    if (list.length === 0) {

        bookGrid.innerHTML = `
            <p>Nenhum livro encontrado.</p>
        `;

        return;
    }


    list.forEach((book) => {

        const card =
            document.createElement("article");

        card.className = "book-card";


        card.innerHTML = `

            <div class="book-cover">

                ${
                    book.cover_url

                    ? `
                        <img
                            src="${book.cover_url}"
                            alt="Capa de ${book.title}"
                        >
                    `

                    : "📖"
                }

            </div>


            <div class="book-info">

                <h3>
                    ${book.title}
                </h3>


                <p class="book-author">
                    ${book.author}
                </p>


                <p class="book-genre">
                    ${book.genre || "Sem gênero informado"}
                </p>


                <div class="book-details">

                    ${
                        book.publication_year
                        ? `
                            <span>
                                ${book.publication_year}
                            </span>
                        `
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

                    ${book.available_copies}
                    de
                    ${book.total_copies}
                    exemplar(es) disponível(is)

                </p>


                ${
                    currentUserIsAdmin

                    ? `

                        <div class="book-admin-actions">

                            <button
                                type="button"
                                class="edit-book-button"
                                data-id="${book.id}"
                            >
                                ✏️ Editar
                            </button>

                            <button
                                type="button"
                                class="delete-book-button"
                                data-id="${book.id}"
                            >
                                🗑️ Excluir
                            </button>

                        </div>

                    `

                    : ""
                }

            </div>

        `;


        bookGrid.appendChild(card);

    });


    attachBookAdminEvents();

}


/* =========================================================
   BOTÕES ADMINISTRATIVOS DOS LIVROS
========================================================= */

function attachBookAdminEvents() {

    const editButtons =
        document.querySelectorAll(
            ".edit-book-button"
        );


    const deleteButtons =
        document.querySelectorAll(
            ".delete-book-button"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const bookId =
                    button.dataset.id;

                openEditBookModal(bookId);

            }
        );

    });


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const bookId =
                    button.dataset.id;

                deleteBook(bookId);

            }
        );

    });

}


/* =========================================================
   CARREGAR LIVROS
========================================================= */

async function loadBooks() {

    bookGrid.innerHTML = `
        <p>Carregando catálogo...</p>
    `;


    try {

        const {
            data,
            error
        } = await db
            .from("books")
            .select("*")
            .order(
                "title",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        books = data || [];


        renderBooks(books);


    } catch (error) {

        console.error(
            "Erro ao carregar livros:",
            error
        );


        bookGrid.innerHTML = `

            <p>
                Erro ao carregar catálogo.
            </p>

            <p>
                ${error.message}
            </p>

        `;

    }

}


/* =========================================================
   PESQUISA
========================================================= */

function searchBooks() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredBooks =
        books.filter((book) => {

            return (

                (book.title || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (book.author || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (book.genre || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (book.asset_number || "")
                    .toLowerCase()
                    .includes(query)

            );

        });


    renderBooks(filteredBooks);

}


searchInput.addEventListener(
    "input",
    searchBooks
);


loadBooks();


/* =========================================================
   ELEMENTOS DE AUTENTICAÇÃO
========================================================= */

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const loginPanel =
    document.getElementById(
        "loginPanel"
    );

const adminPanel =
    document.getElementById(
        "adminPanel"
    );

const adminUserName =
    document.getElementById(
        "adminUserName"
    );

const sidePanelTitle =
    document.getElementById(
        "sidePanelTitle"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


/* =========================================================
   PAINEL LATERAL
========================================================= */

const sidePanel =
    document.getElementById(
        "sidePanel"
    );

const sidePanelOverlay =
    document.getElementById(
        "sidePanelOverlay"
    );

const closeSidePanel =
    document.getElementById(
        "closeSidePanel"
    );


function openSidePanel() {

    sidePanel.classList.add(
        "active"
    );

    sidePanelOverlay.classList.add(
        "active"
    );

    document.body.classList.add(
        "panel-open"
    );

}


function closeSidePanelFunction() {

    sidePanel.classList.remove(
        "active"
    );

    sidePanelOverlay.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "panel-open"
    );

}


loginButton.addEventListener(
    "click",
    openSidePanel
);


closeSidePanel.addEventListener(
    "click",
    closeSidePanelFunction
);


sidePanelOverlay.addEventListener(
    "click",
    closeSidePanelFunction
);


/* =========================================================
   VERIFICAR USUÁRIO
========================================================= */

async function checkUser() {

    const {
        data: { user }
    } = await db.auth.getUser();


    if (!user) {

        currentUserIsAdmin = false;

        loginPanel.style.display =
            "block";

        adminPanel.style.display =
            "none";

        sidePanelTitle.textContent =
            "Entrar";

        loginButton.textContent =
            "Entrar";


        renderBooks(
            books
        );

        return;

    }


    const {
        data: profile,
        error
    } = await db
        .from("profiles")
        .select(
            "full_name, role"
        )
        .eq(
            "id",
            user.id
        )
        .single();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        currentUserIsAdmin = false;

        renderBooks(
            books
        );

        return;
    }

console.log("PERFIL DO USUÁRIO:", profile);
console.log("ROLE:", profile.role);

if (
    profile.role === "admin"
) {

        currentUserIsAdmin = true;

        loginPanel.style.display =
            "none";

        adminPanel.style.display =
            "block";

        sidePanelTitle.textContent =
            "Painel da biblioteca";


        adminUserName.textContent =
            profile.full_name ||
            "Administrador";


        loginButton.textContent =
            "Painel";


        renderBooks(
            books
        );

        return;

    }


    currentUserIsAdmin = false;

    loginPanel.style.display =
        "none";

    adminPanel.style.display =
        "none";

    sidePanelTitle.textContent =
        "Conta";

    loginButton.textContent =
        "Minha conta";


    renderBooks(
        books
    );

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        loginMessage.textContent =
            "Entrando...";


        const {
            data,
            error
        } = await db.auth.signInWithPassword({

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


        console.log(
            "Usuário conectado:",
            data.user
        );


        loginMessage.textContent =
            "Login realizado com sucesso!";


        await checkUser();


        setTimeout(() => {

            loginMessage.textContent =
                "";

        }, 1000);

    }
);


/* =========================================================
   MODAL DE CATALOGAÇÃO
========================================================= */

const showCatalogForm =
    document.getElementById(
        "showCatalogForm"
    );

const catalogModal =
    document.getElementById(
        "catalogModal"
    );

const closeCatalogModal =
    document.getElementById(
        "closeCatalogModal"
    );

const cancelCatalogModal =
    document.getElementById(
        "cancelCatalogModal"
    );

const catalogModalOverlay =
    document.querySelector(
        ".catalog-modal-overlay"
    );


function openCatalogModal() {

    catalogModal.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeCatalogModalFunction() {

    catalogModal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


showCatalogForm.addEventListener(
    "click",
    () => {

        editingBookId = null;

        document.getElementById(
            "catalogModalTitle"
        ).textContent =
            "Cadastrar livro";

        catalogForm.reset();

        document.getElementById(
            "bookCopies"
        ).value = 1;

        openCatalogModal();

    }
);


closeCatalogModal.addEventListener(
    "click",
    closeCatalogModalFunction
);


cancelCatalogModal.addEventListener(
    "click",
    closeCatalogModalFunction
);


catalogModalOverlay.addEventListener(
    "click",
    closeCatalogModalFunction
);


/* =========================================================
   CADASTRO / EDIÇÃO DE LIVROS
========================================================= */

const catalogForm =
    document.getElementById(
        "catalogForm"
    );

const catalogMessage =
    document.getElementById(
        "catalogMessage"
    );


let editingBookId = null;


if (catalogForm) {

    catalogForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            catalogMessage.textContent =
                editingBookId
                ? "Salvando alterações..."
                : "Cadastrando livro...";


            catalogMessage.style.color =
                "";


            try {

                const {
                    data: {
                        user
                    },
                    error: userError
                } = await db.auth.getUser();


                if (userError) {
                    throw userError;
                }


                if (!user) {

                    throw new Error(
                        "Nenhum usuário está autenticado."
                    );

                }


                const {
                    data: profile,
                    error: profileError
                } = await db
                    .from("profiles")
                    .select("role")
                    .eq(
                        "id",
                        user.id
                    )
                    .single();


                if (profileError) {
                    throw profileError;
                }


                if (
                    !profile ||
                    profile.role !== "admin"
                ) {

                    throw new Error(
                        "Este usuário não possui permissão de administrador."
                    );

                }


                const title =
                    document.getElementById(
                        "bookTitle"
                    ).value.trim();


                const author =
                    document.getElementById(
                        "bookAuthor"
                    ).value.trim();


                const assetNumber =
                    document.getElementById(
                        "bookAssetNumber"
                    ).value.trim();


                const isbn =
                    document.getElementById(
                        "bookISBN"
                    ).value.trim();


                const publisher =
                    document.getElementById(
                        "bookPublisher"
                    ).value.trim();


                const year =
                    document.getElementById(
                        "bookYear"
                    ).value;


                const genre =
                    document.getElementById(
                        "bookGenre"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "bookCategory"
                    ).value.trim();


                const location =
                    document.getElementById(
                        "bookLocation"
                    ).value.trim();


                const cover =
                    document.getElementById(
                        "bookCover"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "bookDescription"
                    ).value.trim();


                const copies =
                    Number(
                        document.getElementById(
                            "bookCopies"
                        ).value
                    );


                if (!title || !author) {

                    throw new Error(
                        "Título e autor são obrigatórios."
                    );

                }


                if (!copies || copies < 1) {

                    throw new Error(
                        "A quantidade de exemplares deve ser pelo menos 1."
                    );

                }


                const bookData = {

                    title,

                    author,

                    asset_number:
                        assetNumber || null,

                    isbn:
                        isbn || null,

                    publisher:
                        publisher || null,

                    publication_year:
                        year
                        ? Number(year)
                        : null,

                    genre:
                        genre || null,

                    category:
                        category || null,

                    description:
                        description || null,

                    cover_url:
                        cover || null,

                    shelf_location:
                        location || null,

                    total_copies:
                        copies

                };


                /* =================================================
                   EDITAR
                ================================================= */

                if (editingBookId) {

                    const {
                        data,
                        error
                    } = await db
                        .from("books")
                        .update(bookData)
                        .eq(
                            "id",
                            editingBookId
                        )
                        .select()
                        .single();


                    if (error) {
                        throw error;
                    }


                    console.log(
                        "Livro atualizado:",
                        data
                    );


                    catalogMessage.textContent =
                        "Livro atualizado com sucesso!";


                    catalogMessage.style.color =
                        "#315c4c";


                }


                /* =================================================
                   CADASTRAR
                ================================================= */

                else {

                    bookData.available_copies =
                        copies;

                    bookData.status =
                        "available";


                    const {
                        data,
                        error
                    } = await db
                        .from("books")
                        .insert(
                            bookData
                        )
                        .select()
                        .single();


                    if (error) {
                        throw error;
                    }


                    console.log(
                        "Livro cadastrado:",
                        data
                    );


                    catalogMessage.textContent =
                        "Livro cadastrado com sucesso!";


                    catalogMessage.style.color =
                        "#315c4c";

                }


                await loadBooks();


                setTimeout(() => {

                    closeCatalogModalFunction();

                    catalogForm.reset();

                    document.getElementById(
                        "bookCopies"
                    ).value = 1;

                    editingBookId = null;

                }, 1000);


            } catch (error) {

                console.error(
                    "Erro ao salvar livro:",
                    error
                );


                catalogMessage.textContent =
                    error.message ||
                    "Não foi possível salvar o livro.";


                catalogMessage.style.color =
                    "#a33";

            }

        }
    );

}


/* =========================================================
   ABRIR MODAL PARA EDITAR
========================================================= */

function openEditBookModal(bookId) {

    const book =
        books.find(
            (item) =>
                String(item.id) ===
                String(bookId)
        );


    if (!book) {

        alert(
            "Não foi possível encontrar este livro."
        );

        return;
    }


    editingBookId =
        book.id;


    document.getElementById(
        "catalogModalTitle"
    ).textContent =
        "Editar livro";


    document.getElementById(
        "bookTitle"
    ).value =
        book.title || "";


    document.getElementById(
        "bookAuthor"
    ).value =
        book.author || "";


    document.getElementById(
        "bookAssetNumber"
    ).value =
        book.asset_number || "";


    document.getElementById(
        "bookISBN"
    ).value =
        book.isbn || "";


    document.getElementById(
        "bookPublisher"
    ).value =
        book.publisher || "";


    document.getElementById(
        "bookYear"
    ).value =
        book.publication_year || "";


    document.getElementById(
        "bookGenre"
    ).value =
        book.genre || "";


    document.getElementById(
        "bookCategory"
    ).value =
        book.category || "";


    document.getElementById(
        "bookLocation"
    ).value =
        book.shelf_location || "";


    document.getElementById(
        "bookCover"
    ).value =
        book.cover_url || "";


    document.getElementById(
        "bookDescription"
    ).value =
        book.description || "";


    document.getElementById(
        "bookCopies"
    ).value =
        book.total_copies || 1;


    catalogMessage.textContent =
        "";


    openCatalogModal();

}


/* =========================================================
   EXCLUIR LIVRO
========================================================= */

async function deleteBook(bookId) {

    const book =
        books.find(
            (item) =>
                String(item.id) ===
                String(bookId)
        );


    if (!book) {

        alert(
            "Livro não encontrado."
        );

        return;
    }


    const confirmed =
        confirm(
            `Tem certeza que deseja excluir "${book.title}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const {
            data: {
                user
            },
            error: userError
        } = await db.auth.getUser();


        if (userError) {
            throw userError;
        }


        if (!user) {

            throw new Error(
                "Você precisa estar logado."
            );

        }


        const {
            data: profile,
            error: profileError
        } = await db
            .from("profiles")
            .select("role")
            .eq(
                "id",
                user.id
            )
            .single();


        if (profileError) {
            throw profileError;
        }


        if (
            !profile ||
            profile.role !== "admin"
        ) {

            throw new Error(
                "Apenas administradores podem excluir livros."
            );

        }


        const {
            error
        } = await db
            .from("books")
            .delete()
            .eq(
                "id",
                bookId
            );


        if (error) {
            throw error;
        }


        alert(
            "Livro excluído com sucesso!"
        );


        await loadBooks();

    } catch (error) {

        console.error(
            "Erro ao excluir livro:",
            error
        );


        alert(
            "Não foi possível excluir o livro.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   ESC FECHA MODAL / PAINEL
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        if (
            catalogModal.classList.contains(
                "active"
            )
        ) {

            closeCatalogModalFunction();

            return;

        }


        if (
            sidePanel.classList.contains(
                "active"
            )
        ) {

            closeSidePanelFunction();

        }

    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    async () => {

        const {
            error
        } = await db.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            return;
        }


        currentUserIsAdmin =
            false;


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


        loginMessage.textContent =
            "";


        renderBooks(
            books
        );

    }
);


/* =========================================================
   VERIFICAR SESSÃO
========================================================= */

checkUser();