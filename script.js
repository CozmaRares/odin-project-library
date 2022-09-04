let books = {},
  maxID,
  sortBy = "title";

function loadBooks(booksData) {
  booksData.forEach(book => {
    const newBook = { ...book }; // copy the book data
    delete newBook.status;

    if (books[book.status] === undefined) books[book.status] = [newBook];
    else books[book.status].push(newBook);
  });

  maxID = booksData.length;

  displayAllBooks();
}

fetch("./books.json")
  .then(response => {
    if (response.ok) return response.json();
  })
  .then(loadBooks);

function filterBooks(headerLI) {
  const statusClass = headerLI.className
      .replace("selected", "")
      .replaceAll(" ", ""),
    status = statusClass.replaceAll("-", " ");

  [...document.querySelectorAll("header li")].forEach(li =>
    li.classList.remove("selected")
  );

  headerLI.classList.toggle("selected");

  refreshGrid();
  if (statusClass === "") return displayAllBooks();

  displayBooksByStatus(status, statusClass);
}

const initialGridHTML = document.querySelector(".grid").innerHTML;

function refreshGrid() {
  document.querySelector(".grid").innerHTML = initialGridHTML;
}

function fillGrid(booksArr, status, statusClass, idx) {
  booksArr = sortBooks(booksArr);

  const grid = document.querySelector(".grid");

  booksArr.forEach(({ id, title, author, pages }) => {
    grid.insertAdjacentHTML(
      "beforeend",
      `
      <div class="line ${statusClass}"></div>
      <div class="index">${idx++}</div>
      <div>${title}</div>
      <div>${author}</div>
      <div class="pages">
        ${pages}
        <div class="edit" onclick="openEditModal(${id}, '${status}')">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
          </svg>
        </div>
      </div>
      `
    );
  });

  return idx;
}

function displayAllBooks() {
  document.querySelector(".title").innerText = "All Books";

  const statusOrder = [
    "currently reading",
    "completed",
    "on hold",
    "dropped",
    "plan to read"
  ];

  let idx = 1;

  statusOrder.forEach(status => {
    const statusClass = status.split(" ").join("-");
    idx = fillGrid(books[status], status, statusClass, idx);
  });
}

function displayBooksByStatus(status, statusClass) {
  document.querySelector(".title").innerText = status;
  fillGrid(books[status], status, statusClass, 1);
}

function openEditModal(bookID, bookStatus) {
  const { title, author, pages } = books[bookStatus].find(
    book => book.id === bookID
  );

  document.getElementById("title").value = title;
  document.getElementById("author").value = author;
  document.getElementById("pages").value = pages;
  document.getElementById("status").value = bookStatus;

  document.querySelector(".overlay form").onsubmit = event => {
    removeBook(bookID, bookStatus);
    addBook(event);
  };
  document.getElementById("delete-btn").style.display = "block";
  document.getElementById("delete-btn").onclick = () => {
    removeBook(bookID, bookStatus);
    closeOverlay();
  };

  toggleOverlay();
}

function openAddModal() {
  document.querySelector(".overlay form").onsubmit = addBook;
  document.getElementById("delete-btn").style.display = "none";

  toggleOverlay();
}

function toggleOverlay() {
  document.querySelector(".overlay").classList.toggle("active");
}

function addBook(event) {
  event.preventDefault();

  const title = event.target.title.value,
    author = event.target.author.value,
    pages = event.target.pages.value,
    status = event.target.status.value;

  const book = { title, author, pages, id: ++maxID };

  books[status].push(book);

  closeOverlay();
}

function closeOverlay() {
  refreshList();

  toggleOverlay();

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("status").value =
    document.querySelector("#status option").value;
}

function removeBook(bookID, bookStatus) {
  books[bookStatus] = books[bookStatus].filter(book => {
    return book.id !== bookID;
  });
}

function refreshList() {
  document.querySelector("header li.selected").click();
}

function sortBooks(bookArr) {
  return [...bookArr].sort((book1, book2) => {
    const prop1 = book1[sortBy].toLowerCase(),
      prop2 = book2[sortBy].toLowerCase();

    if (prop1 < prop2) return -1;

    if (prop1 > prop2) return 1;

    return 0;
  });
}

function setSortProperty(prop) {
  console.log(prop);
  sortBy = prop.toLowerCase();
  refreshList();
}
