/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://frtgxcpyhvzwwvdmuhts.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_eCoQvkELqyJoLnhyBWqx6A_yCP7XGFp";

const {
    createClient
} = supabase;

const db =
    createClient(
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
   ELEMENTOS PRINCIPAIS
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

const loginSubmitButton =
    document.getElementById("loginSubmitButton");

/* =========================================================
   LEITOR DE ISBN
========================================================= */

const scanISBNButton =
    document.getElementById("scanISBNButton");

const isbnScannerModal =
    document.getElementById("isbnScannerModal");

const closeISBNScanner =
    document.getElementById("closeISBNScanner");

const cancelISBNScanner =
    document.getElementById("cancelISBNScanner");

const isbnScannerMessage =
    document.getElementById("isbnScannerMessage");


let isbnScannerInstance = null;

let isbnScannerRunning = false;


/* =========================================================
   ABRIR LEITOR
========================================================= */

async function openISBNScanner() {

    isbnScannerModal.classList.add(
        "active"
    );

    isbnScannerMessage.textContent =
        "Aponte a câmera para o código de barras...";


    isbnScannerInstance =
        new Html5Qrcode("isbnScanner");


    try {

        await isbnScannerInstance.start(

            {
                facingMode: "environment"
            },

            {

                fps: 10,

                qrbox: {
                    width: 280,
                    height: 120
                },

                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13
                ]

            },

            (decodedText) => {

                /* =========================================
                   ISBN ENCONTRADO
                ========================================= */

                const isbnInput =
                    document.getElementById(
                        "bookISBN"
                    );


                isbnInput.value =
                    decodedText;


                isbnScannerMessage.textContent =
                    "ISBN identificado!";


                stopISBNScanner();


                setTimeout(() => {

                    closeISBNScannerModal();

                }, 400);

            },

            () => {

                /*
                   Erros de leitura são ignorados.
                   O scanner continua procurando.
                */

            }

        );


        isbnScannerRunning = true;


    } catch (error) {

        console.error(
            "Erro ao iniciar câmera:",
            error
        );


        isbnScannerMessage.textContent =
            "Não foi possível acessar a câmera.";


        alert(
            "Não foi possível acessar a câmera. " +
            "Verifique se o navegador possui permissão para utilizá-la."
        );

    }

}


/* =========================================================
   PARAR LEITOR
========================================================= */

async function stopISBNScanner() {

    if (
        !isbnScannerInstance ||
        !isbnScannerRunning
    ) {
        return;
    }


    try {

        await isbnScannerInstance.stop();

        isbnScannerInstance.clear();

        isbnScannerRunning = false;

        isbnScannerInstance = null;

    } catch (error) {

        console.error(
            "Erro ao parar leitor:",
            error
        );

    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

async function closeISBNScannerModal() {

    await stopISBNScanner();

    isbnScannerModal.classList.remove(
        "active"
    );

}


/* =========================================================
   BOTÃO ABRIR
========================================================= */

scanISBNButton.addEventListener(
    "click",
    openISBNScanner
);


/* =========================================================
   BOTÕES FECHAR
========================================================= */

closeISBNScanner.addEventListener(
    "click",
    closeISBNScannerModal
);


cancelISBNScanner.addEventListener(
    "click",
    closeISBNScannerModal
);


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

isbnScannerModal
    .querySelector(".isbn-scanner-overlay")
    .addEventListener(
        "click",
        closeISBNScannerModal
    );


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            isbnScannerModal.classList.contains(
                "active"
            )
        ) {

            closeISBNScannerModal();

        }

    }
);

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
    document.querySelector(
        ".catalog-modal-overlay"
    );

const catalogForm =
    document.getElementById("catalogForm");

const catalogMessage =
    document.getElementById("catalogMessage");

const catalogSubmitButton =
    document.getElementById("catalogSubmitButton");

const bookCategory =
    document.getElementById("bookCategory");


