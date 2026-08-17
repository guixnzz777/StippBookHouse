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
   VARIÁVEIS
========================================================= */

let books = [];

let categories = [];

let currentUserIsAdmin = false;

let editingBookId = null;

let selectedBookId = null;


/* =========================================================
   ELEMENTOS
========================================================= */

const bookGrid =
    document.getElementById("bookGrid");

const searchInput =
    document.getElementById("searchInput");

const loginButton =
    document.getElementById("loginButton");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const loginPanel =
    document.getElementById("loginPanel");

const adminPanel =
    document.getElementById("adminPanel");

const adminUserName =
    document.getElementById("adminUserName");

const sidePanelTitle =
    document.getElementById("sidePanelTitle");

const logoutButton =
    document.getElementById("logoutButton");

const sidePanel =
    document.getElementById("sidePanel");

const sidePanelOverlay =
    document.getElementById("sidePanelOverlay");

const closeSidePanel =
    document.getElementById("closeSidePanel");


/* =========================================================
   MODAL DE CATALOGAÇÃO
========================================================= */

const showCatalogForm =
    document.getElementById("showCatalogForm");

const catalogModal =
    document.getElementById("catalogModal");

const closeCatalogModal =
    document.getElementById("closeCatalogModal");

const cancelCatalogModal =
    document.getElementById("cancelCatalogModal");

const catalogModalOverlay =
    document.querySelector(".catalog-modal-overlay");

const catalogForm =
    document.getElementById("catalogForm");

const catalogMessage =
    document.getElementById("catalogMessage");

const bookCategory =
    document.getElementById("bookCategory");


/* =========================================================
   MODAL DE DETALHES
========================================================= */

const bookDetailsModal =
    document.getElementById("bookDetailsModal");

const bookDetailsOverlay =
    document.querySelector(".book-details-overlay");

const closeBookDetailsModal =
    document.getElementById("closeBookDetailsModal");

const detailsBookTitle =
    document.getElementById("detailsBookTitle");

const detailsBookCover =
    document.getElementById("detailsBookCover");

const detailsBookCoverPlaceholder =
    document.getElementById("detailsBookCoverPlaceholder");

const detailsBookAuthor =
    document.getElementById("detailsBookAuthor");

const detailsBookAssetNumber =
    document.getElementById("detailsBookAssetNumber");

const detailsBookISBN =
    document.getElementById("detailsBookISBN");

const detailsBookPublisher =
    document.getElementById("detailsBookPublisher");

const detailsBookYear =
    document.getElementById("detailsBookYear");

const detailsBookGenre =
    document.getElementById("detailsBookGenre");

const detailsBookCategory =
    document.getElementById("detailsBookCategory");

const detailsBookLocation =
    document.getElementById("detailsBookLocation");

const detailsBookCopies =
    document.getElementById("detailsBookCopies");

const detailsBookStatus =
    document.getElementById("detailsBookStatus");

const detailsBookDescription =
    document.getElementById("detailsBookDescription");

const bookAdminActions =
    document.getElementById("bookAdminActions");

const editBookButton =
    document.getElementById("editBookButton");

const deleteBookButton =
    document.getElementById("deleteBookButton");


/* =========================================================
   CATEGORIAS
========================================================= */

