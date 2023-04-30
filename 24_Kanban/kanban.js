// --------------------
// Board Title Functions
function makeBoardTitleEditable() {
  const title = document.getElementById("boardTitle");
  title.addEventListener("click", (e) => {
    const target = e.target;
    const input = document.createElement("input");
    input.type = "text";
    input.value = target.textContent;
    input.id = "boardTitle";
    input.className = "board-title";
    input.style.width = "100%";
    target.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      target.textContent = input.value;
      input.replaceWith(target);
      localStorage.setItem("boardTitle", target.textContent);
    });
  });
}

// Load the board title from LocalStorage during initialization
function loadBoardTitleFromLocalStorage() {
  const savedTitle = localStorage.getItem("boardTitle");
  if (savedTitle) {
    const titleElement = document.getElementById("boardTitle");
    titleElement.textContent = savedTitle;
  }
}

// --------------------
// localStorage Functions
function saveToLocalStorage() {
  const bucketsData = [];
  document.querySelectorAll(".bucket").forEach((bucket, index) => {
    const cards = Array.from(bucket.querySelectorAll(".card"));
    const cardsData = cards.map(card => {
      return {
        label: card.querySelector("input[type='text']").value,
        body: card.querySelector(".card-body").outerHTML
      };
    });
    const titleElement = bucket.querySelector(".title");
    const title = titleElement.tagName === "INPUT" ? titleElement.value : titleElement.textContent;
    bucketsData[index] = {
      title: title,
      cards: cardsData
    };
  });
  localStorage.setItem("kanbanBoard", JSON.stringify(bucketsData));
}


function loadFromLocalStorage() {
  document.querySelectorAll(".bucket").forEach(bucket => bucket.remove());

  const bucketsData = JSON.parse(localStorage.getItem("kanbanBoard"));
  if (bucketsData) {
    bucketsData.forEach((bucketData, index) => {
      let bucket = document.querySelectorAll(".bucket")[index];
      if (!bucket) {
        createBucket(bucketData.title);
        bucket = document.querySelectorAll(".bucket")[index];
      }
      const container = bucket.querySelector(".container");
      const title = bucket.querySelector(".title");
      title.textContent = bucketData.title;
      makeBucketTitleEditable(title); // Add this line
      bucketData.cards.forEach(cardData => {
        const card = createCard();
        card.querySelector("input[type='text']").value = cardData.label;

        const cardBody = card.querySelector(".card-body");
        if (cardData.body.includes("textarea")) {
          // Card body data was created with a textarea, switch to edit view
          const textarea = document.createElement("textarea");
          textarea.className = "card-body";
          textarea.placeholder = "Enter description...";
          textarea.value = cardData.body.match(/<textarea(.|\n)*<\/textarea>/g)[0];
          card.replaceChild(textarea, cardBody);
          cardBody.remove();
          cardBody = textarea;

          const viewAsHtmlIcon = card.querySelector(".view-as-html");
          const editIcon = card.querySelector(".edit");
          const lockIcon = card.querySelector(".lock");

          viewAsHtmlIcon.style.display = "none";
          editIcon.style.display = "inline";

          lockIcon.addEventListener("click", () => {
            if (cardBody.classList.contains("locked")) {
              cardBody.classList.remove("locked");
              lockIcon.classList.remove("fa-lock");
              lockIcon.classList.add("fa-unlock");
              card.classList.remove("disable-hover"); // Remove disable-hover class
            } else {
              cardBody.classList.add("locked");
              lockIcon.classList.remove("fa-unlock");
              lockIcon.classList.add("fa-lock");
              card.classList.add("disable-hover"); // Add disable-hover class
            }
          });

          editIcon.addEventListener("click", () => {
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

            // Remove event listener added to textarea when editing
            cardBody.removeEventListener("input", saveToLocalStorage);
          });

        } else {
          cardBody.innerHTML = cardData.body;
        }

        container.appendChild(card);
        updateCardCount(bucket, 1);
      });
    });
  }
}



function resetLocalStorage() {
  localStorage.removeItem("kanbanBoard");
  localStorage.removeItem("boardTitle");
  location.reload();
}

//==============================================================================================================
// Bucket and Card Functions

// --------------------
// Buckets

