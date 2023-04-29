// --------------------
// localStorage Functions
function saveToLocalStorage() {
  // console.log("[DEBUG] LocalStorage() SAVING!")
  const bucketsData = [];
  document.querySelectorAll(".bucket").forEach((bucket, index) => {
      const cards = Array.from(bucket.querySelectorAll(".card"));
      const cardsData = cards.map(card => {
          return {
              label: card.querySelector("input[type='text']").value,
              body: card.querySelector(".card-body").outerHTML
          };
      });
      bucketsData[index] = cardsData;
  });
  localStorage.setItem("eisenhowerMatrix", JSON.stringify(bucketsData));
}

function loadFromLocalStorage() {
  // console.log("[DEBUG] LocalStorage() LOADING!")

  const bucketsData = JSON.parse(localStorage.getItem("eisenhowerMatrix"));
  if (bucketsData) {
      bucketsData.forEach((bucketData, index) => {
          const bucket = document.querySelectorAll(".bucket")[index];
          const container = bucket.querySelector(".container");
          bucketData.forEach(cardData => {
              const card = createCard();
              card.querySelector("input[type='text']").value = cardData.label;
              card.querySelector(".card-body").outerHTML = cardData.body;
              container.appendChild(card);
              updateCardCount(bucket, 1);
          });
      });
  }
}

function resetLocalStorage() {
  // console.log("[DEBUG] LocalStorage() RESETTING!")

  localStorage.removeItem("eisenhowerMatrix");
  location.reload();
}

//==============================================================================================================
// --------------------
// Card and Bucket Functions
document.querySelectorAll(".move-left").forEach(moveLeft => {
  moveLeft.addEventListener("click", (e) => {
    const bucket = e.target.closest(".bucket");
    const prevBucket = bucket.previousElementSibling;
    if (prevBucket) {
      bucket.parentElement.insertBefore(bucket, prevBucket);
      saveToLocalStorage();
    }
  });
});

document.querySelectorAll(".move-right").forEach(moveRight => {
  moveRight.addEventListener("click", (e) => {
    const bucket = e.target.closest(".bucket");
    const nextBucket = bucket.nextElementSibling;
    if (nextBucket) {
      bucket.parentElement.insertBefore(nextBucket, bucket);
      saveToLocalStorage();
    }
  });
});

document.querySelectorAll(".plus").forEach(plus => {
  plus.addEventListener("click", (e) => {
      const bucket = e.target.parentElement;
      const container = bucket.querySelector(".container");
      const card = createCard();
      container.appendChild(card);
      updateCardCount(bucket, 1);
      saveToLocalStorage();
  });
});

function createCard() {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("draggable", "true");

  const cardLabelInput = document.createElement("input");
  cardLabelInput.addEventListener("input", saveToLocalStorage);
  cardLabelInput.type = "text";
  cardLabelInput.placeholder = "Label...";
  card.appendChild(cardLabelInput);

  const minus = document.createElement("span");
  minus.textContent = "-";
  minus.className = "minus";
  minus.addEventListener("click", () => {
      const bucket = card.parentElement.parentElement;
      card.remove();
      updateCardCount(bucket, -1);
  });

  card.appendChild(minus);

  const viewAsHtmlIcon = document.createElement("i");
  viewAsHtmlIcon.className = "fas fa-eye view-as-html";
  viewAsHtmlIcon.style.marginLeft = "0.5rem";
  card.appendChild(viewAsHtmlIcon);

  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  editIcon.style.display = "none";
  editIcon.style.marginLeft = "0.5rem";
  card.appendChild(editIcon);

  let cardBody = document.createElement("textarea");
  cardBody.className = "card-body";
  cardBody.placeholder = "Enter description...";
  
  card.appendChild(cardBody);

  viewAsHtmlIcon.addEventListener("click", () => {
      if (cardBody.tagName === "TEXTAREA") {
          const sanitizedHtml = sanitizeHTML(cardBody.value);
          const renderedHtml = document.createElement("div");
          renderedHtml.className = "card-body";
          renderedHtml.innerHTML = sanitizedHtml;
          card.replaceChild(renderedHtml, cardBody);
          cardBody = renderedHtml;
          viewAsHtmlIcon.style.display = "none";
          editIcon.style.display = "inline";

      } else {
          const textarea = document.createElement("textarea");
          textarea.className = "card-body";
          textarea.placeholder = "Enter description...";
          textarea.innerHTML = cardBody.innerHTML;
          card.replaceChild(textarea, cardBody);
          cardBody = textarea;

          viewAsHtmlIcon.style.display = "inline";
          editIcon.style.display = "none";
      }
  });


  editIcon.addEventListener("click", () => {
      if (cardBody.tagName === "DIV") {
          const textarea = document.createElement("textarea");
          textarea.className = "card-body";
          textarea.placeholder = "Enter description...";
          textarea.value = cardBody.innerHTML; // Change this line
          card.replaceChild(textarea, cardBody);
          cardBody = textarea;

          viewAsHtmlIcon.style.display = "inline";
          editIcon.style.display = "none";

      } else {
          const newCardBody = document.createElement("div");
          newCardBody.className = "card-body";
          newCardBody.innerHTML = cardBody.value;
          if (card.contains(cardBody)) {
              card.replaceChild(newCardBody, cardBody);
          } else {
              card.appendChild(newCardBody);
          }
          cardBody = newCardBody;
          viewAsHtmlIcon.style.display = "inline";
          editIcon.style.display = "none";
      }
  });
  
  return card;
}