async function loadCategories() {

    try {

        const {
            data,
            error
        } = await db
            .from("categories")
            .select("id, name")
            .order("name", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        categories = data || [];


        bookCategory.innerHTML = `
            <option value="">
                Selecione uma categoria
            </option>
        `;


        categories.forEach((category) => {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            bookCategory.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Erro ao carregar categorias:",
            error
        );

    }

}


/* =========================================================
   NOME DA CATEGORIA
========================================================= */

function getCategoryName(categoryId) {

    const category =
        categories.find(
            item =>
                String(item.id) ===
                String(categoryId)
        );


    return category
        ? category.name
        : "Sem categoria";

}


/* =========================================================
   RENDERIZAR LIVROS
========================================================= */

function renderBooks(list) {

    bookGrid.innerHTML = "";


    if (!list.length) {

        bookGrid.innerHTML =
            "<p>Nenhum livro encontrado.</p>";

        return;

    }


    list.forEach((book) => {

        const card =
            document.createElement("article");

        card.className =
            "book-card";


        card.dataset.id =
            book.id;


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
                    ${book.title || "Sem título"}
                </h3>

                <p class="book-author">
                    ${book.author || "Autor desconhecido"}
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
                            Number(book.available_copies) > 0
                            ? "Disponível"
                            : "Indisponível"
                        }

                    </span>

                </div>


                <p class="book-copies">

                    ${book.available_copies ?? 0}
                    de
                    ${book.total_copies ?? 0}
                    exemplar(es) disponível(is)

                </p>


                ${
                    currentUserIsAdmin

                    ? `

                        <div
                            class="book-admin-actions"
                            onclick="event.stopPropagation()"
                        >

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


        /* =========================================
           CLICAR NO LIVRO
        ========================================= */

        card.addEventListener(
            "click",
            () => {

                openBookDetailsModal(
                    book.id
                );

            }
        );


        bookGrid.appendChild(card);

    });


    attachBookAdminEvents();

}


/* =========================================================
   BOTÕES ADMINISTRATIVOS
========================================================= */

function attachBookAdminEvents() {

    document
        .querySelectorAll(".edit-book-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    openEditBookModal(
                        button.dataset.id
                    );

                }
            );

        });


    document
        .querySelectorAll(".delete-book-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    deleteBook(
                        button.dataset.id
                    );

                }
            );

        });

}


/* =========================================================
   CARREGAR LIVROS
========================================================= */

async function loadBooks() {

    bookGrid.innerHTML =
        "<p>Carregando catálogo...</p>";


    try {

        const {
            data,
            error
        } = await db
            .from("books")
            .select("*")
            .order("title", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        books =
            data || [];


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

                ||

                getCategoryName(
                    book.category_id
                )
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


/* =========================================================
   MODAL DE DETALHES
========================================================= */

function openBookDetailsModal(bookId) {

    const book =
        books.find(
            item =>
                String(item.id) ===
                String(bookId)
        );


    if (!book) {
        return;
    }


    selectedBookId =
        book.id;


    detailsBookTitle.textContent =
        book.title || "Sem título";


    detailsBookAuthor.textContent =
        book.author || "—";


    detailsBookAssetNumber.textContent =
        book.asset_number || "—";


    detailsBookISBN.textContent =
        book.isbn || "—";


    detailsBookPublisher.textContent =
        book.publisher || "—";


    detailsBookYear.textContent =
        book.publication_year || "—";


    detailsBookGenre.textContent =
        book.genre || "—";


    detailsBookCategory.textContent =
        getCategoryName(
            book.category_id
        );


    detailsBookLocation.textContent =
        book.shelf_location || "—";


    detailsBookCopies.textContent =
        `${book.available_copies ?? 0} de ${book.total_copies ?? 0}`;


    detailsBookStatus.textContent =
        Number(book.available_copies) > 0
        ? "Disponível"
        : "Indisponível";


    detailsBookDescription.textContent =
        book.description ||
        "Nenhuma descrição informada.";


    /* CAPA */

    if (book.cover_url) {

        detailsBookCover.src =
            book.cover_url;

        detailsBookCover.alt =
            `Capa de ${book.title}`;

        detailsBookCover.style.display =
            "block";

        detailsBookCoverPlaceholder.style.display =
            "none";

    } else {

        detailsBookCover.src = "";

        detailsBookCover.style.display =
            "none";

        detailsBookCoverPlaceholder.style.display =
            "grid";

    }


    /* AÇÕES DO ADMIN */

    if (currentUserIsAdmin) {

        bookAdminActions.style.display =
            "flex";

    } else {

        bookAdminActions.style.display =
            "none";

    }


    bookDetailsModal.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   FECHAR MODAL DE DETALHES
========================================================= */

function closeBookDetailsModalFunction() {

    bookDetailsModal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "modal-open"
    );

    selectedBookId = null;

}


closeBookDetailsModal.addEventListener(
    "click",
    closeBookDetailsModalFunction
);


bookDetailsOverlay.addEventListener(
    "click",
    closeBookDetailsModalFunction
);


/* =========================================================
   EDITAR PELO MODAL DE DETALHES
========================================================= */

editBookButton.addEventListener(
    "click",
    () => {

        if (!selectedBookId) {
            return;
        }


        const bookId =
            selectedBookId;


        closeBookDetailsModalFunction();


        openEditBookModal(
            bookId
        );

    }
);


/* =========================================================
   EXCLUIR PELO MODAL DE DETALHES
========================================================= */

deleteBookButton.addEventListener(
    "click",
    () => {

        if (!selectedBookId) {
            return;
        }


        deleteBook(
            selectedBookId
        );

    }
);


/* =========================================================
   PAINEL LATERAL
========================================================= */

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
        data: {
            user
        }
    } = await db.auth.getUser();


    if (!user) {

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


        renderBooks(books);

        return;

    }


    const {
        data: profile,
        error
    } = await db
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        currentUserIsAdmin =
            false;

        renderBooks(books);

        return;

    }


    console.log(
        "PERFIL DO USUÁRIO:",
        profile
    );


    console.log(
        "ROLE:",
        profile.role
    );


    if (
        profile.role === "admin"
    ) {

        currentUserIsAdmin =
            true;

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


        renderBooks(books);

        return;

    }


    currentUserIsAdmin =
        false;

    loginPanel.style.display =
        "none";

    adminPanel.style.display =
        "none";

    sidePanelTitle.textContent =
        "Conta";

    loginButton.textContent =
        "Minha conta";


    renderBooks(books);

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        loginMessage.textContent =
            "Entrando...";


        const {
            data,
            error
        } =
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
   ABRIR MODAL DE CATALOGAÇÃO
========================================================= */

function openCatalogModal() {

    catalogModal.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   FECHAR MODAL DE CATALOGAÇÃO
========================================================= */

function closeCatalogModalFunction() {

    catalogModal.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   NOVO LIVRO
========================================================= */

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


        catalogMessage.textContent =
            "";


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
   EDITAR LIVRO
========================================================= */

function openEditBookModal(bookId) {

    const book =
        books.find(
            item =>
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
        book.category_id || "";


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
   SALVAR / EDITAR LIVRO
========================================================= */

catalogForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        catalogMessage.textContent =
            editingBookId
            ? "Salvando alterações..."
            : "Cadastrando livro...";


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
                .eq("id", user.id)
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
                document
                    .getElementById("bookTitle")
                    .value
                    .trim();


            const author =
                document
                    .getElementById("bookAuthor")
                    .value
                    .trim();


            const assetNumber =
                document
                    .getElementById("bookAssetNumber")
                    .value
                    .trim();


            const isbn =
                document
                    .getElementById("bookISBN")
                    .value
                    .trim();


            const publisher =
                document
                    .getElementById("bookPublisher")
                    .value
                    .trim();


            const year =
                document
                    .getElementById("bookYear")
                    .value;


            const genre =
                document
                    .getElementById("bookGenre")
                    .value
                    .trim();


            const categoryId =
                document
                    .getElementById("bookCategory")
                    .value;


            const location =
                document
                    .getElementById("bookLocation")
                    .value
                    .trim();


            const cover =
                document
                    .getElementById("bookCover")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("bookDescription")
                    .value
                    .trim();


            const copies =
                Number(
                    document
                        .getElementById("bookCopies")
                        .value
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

                category_id:
                    categoryId || null,

                description:
                    description || null,

                cover_url:
                    cover || null,

                shelf_location:
                    location || null,

                total_copies:
                    copies

            };


            /* =========================================
               EDITAR
            ========================================= */

            if (editingBookId) {

                const currentBook =
                    books.find(
                        item =>
                            String(item.id) ===
                            String(editingBookId)
                    );


                if (currentBook) {

                    bookData.available_copies =
                        Math.min(
                            Number(
                                currentBook.available_copies
                            ),
                            copies
                        );

                }


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

            }


            /* =========================================
               CADASTRAR
            ========================================= */

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
                    .insert(bookData)
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


/* =========================================================
   EXCLUIR LIVRO
========================================================= */

async function deleteBook(bookId) {

    const book =
        books.find(
            item =>
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
            .eq("id", user.id)
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


        closeBookDetailsModalFunction();


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
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    async () => {

        const {
            error
        } =
            await db.auth.signOut();


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


        renderBooks(books);

    }
);


/* =========================================================
   ESC
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
            bookDetailsModal.classList.contains(
                "active"
            )
        ) {

            closeBookDetailsModalFunction();

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
   INICIALIZAÇÃO
========================================================= */

async function initializeApp() {

    await loadCategories();

    await loadBooks();

    await checkUser();

}


initializeApp();