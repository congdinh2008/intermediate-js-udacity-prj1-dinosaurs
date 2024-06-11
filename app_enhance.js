// Create Dino class with methods to compare weight, height, and diet
class Dino {
  constructor(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
  }

  compareFeature(feature, humanFeature, comparisonType) {
    const featureValue = this[feature];
    let comparisonResult;

    switch (comparisonType) {
      case 'weight':
        comparisonResult = featureValue > humanFeature ? "heavier" : "lighter";
        break;
      case 'height':
        comparisonResult = featureValue > humanFeature ? "taller" : "shorter";
        break;
      case 'diet':
        comparisonResult = featureValue === humanFeature ? "has the same diet as" : "has a different diet than";
        break;
      default:
        comparisonResult = "has a different characteristic than";
    }

    return `${this.species} ${comparisonResult} you`;
  }

  compareWeight(human) {
    return this.compareFeature('weight', human.weight, 'weight');
  }

  compareHeight(human) {
    return this.compareFeature('height', human.height, 'height');
  }

  compareDiet(human) {
    return this.compareFeature('diet', human.diet, 'diet');
  }
}

// Fetch dino data from JSON file
async function fetchDinoData() {
  try {
    const response = await fetch("dino.json");
    const data = await response.json();
    return data.Dinos.map(
      (dino) =>
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
  } catch (error) {
    console.error("Failed to fetch dino data:", error);
  }
}

function getHumanData() {
  const human = {
    species: "Human",
    name: document.getElementById("name").value,
    weight: parseInt(document.getElementById("weight").value),
    height:
      parseInt(document.getElementById("feet").value) * 12 +
      parseInt(document.getElementById("inches").value),
    diet: document.getElementById("diet").value,
  };
  return human;
}

function generateTiles(dinoData, human) {
  // Separate logic for generating human and dino tiles

  // Randomize dino order
  dinoData.sort(() => Math.random() - 0.5);

  const grid = document.getElementById("grid");

  dinoData.forEach((dino) => {
    const tile = document.createElement("div");
    tile.className = "grid-item";

    const title = document.createElement("h3");
    title.textContent = dino.species;

    const image = document.createElement("img");
    image.src = `images/${dino.species.toLowerCase()}.png`;
    image.alt = dino.species;

    const fact = document.createElement("p");
    if (dino.species === "Pigeon") {
      fact.textContent = dino.fact;
    } else {
      const facts = [
        dino.compareWeight(human),
        dino.compareHeight(human),
        dino.compareDiet(human),
        dino.fact,
      ];
      fact.textContent = facts[Math.floor(Math.random() * facts.length)];
    }

    tile.appendChild(title);
    tile.appendChild(image);
    tile.appendChild(fact);

    // Add hover effect to tile
    addHoverEffect(dino, tile);

    grid.appendChild(tile);
  });

  // Add human tile
  const humanTile = document.createElement("div");
  humanTile.className = "grid-item";

  const humanTitle = document.createElement("h3");
  humanTitle.textContent = human.species;

  const humanImage = document.createElement("img");
  humanImage.src = "images/human.png";
  humanImage.alt = "human";

  humanTile.appendChild(humanTitle);
  humanTile.appendChild(humanImage);

  // Add hover effect to tile
  addHoverEffect(human, humanTile);

  grid.insertBefore(humanTile, grid.children[4]);
}

// Add hover effect to tile
function addHoverEffect(obj, tile) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const weight = document.createElement("span");
  weight.textContent = `Weight: ${obj.weight} lbs`;
  const height = document.createElement("span");
  height.textContent = `Height: ${obj.height} inches`;
  const diet = document.createElement("span");
  diet.textContent = `Diet: ${obj.diet}`;
  overlay.appendChild(weight);
  overlay.appendChild(height);
  overlay.appendChild(diet);
  tile.appendChild(overlay);
}

function validateForm() {
  let isValid = true;
  // Clear previous error messages
  removeErrorMessage();

  // Fetch form inputs directly
  const name = document.getElementById("name").value.trim();
  const weight = document.getElementById("weight").value.trim();
  const heightFeet = document.getElementById("feet").value.trim();
  const heightInches = document.getElementById("inches").value.trim();
  const diet = document.getElementById("diet").value;

  // Validate name
  if (!name) {
    isValid = false;
    addErrorMessage("Name is required.");
  }

  // Validate weight
  if (!weight) {
    isValid = false;
    addErrorMessage("Weight is required.");
  } else if (isNaN(weight) || weight <= 0) {
    isValid = false;
    addErrorMessage("Weight must be a number greater than 0.");
  }

  // Validate height (feet and inches)
  if (!heightFeet || !heightInches) {
    isValid = false;
    addErrorMessage("Height (feet and inches) is required.");
  } else if (
    isNaN(heightFeet) ||
    isNaN(heightInches) ||
    heightFeet <= 0 ||
    heightInches < 0
  ) {
    isValid = false;
    addErrorMessage(
      "Height must be numbers, with feet greater than 0 and inches >= 0."
    );
  }

  // Validate diet
  if (!diet) {
    isValid = false;
    addErrorMessage("Diet selection is required.");
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

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", async () => {
  const dinoData = await fetchDinoData();
  if (!validateForm()) return;
  const human = getHumanData();
  generateTiles(dinoData, human);
  removeForm();
  addTryAgainButton();
});

// Remove form from screen
function removeForm() {
  document.getElementById("dino-compare").style.display = "none";
}