/* =========================================================
   MODAL DE DETALHES
========================================================= */

const bookDetailsModal =
    document.getElementById(
        "bookDetailsModal"
    );

const bookDetailsOverlay =
    document.querySelector(
        ".book-details-overlay"
    );

const closeBookDetailsModal =
    document.getElementById(
        "closeBookDetailsModal"
    );

const detailsBookTitle =
    document.getElementById(
        "detailsBookTitle"
    );

const detailsBookCover =
    document.getElementById(
        "detailsBookCover"
    );

const detailsBookCoverPlaceholder =
    document.getElementById(
        "detailsBookCoverPlaceholder"
    );

const detailsBookAuthor =
    document.getElementById(
        "detailsBookAuthor"
    );

const detailsBookAssetNumber =
    document.getElementById(
        "detailsBookAssetNumber"
    );

const detailsBookISBN =
    document.getElementById(
        "detailsBookISBN"
    );

const detailsBookPublisher =
    document.getElementById(
        "detailsBookPublisher"
    );

const detailsBookYear =
    document.getElementById(
        "detailsBookYear"
    );

const detailsBookGenre =
    document.getElementById(
        "detailsBookGenre"
    );

const detailsBookCategory =
    document.getElementById(
        "detailsBookCategory"
    );

const detailsBookLocation =
    document.getElementById(
        "detailsBookLocation"
    );

const detailsBookCopies =
    document.getElementById(
        "detailsBookCopies"
    );

const detailsBookStatus =
    document.getElementById(
        "detailsBookStatus"
    );

const detailsBookDescription =
    document.getElementById(
        "detailsBookDescription"
    );

const bookAdminActions =
    document.getElementById(
        "bookAdminActions"
    );

const editBookButton =
    document.getElementById(
        "editBookButton"
    );

const deleteBookButton =
    document.getElementById(
        "deleteBookButton"
    );


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function normalizeText(value) {

    return String(value ?? "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


function setMessage(
    element,
    message = "",
    type = "normal"
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    if (type === "error") {

        element.style.color =
            "#a33";

    } else if (type === "success") {

        element.style.color =
            "#315c4c";

    } else {

        element.style.color =
            "";

    }

}


function getBookById(bookId) {

    return books.find(
        book =>
            String(book.id) ===
            String(bookId)
    );

}


function setModalState(
    modal,
    isOpen
) {

    if (!modal) {
        return;
    }

    modal.classList.toggle(
        "active",
        isOpen
    );

    modal.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );

}


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
            .order(
                "name",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        categories =
            data || [];


        bookCategory.innerHTML = "";


        const defaultOption =
            document.createElement(
                "option"
            );

        defaultOption.value = "";

        defaultOption.textContent =
            "Selecione uma categoria";

        bookCategory.appendChild(
            defaultOption
        );


        categories.forEach(
            category => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.id;

                option.textContent =
                    category.name;

                bookCategory.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Erro ao carregar categorias:",
            error
        );


        categories = [];


        bookCategory.innerHTML = "";


        const option =
            document.createElement(
                "option"
            );

        option.value = "";

        option.textContent =
            "Categorias indisponíveis";

        bookCategory.appendChild(
            option
        );

    }

}


/* =========================================================
   NOME DA CATEGORIA
========================================================= */

function getCategoryName(
    categoryId
) {

    if (
        categoryId === null ||
        categoryId === undefined ||
        categoryId === ""
    ) {

        return "Sem categoria";

    }


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
   CRIAR CAPA DO LIVRO
========================================================= */

function createBookCover(
    book
) {

    const cover =
        document.createElement(
            "div"
        );

    cover.className =
        "book-cover";


    if (book.cover_url) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            book.cover_url;

        image.alt =
            `Capa de ${
                book.title || "livro"
            }`;

        image.loading =
            "lazy";


        image.addEventListener(
            "error",
            () => {

                image.remove();

                cover.textContent =
                    "📖";

            }
        );


        cover.appendChild(
            image
        );


    } else {

        cover.textContent =
            "📖";

    }


    return cover;

}


