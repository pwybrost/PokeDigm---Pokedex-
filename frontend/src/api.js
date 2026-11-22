const POKE_API = 'https://pokeapi.co/api/v2';
const BACKEND_API = '/api';

export async function fetchApiPokemonList() {
  const res = await fetch(`${POKE_API}/pokemon?limit=30`);
  const data = await res.json();

  const detailedPokemon = await Promise.all(
    data.results.map(async (pokemon) => {
      const detailRes = await fetch(pokemon.url);
      const detailData = await detailRes.json();

      return {
        id: detailData.id,
        isCustom: false,
        name: detailData.name,
        image:
          detailData.sprites?.front_default ||
          detailData.sprites?.other?.['official-artwork']?.front_default ||
          '',
        sprites: detailData.sprites,
        weight: detailData.weight,
        height: detailData.height,
        base_experience: detailData.base_experience,
        abilities: detailData.abilities?.map((a) => a.ability.name) || [],
        stats:
          detailData.stats?.map((s) => ({
            name: s.stat.name,
            value: s.base_stat
          })) || [],
        cries: detailData.cries || {}
      };
    })
  );

  return detailedPokemon;
}

export async function fetchPokemonDetails(id, isCustom = false) {
  if (isCustom) {
    const res = await fetch(`${BACKEND_API}/custom-pokemon/${id}`);
    if (!res.ok) throw new Error('Failed to fetch custom Pokémon');
    return await res.json();
  }

  const pokemonRes = await fetch(`${POKE_API}/pokemon/${id}`);
  const pokemonData = await pokemonRes.json();

  const speciesRes = await fetch(`${POKE_API}/pokemon-species/${id}`);
  const speciesData = await speciesRes.json();

  const englishFlavor =
    speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en')
      ?.flavor_text || 'No description available.';

  return {
    id: pokemonData.id,
    isCustom: false,
    name: pokemonData.name,
    image:
      pokemonData.sprites?.front_default ||
      pokemonData.sprites?.other?.['official-artwork']?.front_default ||
      '',
    sprites: pokemonData.sprites,
    description: englishFlavor.replace(/\f/g, ' ').replace(/\n/g, ' '),
    weight: pokemonData.weight,
    height: pokemonData.height,
    base_experience: pokemonData.base_experience,
    abilities: pokemonData.abilities?.map((a) => a.ability.name) || [],
    stats:
      pokemonData.stats?.map((s) => ({
        name: s.stat.name,
        value: s.base_stat
      })) || [],
    cries: pokemonData.cries || {}
  };
}

export async function fetchCustomPokemonList() {
  const res = await fetch(`${BACKEND_API}/custom-pokemon`);
  if (!res.ok) throw new Error('Failed to fetch custom Pokémon');
  return await res.json();
}

export async function createCustomPokemon(payload) {
  const res = await fetch(`${BACKEND_API}/custom-pokemon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create Pokémon');
  }

  return await res.json();
}

export async function updateCustomPokemon(id, payload) {
  const res = await fetch(`${BACKEND_API}/custom-pokemon/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update Pokémon');
  }

  return await res.json();
}

export async function deleteCustomPokemon(id) {
  const res = await fetch(`${BACKEND_API}/custom-pokemon/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete Pokémon');
  }

  return await res.json();
}
