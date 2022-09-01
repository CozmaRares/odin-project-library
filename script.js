let books = {};

function loadBooks(booksData) {
  booksData.forEach(book => {
    // debugger;

    const newBook = { ...book }; // copy the book data
    delete newBook.status;

    if (books[book.status] === undefined) books[book.status] = [newBook];
    else books[book.status].push(newBook);
  });

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

function refreshGrid() {
  document.querySelector(".grid").innerHTML = `
    <div class="line"></div>
    <div class="index">#</div>
    <div class="border-l">Title</div>
    <div class="border-l">Author</div>
    <div class="pages border-l">Pages</div>
  `;
}

function displayAllBooks() {
  document.querySelector(".title").innerText = "All Books";

  const grid = document.querySelector(".grid");

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

    books[status].forEach(({ title, author, pages }) => {
      grid.insertAdjacentHTML(
        "beforeend",
        `<div class="line ${statusClass}"></div>`
      );
      grid.insertAdjacentHTML("beforeend", `<div class="index">${idx++}</div>`);
      grid.insertAdjacentHTML("beforeend", `<div>${title}</div>`);
      grid.insertAdjacentHTML("beforeend", `<div>${author}</div>`);
      grid.insertAdjacentHTML("beforeend", `<div class="pages">${pages}</div>`);
    });
  });
}

function displayBooksByStatus(status, statusClass) {
  document.querySelector(".title").innerText = status;

  const grid = document.querySelector(".grid");

  let idx = 1;

  debugger;
  books[status].forEach(({ title, author, pages }) => {
    grid.insertAdjacentHTML(
      "beforeend",
      `<div class="line ${statusClass}"></div>`
    );
    grid.insertAdjacentHTML("beforeend", `<div class="index">${idx++}</div>`);
    grid.insertAdjacentHTML("beforeend", `<div>${title}</div>`);
    grid.insertAdjacentHTML("beforeend", `<div>${author}</div>`);
    grid.insertAdjacentHTML("beforeend", `<div class="pages">${pages}</div>`);
  });
}