function resizeWidthBuckets(){
  const bucketCount = document.querySelectorAll(".bucket").length;

  const bucketWidth = 100 / (bucketCount + 1);
  document.querySelectorAll(".bucket").forEach(bucket => {
      bucket.style.width = `${bucketWidth}%`;
  });  
}

function createBucket(bucketName="New Bucket") {
  const bucketCount = document.querySelectorAll(".bucket").length;

  const bucket = document.createElement('div');
  bucket.classList.add("bucket");
  bucket.setAttribute("id", `b${bucketCount + 1}`);

  const bucketTemplate = `
      <h2><span class="title" style="display: inline-block;">${bucketName}</span><span class="counter">0</span></h2>
      <span class="move-left">&lt;</span>
      <span class="move-right">&gt;</span>
      <span class="plus">+</span>
      <span class="x-to-remove-bucket">[X]</span>
      <div class="container"></div>
  `;
  bucket.innerHTML = bucketTemplate.trim();
  
  bucket.querySelector(".move-left").addEventListener("click", moveBucketLeft);
  bucket.querySelector(".move-right").addEventListener("click", moveBucketRight);
  bucket.querySelector(".plus").addEventListener("click", addCardButton);
  bucket.querySelector(".x-to-remove-bucket").addEventListener("click", removeBucketButton);

  bucket.addEventListener("dragover", bucketDragOver);
  bucket.addEventListener("drop", bucketDrop);
  bucket.addEventListener("dragenter", bucketDragEnter);

  const bucketsElement = document.querySelector(".buckets");
  bucketsElement.insertAdjacentElement("beforeend", bucket);

  resizeWidthBuckets();

  makeAllBucketTitlesEditable(); //Too much?!?!

}

function addBucketButton(){
  createBucket();
  saveToLocalStorage();
}

function moveBucketLeft(e) {
  const bucket = e.target.closest(".bucket");
  const prevBucket = bucket.previousElementSibling;
  if (prevBucket) {
    bucket.parentElement.insertBefore(bucket, prevBucket);
    saveToLocalStorage();
  }
}

function moveBucketRight(e) {
  const bucket = e.target.closest(".bucket");
  const nextBucket = bucket.nextElementSibling;
  if (nextBucket) {
    bucket.parentElement.insertBefore(nextBucket, bucket);
    saveToLocalStorage();
  }
}

function addCardButton(e) {
  const bucket = e.target.parentElement;
  const container = bucket.querySelector(".container");
  const card = createCard();
  container.appendChild(card);
  updateCardCount(bucket, 1);
  saveToLocalStorage();
}

function removeBucketButton(e) {
  const bucket = e.target.closest(".bucket");
  bucket.remove();
  saveToLocalStorage();

  resizeWidthBuckets();
}

function makeBucketTitleEditable(title) {
  title.addEventListener("click", (e) => {
    const target = e.target;
    const input = document.createElement("input");
    input.type = "text";
    input.value = target.textContent;
    input.className = "title";
    input.style.width = "100%";
    target.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      target.textContent = input.value;
      input.replaceWith(target);
      saveToLocalStorage();
    });
  });
}

function makeAllBucketTitlesEditable() {
  document.querySelectorAll(".title").forEach(title => {
    makeBucketTitleEditable(title);
  });
}

function moveBucketLeft(e) {
  const bucket = e.target.closest(".bucket");
  const prevBucket = bucket.previousElementSibling;
  if (prevBucket) {
    bucket.parentElement.insertBefore(bucket, prevBucket);
    saveToLocalStorage();
  }
}

function bucketDragOver(e) {
  e.preventDefault();
}

function bucketDrop(e) {
  e.preventDefault();
  const cardId = e.dataTransfer.getData("text");
  const card = document.getElementById(cardId);
  const container = e.currentTarget.querySelector(".container");

  if (card) {
    const oldBucket = card.parentElement.parentElement;
    container.appendChild(card);
    updateCardCount(oldBucket, -1); // Decrease the card count in the old bucket by 1
    updateCardCount(e.currentTarget, 1); // Increase the card count in the new bucket by 1
  } else {
    const draggedCard = document.querySelector('.dragging');
    if (draggedCard) {
      const oldBucket = draggedCard.parentElement.parentElement;
      container.appendChild(draggedCard);
      updateCardCount(oldBucket, -1); // Decrease the card count in the old bucket by 1
      updateCardCount(e.currentTarget, 1); // Increase the card count in the new bucket by 1
    }
  }
}