function updateCardCount(bucket, change) {
  const counter = bucket.querySelector(".counter");
  const newCount = parseInt(counter.textContent, 10) + change;
  counter.textContent = newCount;
}

function sanitizeHTML(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const tagsToKeep = ['b', 'u', 'i', 'strike', 'ul', 'li'];
  const tags = temp.getElementsByTagName("*");

  for (let i = tags.length - 1; i >= 0; i--) {
      const tag = tags[i];
      if (tagsToKeep.indexOf(tag.tagName.toLowerCase()) === -1) {
          tag.outerHTML = tag.innerHTML;
      }
  }
  return temp.innerHTML;
}

document.querySelectorAll(".bucket").forEach(bucket => {
  bucket.addEventListener("dragover", (e) => {
      e.preventDefault();
  });

  // Update the 'drop' event listener to update the card counts
  bucket.addEventListener("drop", (e) => {
      e.preventDefault();
      const cardId = e.dataTransfer.getData("text");
      const card = document.getElementById(cardId);
      const container = bucket.querySelector(".container");
                  
      if (card) {
          const oldBucket = card.parentElement.parentElement;
          container.appendChild(card);
          updateCardCount(oldBucket, -1); // Decrease the card count in the old bucket by 1
          updateCardCount(bucket, 1); // Increase the card count in the new bucket by 1
      } else {
          const draggedCard = document.querySelector('.dragging');
          if (draggedCard) {
              const oldBucket = draggedCard.parentElement.parentElement;
              container.appendChild(draggedCard);
              updateCardCount(oldBucket, -1); // Decrease the card count in the old bucket by 1
              updateCardCount(bucket, 1); // Increase the card count in the new bucket by 1
          }
      }
  });


  bucket.addEventListener("dragenter", (e) => {
      e.preventDefault();
  });
});
//==============================================================================================================
// Touch Events for Mouse-based events
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("card")) {
      e.target.classList.add("dragging");
      e.dataTransfer.setData("text", e.target.id);
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("card")) {
      e.target.classList.remove("dragging");
  }
  saveToLocalStorage();
});

// --------------------
// Touch Events for Mobile/Touchscreen Devices

let draggedCard = null;
let StartingBucket = null;


document.addEventListener("touchstart", (e) => {
if (e.target.classList.contains("card")) {
  draggedCard = e.target;
  StartingBucket = draggedCard.parentElement.parentElement;
}
});

document.addEventListener("touchmove", (e) => {
if (draggedCard) {
  e.preventDefault();
  draggedCard.style.position = "absolute";
  draggedCard.style.left = e.touches[0].clientX + "px";
  draggedCard.style.top = e.touches[0].clientY + "px";
}
});

document.addEventListener("touchend", (e) => {
  if (draggedCard) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const bucket = document.elementFromPoint(touchX, touchY).closest(".bucket");
    if (bucket) {
      const container = bucket.querySelector(".container");
      container.appendChild(draggedCard);
      const newBucket = draggedCard.parentElement.parentElement;
      updateCardCount(StartingBucket, -1);
      updateCardCount(newBucket, 1);
    }
    draggedCard.style.position = "";
    draggedCard.style.left = "";
    draggedCard.style.top = "";
    draggedCard = null;
    saveToLocalStorage();
  }
});


function findBucket(x, y) {
const buckets = document.querySelectorAll(".bucket");
for (let i = 0; i < buckets.length; i++) {
  const rect = buckets[i].getBoundingClientRect();
  if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    return buckets[i];
  }
}
return null;
}



loadFromLocalStorage();

// Export function
function exportMatrix() {
  const bucketsData = JSON.parse(localStorage.getItem("eisenhowerMatrix")) || [];
  const dataStr = JSON.stringify(bucketsData);
  const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
  const dataUrl = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'eisenhower_matrix.json';
  link.click();
}

// Import function
function importMatrix(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
      const contents = e.target.result;
      try {
          const parsedData = JSON.parse(contents);
          localStorage.setItem("eisenhowerMatrix", JSON.stringify(parsedData));
          location.reload();
      } catch (e) {
          alert('Invalid JSON file!');
      }
  };
  reader.readAsText(file);
}