/* =========================================================
   CRIAR CARD
========================================================= */

function createBookCard(
    book
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "book-card";

    card.dataset.id =
        book.id;

    card.tabIndex = 0;

    card.setAttribute(
        "role",
        "button"
    );

    card.setAttribute(
        "aria-label",
        `Ver detalhes de ${
            book.title || "livro"
        }`
    );


    /* CAPA */

    card.appendChild(
        createBookCover(book)
    );


    /* INFORMAÇÕES */

    const info =
        document.createElement(
            "div"
        );

    info.className =
        "book-info";


    const title =
        document.createElement(
            "h3"
        );

    title.textContent =
        book.title ||
        "Sem título";


    const author =
        document.createElement(
            "p"
        );

    author.className =
        "book-author";

    author.textContent =
        book.author ||
        "Autor desconhecido";


    const genre =
        document.createElement(
            "p"
        );

    genre.className =
        "book-genre";

    genre.textContent =
        book.genre ||
        "Sem gênero informado";


    const details =
        document.createElement(
            "div"
        );

    details.className =
        "book-details";


    if (
        book.publication_year
    ) {

        const year =
            document.createElement(
                "span"
            );

        year.textContent =
            book.publication_year;

        details.appendChild(
            year
        );

    }


    const availability =
        document.createElement(
            "span"
        );


    const available =
        Number(
            book.available_copies
        ) > 0;


    availability.textContent =
        available
            ? "Disponível"
            : "Indisponível";


    details.appendChild(
        availability
    );


    const copies =
        document.createElement(
            "p"
        );

    copies.className =
        "book-copies";

    copies.textContent =
        `${book.available_copies ?? 0} de ${
            book.total_copies ?? 0
        } exemplar(es) disponível(is)`;


    info.appendChild(title);

    info.appendChild(author);

    info.appendChild(genre);

    info.appendChild(details);

    info.appendChild(copies);


    /* =====================================================
       AÇÕES ADMIN
    ===================================================== */

    if (currentUserIsAdmin) {

        const actions =
            document.createElement(
                "div"
            );

        actions.className =
            "book-admin-actions";


        actions.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        const editButton =
            document.createElement(
                "button"
            );

        editButton.type =
            "button";

        editButton.className =
            "edit-book-button";

        editButton.dataset.id =
            book.id;

        editButton.textContent =
            "✏️ Editar";


        editButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openEditBookModal(
                    book.id
                );

            }
        );


        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-book-button";

        deleteButton.dataset.id =
            book.id;

        deleteButton.textContent =
            "🗑️ Excluir";


        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteBook(
                    book.id
                );

            }
        );


        actions.appendChild(
            editButton
        );

        actions.appendChild(
            deleteButton
        );

        info.appendChild(
            actions
        );

    }


    card.appendChild(
        info
    );


    /* =====================================================
       ABRIR DETALHES
    ===================================================== */

    function openDetails() {

        openBookDetailsModal(
            book.id
        );

    }


    card.addEventListener(
        "click",
        openDetails
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openDetails();

            }

        }
    );


    return card;

}


/* =========================================================
   RENDERIZAR LIVROS
========================================================= */

