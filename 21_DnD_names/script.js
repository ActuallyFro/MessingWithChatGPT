const generateBtn = document.getElementById("generate");
const exportBtn = document.getElementById("export");
const namesTable = document.getElementById("namesTable");

const titles = ["Lord", "Lady", "Sir", "Dame"];
const consonants = "bcdfghjklmnpqrstvwxyz";
const vowels = "aeiou";

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(minLength, maxLength) {
  const nameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let name = "";

  for (let i = 0; i < nameLength; i++) {
    name += i % 2 === 0 ? getRandomElement(consonants) : getRandomElement(vowels);
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

function addRandomTitle(name) {
  if (Math.random() < 0.2) {
    return `${getRandomElement(titles)} ${name}`;
  }
  return name;
}

const backgrounds = ["Noble", "Outlander", "Sailor", "Soldier"];
const classes = ["Warrior", "Mage", "Rogue", "Cleric"];

generateBtn.addEventListener("click", () => {
  const firstName = generateName(3, 6);
  const lastName = generateName(4, 8);
  const fullName = addRandomTitle(`${firstName} ${lastName}`);
  const background = getRandomElement(backgrounds);
  const charClass = getRandomElement(classes);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${fullName}</td>
    <td>${background}</td>
    <td>${charClass}</td>
    <td><button class="delete">X</button></td>
  `;

  row.querySelector(".delete").addEventListener("click", () => {
    namesTable.querySelector("tbody").removeChild(row);
  });

  namesTable.querySelector("tbody").appendChild(row);
});

exportBtn.addEventListener("click", () => {
  const rows = namesTable.querySelectorAll("tbody tr");
  const data = Array.from(rows).map(row => {
    const cells = row.querySelectorAll("td");
    return {
      name: cells[0].textContent,
      background: cells[1].textContent,
      class: cells[2].textContent
    };
  });

  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "names.json";
  a.click();
  URL.revokeObjectURL(url);
});

const importBtn = document.getElementById("import");

function handleFileSelect(evt) {
  const file = evt.target.files[0];
  if (file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      data.forEach(({ name, background, class: charClass }) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${name}</td>
          <td>${background}</td>
          <td>${charClass}</td>
          <td><button class="delete">X</button></td>
        `;
        row.querySelector(".delete").addEventListener("click", () => {
          namesTable.querySelector("tbody").removeChild(row);
        });
        namesTable.querySelector("tbody").appendChild(row);
      });
    };
    reader.readAsText(file);
  }
}

importBtn.addEventListener("change", handleFileSelect);
