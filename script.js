const apiBaseURL = "https://pokeapi.co/api/v2";
const pokemonListContainer = document.getElementById("pokemon-list");
const errorMessage = document.getElementById("error-message");

// Fetch the first 50 Pokémon
async function loadPokemon() {
    try {
        const response = await fetch(`${apiBaseURL}/pokemon?limit=50`);
        if (!response.ok) throw new Error("Failed to load Pokémon list");
        const data = await response.json();

        displayPokemonList(data.results);
    } catch (error) {
        showError("Unable to load Pokémon list. Please try again later.");
        console.error(error);
    }
}

// Display Pokémon list
async function displayPokemonList(pokemonArray) {
    pokemonListContainer.innerHTML = ""; // Clear previous data
    errorMessage.innerText = ""; // Clear errors

    for (let pokemon of pokemonArray) {
        const pokemonDiv = document.createElement("div");
        pokemonDiv.classList.add("pokemon-card");

        // Fetch Pokémon details for image
        const details = await fetch(`${apiBaseURL}/pokemon/${pokemon.name}`).then(res => res.json());

        pokemonDiv.innerHTML = `
            <img src="${details.sprites.front_default}" alt="${pokemon.name}">
            <div class="pokemon-name">${capitalize(pokemon.name)}</div>
        `;
        pokemonListContainer.appendChild(pokemonDiv);
    }
}

// Search Pokémon by name
async function searchPokemon() {
    const searchInput = document.getElementById("pokemon-search").value.trim().toLowerCase();
    if (!searchInput) {
        showError("Please enter a Pokémon name to search.");
        return;
    }

    try {
        const response = await fetch(`${apiBaseURL}/pokemon/${searchInput}`);
        if (!response.ok) throw new Error("Pokémon not found");
        const data = await response.json();

        displayPokemonList([{ name: data.name }]);
    } catch (error) {
        showError("Pokémon not found. Please check the name and try again.");
        console.error(error);
    }
}

// Show error messages
function showError(message) {
    errorMessage.innerText = message;
}

// Utility function to capitalize Pokémon names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize the Pokémon list on page load
loadPokemon();