function renderBooks(
    list
) {

    bookGrid.innerHTML = "";


    if (!Array.isArray(list) || !list.length) {

        const message =
            document.createElement(
                "p"
            );

        message.textContent =
            "Nenhum livro encontrado.";

        bookGrid.appendChild(
            message
        );

        return;

    }


    const fragment =
        document.createDocumentFragment();


    list.forEach(
        book => {

            fragment.appendChild(
                createBookCard(book)
            );

        }
    );


    bookGrid.appendChild(
        fragment
    );

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
            .order(
                "title",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        books =
            data || [];


        searchBooks();


    } catch (error) {

        console.error(
            "Erro ao carregar livros:",
            error
        );


        bookGrid.innerHTML = "";


        const message =
            document.createElement(
                "p"
            );

        message.textContent =
            "Erro ao carregar o catálogo.";


        const details =
            document.createElement(
                "p"
            );

        details.textContent =
            error.message ||
            "Erro desconhecido.";


        bookGrid.appendChild(
            message
        );

        bookGrid.appendChild(
            details
        );

    }

}


/* =========================================================
   PESQUISA
========================================================= */

function searchBooks() {

    const query =
        normalizeText(
            searchInput.value
        );


    if (!query) {

        renderBooks(
            books
        );

        return;

    }


    const filteredBooks =
        books.filter(
            book => {

                const title =
                    normalizeText(
                        book.title
                    );

                const author =
                    normalizeText(
                        book.author
                    );

                const genre =
                    normalizeText(
                        book.genre
                    );

                const assetNumber =
                    normalizeText(
                        book.asset_number
                    );

                const category =
                    normalizeText(
                        getCategoryName(
                            book.category_id
                        )
                    );

                const isbn =
                    normalizeText(
                        book.isbn
                    );

                const publisher =
                    normalizeText(
                        book.publisher
                    );


                return (
                    title.includes(query) ||
                    author.includes(query) ||
                    genre.includes(query) ||
                    assetNumber.includes(query) ||
                    category.includes(query) ||
                    isbn.includes(query) ||
                    publisher.includes(query)
                );

            }
        );


    renderBooks(
        filteredBooks
    );

}


searchInput.addEventListener(
    "input",
    searchBooks
);


/* =========================================================
   MODAL DE DETALHES
========================================================= */

