let books = {},
  maxID;

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

function refreshGrid() {
  document.querySelector(".grid").innerHTML = `
    <div class="line"></div>
    <div class="index">#</div>
    <div class="border-l">Title</div>
    <div class="border-l">Author</div>
    <div class="pages border-l">Pages</div>
  `;
}

function fillGrid(booksArr, status, statusClass, idx) {
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
        <div class="edit" onclick="edit(${id}, '${status}')">
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

function edit(bookID, bookStatus) {
  console.log(books[bookStatus].find(({ id }) => id === bookID));
}

function toggleOverlay() {
  document.querySelector(".overlay").classList.toggle("active");
}

document.querySelector(".overlay form").onsubmit = event => {
  event.preventDefault();
  console.log();
  console.log();
  console.log();
  console.log();

  const title = event.target.title.value,
    author = event.target.author.value,
    pages = event.target.pages.value,
    status = event.target.status.value;

  const book = { title, author, pages, id: ++maxID };

  books[status].push(book);

  // refresh grid
  document.querySelector("header li.selected").click();

  toggleOverlay();

  event.target.title.value = "";
  event.target.author.value = "";
  event.target.pages.value = "";
  event.target.status.value = document.querySelector('.overlay form select option:first-child').innerText;
};
