// Month names array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// DOM elements
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle = document.querySelector("header p");
let submitBtn = document.querySelector("#submit-btn");

// Retrieve notes from localStorage or initialize with an empty array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Variables for update operation
let isUpdate = false;
let updateId = null;

// Load notes when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  renderNotes(notes);
});

// Show popup on "addBox" click
addBox.addEventListener("click", () => {
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  document.body.style.overflow = "hidden";
});

// Close popup on close button click
closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.body.style.overflow = "auto";

  isUpdate = false;
  updateId = null;
  popupTitle.textContent = "New Note";
  submitBtn.textContent = "Add Note";
  form.reset();
});

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = e.target[0];
  const descriptionInput = e.target[1];
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  if (!title && !description) {
    alert("Please fill in the required fields.");
    return;
  }

  const date = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const id = date.getTime();

  if (isUpdate) {
    const findIndex = notes.findIndex((note) => note.id == updateId);
    notes[findIndex] = {
      title,
      description,
      id,
      date: `${month} ${day}, ${year}`,
    };
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    const noteInfo = {
      id,
      title,
      description,
      date: `${month} ${day}, ${year}`,
    };
    notes.push(noteInfo);
  }

  localStorage.setItem("notes", JSON.stringify(notes));
  form.reset();
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.body.style.overflow = "auto";
  renderNotes(notes);
});

// Render notes on the UI
function renderNotes(notes) {
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((note) => {
    let noteElement = `
      <li class="note" data-id='${note.id}'>
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">${note.description}</p>
        </div>
        <div class="bottom">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='editIcon'><i class="bx bx-edit"></i> Edit</li>
              <li class='deleteIcon'><i class="bx bx-trash-alt"></i> Delete</li>
            </ul>
          </div>
        </div>
      </li>`;
    addBox.insertAdjacentHTML("afterend", noteElement);
  });
}

// Toggle visibility of settings menu
function showMenu(element) {
  element.parentElement.classList.add("show");

  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target !== element) {
      element.parentElement.classList.remove("show");
    }
  });
}

// Handle clicks inside the wrapper (edit, delete, settings)
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("deleteIcon")) {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      const note = e.target.closest(".note");
      const noteId = parseInt(note.dataset.id);
      notes = notes.filter((note) => note.id !== noteId);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes(notes);
    }
  } else if (e.target.classList.contains("editIcon")) {
    const note = e.target.closest(".note");
    const noteId = parseInt(note.dataset.id);
    const selectedNote = notes.find((note) => note.id === noteId);

    isUpdate = true;
    updateId = noteId;

    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    form[0].value = selectedNote.title;
    form[1].value = selectedNote.description;

    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});