function openBookDetailsModal(
    bookId
) {

    const book =
        getBookById(
            bookId
        );


    if (!book) {
        return;
    }


    selectedBookId =
        book.id;


    detailsBookTitle.textContent =
        book.title ||
        "Sem título";


    detailsBookAuthor.textContent =
        book.author ||
        "—";


    detailsBookAssetNumber.textContent =
        book.asset_number ||
        "—";


    detailsBookISBN.textContent =
        book.isbn ||
        "—";


    detailsBookPublisher.textContent =
        book.publisher ||
        "—";


    detailsBookYear.textContent =
        book.publication_year ||
        "—";


    detailsBookGenre.textContent =
        book.genre ||
        "—";


    detailsBookCategory.textContent =
        getCategoryName(
            book.category_id
        );


    detailsBookLocation.textContent =
        book.shelf_location ||
        "—";


    detailsBookCopies.textContent =
        `${book.available_copies ?? 0} de ${
            book.total_copies ?? 0
        }`;


    const available =
        Number(
            book.available_copies
        ) > 0;


    detailsBookStatus.textContent =
        available
            ? "Disponível"
            : "Indisponível";


    detailsBookDescription.textContent =
        book.description ||
        "Nenhuma descrição informada.";


    /* =====================================================
       CAPA
    ===================================================== */

    if (book.cover_url) {

        detailsBookCover.src =
            book.cover_url;

        detailsBookCover.alt =
            `Capa de ${
                book.title || "livro"
            }`;

        detailsBookCover.style.display =
            "block";

        detailsBookCoverPlaceholder.style.display =
            "none";


        detailsBookCover.onerror =
            () => {

                detailsBookCover.onerror =
                    null;

                detailsBookCover.src =
                    "";

                detailsBookCover.style.display =
                    "none";

                detailsBookCoverPlaceholder.style.display =
                    "grid";

            };


    } else {

        detailsBookCover.src =
            "";

        detailsBookCover.style.display =
            "none";

        detailsBookCoverPlaceholder.style.display =
            "grid";

    }


    /* =====================================================
       AÇÕES ADMIN
    ===================================================== */

    bookAdminActions.style.display =
        currentUserIsAdmin
            ? "flex"
            : "none";


    setModalState(
        bookDetailsModal,
        true
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   FECHAR MODAL DE DETALHES
========================================================= */

function closeBookDetailsModalFunction() {

    setModalState(
        bookDetailsModal,
        false
    );


    document.body.classList.remove(
        "modal-open"
    );


    selectedBookId =
        null;

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

    sidePanel.classList.add(
        "active"
    );

    sidePanelOverlay.classList.add(
        "active"
    );


    sidePanel.setAttribute(
        "aria-hidden",
        "false"
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


    sidePanel.setAttribute(
        "aria-hidden",
        "true"
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
   ATUALIZAR INTERFACE DO USUÁRIO
========================================================= */

function setLoggedOutUI() {

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


    renderBooks(
        books
    );

}


function setAdminUI(
    profile
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


    renderBooks(
        books
    );

}


function setUserUI() {

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


    renderBooks(
        books
    );

}


/* =========================================================
   VERIFICAR USUÁRIO
========================================================= */

async function checkUser() {

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

            setLoggedOutUI();

            return;

        }


        const {
            data: profile,
            error: profileError
        } = await db
            .from("profiles")
            .select(
                "full_name, role"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


        if (profileError) {

            console.error(
                "Erro ao carregar perfil:",
                profileError
            );

            setUserUI();

            return;

        }


        if (
            profile &&
            profile.role === "admin"
        ) {

            setAdminUI(
                profile
            );

            return;

        }


        setUserUI();


    } catch (error) {

        console.error(
            "Erro ao verificar usuário:",
            error
        );

        setLoggedOutUI();

    }

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "loginPassword"
                )
                .value;


        if (!email || !password) {

            setMessage(
                loginMessage,
                "Preencha o e-mail e a senha.",
                "error"
            );

            return;

        }


        loginSubmitButton.disabled =
            true;

        loginSubmitButton.textContent =
            "Entrando...";


        setMessage(
            loginMessage,
            "Entrando..."
        );


        try {

            const {
                data,
                error
            } =
                await db.auth
                    .signInWithPassword({

                        email,
                        password

                    });


            if (error) {
                throw error;
            }


            if (!data.user) {

                throw new Error(
                    "Não foi possível identificar o usuário."
                );

            }


            await checkUser();


            setMessage(
                loginMessage,
                "Login realizado com sucesso!",
                "success"
            );


            setTimeout(
                () => {

                    loginMessage.textContent =
                        "";

                    closeSidePanelFunction();

                },
                700
            );


        } catch (error) {

            console.error(
                "Erro no login:",
                error
            );


            setMessage(
                loginMessage,
                "E-mail ou senha incorretos.",
                "error"
            );

        } finally {

            loginSubmitButton.disabled =
                false;

            loginSubmitButton.textContent =
                "Entrar";

        }

    }
);


/* =========================================================
   ABRIR MODAL DE CATALOGAÇÃO
========================================================= */

function openCatalogModal() {

    setModalState(
        catalogModal,
        true
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   FECHAR MODAL DE CATALOGAÇÃO
========================================================= */

function closeCatalogModalFunction() {

    setModalState(
        catalogModal,
        false
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

        if (!currentUserIsAdmin) {

            alert(
                "Apenas administradores podem catalogar livros."
            );

            return;

        }


        editingBookId =
            null;


        document.getElementById(
            "catalogModalTitle"
        ).textContent =
            "Cadastrar livro";


        catalogForm.reset();


        document.getElementById(
            "bookCopies"
        ).value =
            "1";


        setMessage(
            catalogMessage
        );


        catalogSubmitButton.textContent =
            "Cadastrar livro";


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

function openEditBookModal(
    bookId
) {

    if (!currentUserIsAdmin) {

        alert(
            "Apenas administradores podem editar livros."
        );

        return;

    }


    const book =
        getBookById(
            bookId
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


    setMessage(
        catalogMessage
    );


    catalogSubmitButton.textContent =
        "Salvar alterações";


    openCatalogModal();

}


/* =========================================================
   VALIDAR FORMULÁRIO
========================================================= */

function getCatalogFormData() {

    const title =
        document
            .getElementById(
                "bookTitle"
            )
            .value
            .trim();


    const author =
        document
            .getElementById(
                "bookAuthor"
            )
            .value
            .trim();


    const assetNumber =
        document
            .getElementById(
                "bookAssetNumber"
            )
            .value
            .trim();


    const isbn =
        document
            .getElementById(
                "bookISBN"
            )
            .value
            .trim();


    const publisher =
        document
            .getElementById(
                "bookPublisher"
            )
            .value
            .trim();


    const year =
        document
            .getElementById(
                "bookYear"
            )
            .value;


    const genre =
        document
            .getElementById(
                "bookGenre"
            )
            .value
            .trim();


    const categoryId =
        document
            .getElementById(
                "bookCategory"
            )
            .value;


    const location =
        document
            .getElementById(
                "bookLocation"
            )
            .value
            .trim();


    const cover =
        document
            .getElementById(
                "bookCover"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "bookDescription"
            )
            .value
            .trim();


    const copies =
        Number(
            document
                .getElementById(
                    "bookCopies"
                )
                .value
        );


    if (!title) {

        throw new Error(
            "O título é obrigatório."
        );

    }


    if (!author) {

        throw new Error(
            "O autor é obrigatório."
        );

    }


    if (!assetNumber) {

        throw new Error(
            "O tombo é obrigatório."
        );

    }


    if (
        !Number.isInteger(copies) ||
        copies < 1
    ) {

        throw new Error(
            "A quantidade de exemplares deve ser pelo menos 1."
        );

    }


    let publicationYear =
        null;


    if (year !== "") {

        publicationYear =
            Number(year);


        if (
            !Number.isInteger(
                publicationYear
            ) ||
            publicationYear < 0 ||
            publicationYear > 2100
        ) {

            throw new Error(
                "Informe um ano de publicação válido."
            );

        }

    }


    return {

        title,

        author,

        asset_number:
            assetNumber,

        isbn:
            isbn || null,

        publisher:
            publisher || null,

        publication_year:
            publicationYear,

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

}


/* =========================================================
   SALVAR / EDITAR LIVRO
========================================================= */

catalogForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentUserIsAdmin) {

            setMessage(
                catalogMessage,
                "Você não possui permissão de administrador.",
                "error"
            );

            return;

        }


        const isEditing =
            Boolean(
                editingBookId
            );


        catalogSubmitButton.disabled =
            true;


        catalogSubmitButton.textContent =
            isEditing
                ? "Salvando..."
                : "Cadastrando...";


        setMessage(
            catalogMessage,
            isEditing
                ? "Salvando alterações..."
                : "Cadastrando livro..."
        );


        try {

            /* =================================================
               USUÁRIO
            ================================================= */

            const {
                data: {
                    user
                },
                error: userError
            } =
                await db.auth.getUser();


            if (userError) {
                throw userError;
            }


            if (!user) {

                throw new Error(
                    "Nenhum usuário está autenticado."
                );

            }


            /* =================================================
               PERFIL
            ================================================= */

            const {
                data: profile,
                error: profileError
            } =
                await db
                    .from("profiles")
                    .select("role")
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


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


            /* =================================================
               DADOS
            ================================================= */

            const bookData =
                getCatalogFormData();


            /* =================================================
               EDITAR
            ================================================= */

            if (isEditing) {

                const currentBook =
                    getBookById(
                        editingBookId
                    );


                if (!currentBook) {

                    throw new Error(
                        "Livro não encontrado."
                    );

                }


                /*
                 * Mantém a quantidade de exemplares
                 * atualmente disponíveis sem permitir
                 * que ela ultrapasse o novo total.
                 */

                bookData.available_copies =
                    Math.min(
                        Number(
                            currentBook.available_copies ?? 0
                        ),
                        bookData.total_copies
                    );


                const {
                    data,
                    error
                } =
                    await db
                        .from("books")
                        .update(
                            bookData
                        )
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


                setMessage(
                    catalogMessage,
                    "Livro atualizado com sucesso!",
                    "success"
                );

            }


            /* =================================================
               CADASTRAR
            ================================================= */

            else {

                bookData.available_copies =
                    bookData.total_copies;


                bookData.status =
                    "available";


                const {
                    data,
                    error
                } =
                    await db
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


                setMessage(
                    catalogMessage,
                    "Livro cadastrado com sucesso!",
                    "success"
                );

            }


            await loadBooks();


            setTimeout(
                () => {

                    closeCatalogModalFunction();


                    catalogForm.reset();


                    document.getElementById(
                        "bookCopies"
                    ).value =
                        "1";


                    editingBookId =
                        null;


                    catalogSubmitButton.textContent =
                        "Cadastrar livro";

                },
                900
            );


        } catch (error) {

            console.error(
                "Erro ao salvar livro:",
                error
            );


            setMessage(
                catalogMessage,
                error.message ||
                "Não foi possível salvar o livro.",
                "error"
            );

        } finally {

            catalogSubmitButton.disabled =
                false;


            if (!editingBookId) {

                catalogSubmitButton.textContent =
                    "Cadastrar livro";

            } else {

                catalogSubmitButton.textContent =
                    "Salvar alterações";

            }

        }

    }
);


/* =========================================================
   EXCLUIR LIVRO
========================================================= */

async function deleteBook(
    bookId
) {

    if (!currentUserIsAdmin) {

        alert(
            "Apenas administradores podem excluir livros."
        );

        return;

    }


    const book =
        getBookById(
            bookId
        );


    if (!book) {

        alert(
            "Livro não encontrado."
        );

        return;

    }


    const confirmed =
        window.confirm(
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
        } =
            await db.auth.getUser();


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
        } =
            await db
                .from("profiles")
                .select("role")
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


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
        } =
            await db
                .from("books")
                .delete()
                .eq(
                    "id",
                    bookId
                );


        if (error) {
            throw error;
        }


        if (
            selectedBookId &&
            String(selectedBookId) ===
            String(bookId)
        ) {

            closeBookDetailsModalFunction();

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
            (
                error.message ||
                "Erro desconhecido."
            )
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    async () => {

        logoutButton.disabled =
            true;


        logoutButton.textContent =
            "Saindo...";


        try {

            const {
                error
            } =
                await db.auth.signOut();


            if (error) {
                throw error;
            }


            setLoggedOutUI();


            document.getElementById(
                "loginEmail"
            ).value =
                "";


            document.getElementById(
                "loginPassword"
            ).value =
                "";


            setMessage(
                loginMessage
            );


            closeSidePanelFunction();


        } catch (error) {

            console.error(
                "Erro ao sair:",
                error
            );


            alert(
                "Não foi possível sair da conta.\n\n" +
                (
                    error.message ||
                    "Erro desconhecido."
                )
            );

        } finally {

            logoutButton.disabled =
                false;

            logoutButton.textContent =
                "Sair da conta";

        }

    }
);


/* =========================================================
   ALTERAÇÕES DE AUTENTICAÇÃO
========================================================= */

db.auth.onAuthStateChange(
    async () => {

        await checkUser();

    }
);


/* =========================================================
   ESC — FECHAR ELEMENTOS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

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

    try {

        await loadCategories();

        await loadBooks();

        await checkUser();


    } catch (error) {

        console.error(
            "Erro durante a inicialização:",
            error
        );

    }

}


initializeApp();