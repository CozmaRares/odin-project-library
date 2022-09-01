let books = {};

function loadBooks(booksData) {
  booksData.forEach(book => {
    // debugger;

    const newBook = { ...book }; // copy the book data
    delete newBook.status;

    if (books[book.status] === undefined) books[book.status] = [newBook];
    else books[book.status].push(newBook);
  });

  const grid = document.querySelector(".grid");

  const statusOrder = ["cr", "c", "oh", "d", "ptr"];

  let idx = 1;

  statusOrder.forEach(status => {
    books[status]
      .sort((a, b) => {
        let ta = a.title.toLowerCase(),
          tb = b.title.toLowerCase();

        if (ta < tb) {
          return -1;
        }
        if (ta > tb) {
          return 1;
        }
        return 0;
      })
      .forEach(({ title, author, pages }) => {
        grid.insertAdjacentHTML(
          "beforeend",
          `<div class="line ${status}"></div>`
        );
        grid.insertAdjacentHTML(
          "beforeend",
          `<div class="index">${idx++}</div>`
        );
        grid.insertAdjacentHTML("beforeend", `<div>${title}</div>`);
        grid.insertAdjacentHTML("beforeend", `<div>${author}</div>`);
        grid.insertAdjacentHTML("beforeend", `<div>${pages}</div>`);
      });
  });
}

fetch("./books.json")
  .then(response => {
    if (response.ok) return response.json();
  })
  .then(loadBooks);
