// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
const dinoData = [];

fetch("dino.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.Dinos.forEach((dino) => {
      dinoData.push(
        new Dino(
          dino.species,
          dino.weight,
          dino.height,
          dino.diet,
          dino.where,
          dino.when,
          dino.fact
        )
      );
    });
  });

// Create Human Object
const human = {
  species: "Human",
  name: "",
  weight: 0,
  height: 0,
  diet: "",
  where: "",
  when: "",
  fact: "",
};

// Use IIFE to get human data from form
(function () {
  document.getElementById("btn").addEventListener("click", function () {
    human.name = document.getElementById("name").value;
    human.weight = document.getElementById("weight").value;
    human.height =
      document.getElementById("feet").value * 12 +
      document.getElementById("inches").value;
    human.diet = document.getElementById("diet").value;
  });
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (human) {
  return this.compareFeature('weight', human);
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (human) {
  return this.compareFeature('height', human);
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function (human) {
  return this.compareFeature('diet', human);
};

// Generic compare function added to Dino prototype
Dino.prototype.compareFeature = function (feature, human) {
  const humanFeature = human[feature];
  const dinoFeature = this[feature];
  let result;

  switch (feature) {
    case 'weight':
      result = dinoFeature > humanFeature ? "is heavier than" : "is lighter than";
      break;
    case 'height':
      result = dinoFeature > humanFeature ? "is taller than" : "is shorter than";
      break;
    case 'diet':
      result = dinoFeature === humanFeature ? "has the same diet as" : "has a different diet than";
      break;
    default:
      result = "has a different characteristic than";
  }

  return `${this.species} ${result} you`;
};

// Generate Tiles for each Dino in Array
function generateTiles() {
  const grid = document.getElementById("grid");

  // Randomize dino order
  dinoData.sort(() => Math.random() - 0.5);

  dinoData.forEach((dino) => {
    const tile = document.createElement("div");
    tile.classList.add("grid-item");
    tile.innerHTML = `
                <h3>${dino.species}</h3>
                <img src="images/${dino.species.toLowerCase()}.png" alt="${
      dino.species
    }">`;

    if (dino.species === "Pigeon") {
      tile.innerHTML += `<p>${dino.fact}</p>`;
    } else {
      // Random fact
      let fact = "";
      const facts = [
        dino.compareWeight(human),
        dino.compareHeight(human),
        dino.compareDiet(human),
        dino.fact,
      ];
      fact = facts[Math.floor(Math.random() * facts.length)];

      // Add fact to tile
      tile.innerHTML += `<p>${fact}</p>`;
    }

    // Add hover effect to tile
    addHoverEffect(dino, tile);

    // Add tiles to DOM
    grid.appendChild(tile);
  }, this);

  // Add human tile to DOM
  const humanTile = document.createElement("div");
  humanTile.classList.add("grid-item");
  humanTile.innerHTML = `
                <h3>${human.name}</h3>
                <img src="images/human.png" alt="human">
            `;

  // Add hover effect to tile
  addHoverEffect(human, humanTile);

  // Add tiles to DOM
  grid.insertBefore(humanTile, grid.children[4]);
}

// Remove form from screen
function removeForm() {
  document.getElementById("dino-compare").style.display = "none";
}

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", function () {
  if (!validateForm()) return;
  generateTiles();
  removeForm();
  addTryAgainButton();
});

// Add hover effect to tile
function addHoverEffect(obj, tile) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.innerHTML = `
                    <span>Weight: ${obj.weight} lbs</span>
                    <span>Height: ${obj.height} inches</span>
                    <span>Diet: ${obj.diet}</span>
                    <span>${obj.fact}</span>`;
  tile.appendChild(overlay);
}

// Validate form
function validateForm() {
  let isValid = true;
  // Validate form: all fields are required
  // If any field is empty, show alert and stop form submission
  if (
    human.name === "" ||
    human.weight === "" ||
    human.height === "" ||
    human.diet === ""
  ) {
    isValid = false;
    addErrorMessage("All fields are required");
  } else if (isNaN(human.weight) || isNaN(human.height)) {
    isValid = false;
    addErrorMessage("Weight and height must be numbers");
  } else if (human.weight <= 0 || human.height <= 0) {
    isValid = false;
    addErrorMessage("Weight and height must be greater than 0");
  }

  return isValid;
}

// Add try again button
function addTryAgainButton() {
  const grid = document.getElementById("grid");

  // Add back to form button
  const backToForm = document.createElement("button");
  backToForm.innerHTML = "Back to form";
  backToForm.classList.add("btn");
  backToForm.addEventListener("click", function () {
    location.reload();
  });

  // Add button before grid and hide this button when form is displayed
  document.body.insertBefore(backToForm, grid);
  if (document.getElementById("dino-compare").style.display === "block") {
    backToForm.style.display = "none";
  }
}

// Add error message to DOM if form is not valid
function addErrorMessage(message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.innerHTML = message;
  // add error message before the #btn
  document.getElementById("btn").before(errorMessage);
}

// Remove error message from DOM function
function removeErrorMessage() {
  const errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Check if any form controls on change and remove error message using IIFE
(function () {
  const formControls = document.querySelectorAll("input, select");
  formControls.forEach((control) => {
    control.addEventListener("change", removeErrorMessage);
  });
})();
