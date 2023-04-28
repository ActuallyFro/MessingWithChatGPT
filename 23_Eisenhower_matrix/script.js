document.querySelectorAll(".plus").forEach(plus => {
    plus.addEventListener("click", (e) => {
        const quadrant = e.target.parentElement;
        const container = quadrant.querySelector(".container");
        const card = createCard();
        container.appendChild(card);
        updateCardCount(quadrant, 1);
    });
});

function createCard() {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("draggable", "true");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Label...";
    card.appendChild(input);

    const minus = document.createElement("span");
    minus.textContent = "-";
    minus.className = "minus";
    minus.addEventListener("click", () => {
        const quadrant = card.parentElement.parentElement;
        card.remove();
        updateCardCount(quadrant, -1);
    });
    
    
    card.appendChild(minus);

    const edit = document.createElement("span");
    edit.textContent = "📝";
    edit.className = "edit";
    edit.style.marginLeft = "0.5rem";
    edit.addEventListener("click", () => {
        cardBody.style.display = cardBody.style.display === 'none' ? 'block' : 'none';
    });
    card.appendChild(edit);

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

    // Update the 'dragstart' event listener to use the 'text' format
    document.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("card")) {
            e.target.classList.add("dragging");
            e.dataTransfer.setData("text", e.target.id);
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

function updateCardCount(quadrant, change) {
    const counter = quadrant.querySelector(".counter");
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

document.querySelectorAll(".quadrant").forEach(quadrant => {
    quadrant.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    // Update the 'drop' event listener to update the card counts
    quadrant.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("text");
        const card = document.getElementById(cardId);
        const container = quadrant.querySelector(".container");
                    
        if (card) {
            const oldQuadrant = card.parentElement.parentElement;
            container.appendChild(card);
            updateCardCount(oldQuadrant, -1); // Decrease the card count in the old quadrant by 1
            updateCardCount(quadrant, 1); // Increase the card count in the new quadrant by 1
        } else {
            const draggedCard = document.querySelector('.dragging');
            if (draggedCard) {
                const oldQuadrant = draggedCard.parentElement.parentElement;
                container.appendChild(draggedCard);
                updateCardCount(oldQuadrant, -1); // Decrease the card count in the old quadrant by 1
                updateCardCount(quadrant, 1); // Increase the card count in the new quadrant by 1
            }
        }
    });


    quadrant.addEventListener("dragenter", (e) => {
        e.preventDefault();
    });
});

document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("card")) {
        e.target.classList.remove("dragging");
    }
});