function bucketDragEnter(e) {
  e.preventDefault();
}

// --------------------
// Cards

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
      saveToLocalStorage();
  });

  card.appendChild(minus);

  const viewAsHtmlIcon = document.createElement("i");
  viewAsHtmlIcon.className = "fas fa-eye view-as-html";
  viewAsHtmlIcon.style.marginLeft = "0.5rem";
  viewAsHtmlIcon.style.display = "none";
  card.appendChild(viewAsHtmlIcon);

  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit edit";
  editIcon.style.marginLeft = "0.5rem";
  card.appendChild(editIcon);

  const lockIcon = document.createElement("i"); // Add lock icon
  lockIcon.className = "fa fa-unlock lock";
  lockIcon.style.marginLeft = "0.5rem";
  card.appendChild(lockIcon);

  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.placeholder = "Enter description...";
  
  // Update initial state of viewAsHtmlIcon, editIcon and lockIcon
  viewAsHtmlIcon.style.display = "inline";
  editIcon.style.display = "none";
  lockIcon.style.display = "inline";

  lockIcon.addEventListener("click", () => {
    if (cardBody.classList.contains("locked")) {
        cardBody.classList.remove("locked");
        lockIcon.classList.remove("fa-lock");
        lockIcon.classList.add("fa-unlock");
        card.classList.remove("disable-hover"); // Remove disable-hover class
    } else {
        cardBody.classList.add("locked");
        lockIcon.classList.remove("fa-unlock");
        lockIcon.classList.add("fa-lock");
        card.classList.add("disable-hover"); // Add disable-hover class
    }
  });

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
          textarea.value = cardBody.innerHTML;
          card.replaceChild(textarea, cardBody);
          cardBody = textarea;

          viewAsHtmlIcon.style.display = "inline";
          editIcon.style.display = "none";

          // Add event listener to save changes on input
          cardBody.addEventListener("input", saveToLocalStorage);
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

          // Remove event listener added to textarea when editing
          cardBody.removeEventListener("input", saveToLocalStorage);
      }
  });

  card.appendChild(cardBody);

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



//==============================================================================================================
// Data IO

// Export function
function exportMatrix() {
  const boardTitle = document.querySelector(".board-title").textContent;

  const data = {
      boardTitle: boardTitle,
      bucketsData: JSON.parse(localStorage.getItem("kanbanBoard")),
  };

  const ISOdateTime = new Date().toISOString().replace(/:/g, '-').replace('.', '_');
  const fileName = "Kanban_" + boardTitle.replace(/ /g, "-") + "-" + ISOdateTime + ".json";

  const fileContent = JSON.stringify(data, null, 2);
  const file = new Blob([fileContent], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = fileName;
  link.click();
}

// Import function
function importMatrix(event) {
    const input = event.target;

    if (input.files.length === 0) {
        alert('No file selected!');
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const fileContent = event.target.result;
        
        try {
            const jsonData = JSON.parse(fileContent);

            console.log("JSON Import size:: " + fileContent.length);
            
            const loadedBoardTitle = jsonData.boardTitle;
            if (loadedBoardTitle) {
              const titleElement = document.getElementById("boardTitle");
              titleElement.textContent = loadedBoardTitle;
              localStorage.setItem("boardTitle", loadedBoardTitle);
            }

            // Update the buckets data
            const bucketsData = jsonData.bucketsData;
            if (bucketsData) {
                localStorage.setItem("kanbanBoard", JSON.stringify(bucketsData));
                location.reload();
            } else {
                alert('Invalid file format!');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };

    reader.onerror = () => {
        alert('Error reading file!');
    };

    reader.readAsText(file);
}


//==============================================================================================================
// Automatic functions when the page loads:
makeBoardTitleEditable();
loadBoardTitleFromLocalStorage();
loadFromLocalStorage();

if (document.querySelectorAll(".bucket").length === 0) {

  createBucket("Backlog");
  createBucket("Blocked");
  createBucket("In Progress");
  createBucket("Done");

}

document.getElementById("addBucketButton").addEventListener("click", addBucketButton);
document.getElementById("exportButton").addEventListener("click", exportMatrix);
document.getElementById("importButton").addEventListener("change", importMatrix);