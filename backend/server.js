const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'customPokemon.json');

function readCustomPokemon() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
}

function writeCustomPokemon(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizeName(name) {
  return String(name || '').trim();
}

function parseAbilities(abilities) {
  if (Array.isArray(abilities)) {
    return abilities.map((a) => String(a).trim()).filter(Boolean);
  }

  if (typeof abilities === 'string') {
    return abilities
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
  }

  return [];
}

function parseStats(stats) {
  if (Array.isArray(stats)) {
    return stats.map((s) => ({
      name: String(s.name || '').trim(),
      value: Number(s.value) || 0
    })).filter((s) => s.name);
  }

  return [];
}

function createCustomPokemonPayload(body, existingId = null) {
  return {
    id: existingId || `custom-${Date.now()}`,
    isCustom: true,
    name: normalizeName(body.name),
    description: String(body.description || '').trim(),
    weight: Number(body.weight) || 0,
    height: Number(body.height) || 0,
    base_experience: Number(body.base_experience) || 0,
    abilities: parseAbilities(body.abilities),
    stats: parseStats(body.stats),
    image: String(body.image || '').trim(),
    cries: {
      latest: String(body.cry || '').trim()
    }
  };
}

/**
 * GET all custom pokemon
 */
app.get('/api/custom-pokemon', (req, res) => {
  const pokemon = readCustomPokemon();
  res.json(pokemon);
});

/**
 * GET one custom pokemon
 */
app.get('/api/custom-pokemon/:id', (req, res) => {
  const pokemon = readCustomPokemon();
  const found = pokemon.find((p) => p.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: 'Custom Pokémon not found' });
  }

  res.json(found);
});

/**
 * CREATE custom pokemon
 */
app.post('/api/custom-pokemon', (req, res) => {
  const pokemon = readCustomPokemon();

  const newPokemon = createCustomPokemonPayload(req.body);

  if (!newPokemon.name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  pokemon.push(newPokemon);
  writeCustomPokemon(pokemon);

  res.status(201).json(newPokemon);
});

/**
 * UPDATE custom pokemon
 */
app.patch('/api/custom-pokemon/:id', (req, res) => {
  const pokemon = readCustomPokemon();
  const index = pokemon.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Custom Pokémon not found' });
  }

  const oldPokemon = pokemon[index];

  const updatedPokemon = {
    ...oldPokemon,
    name: req.body.name !== undefined ? normalizeName(req.body.name) : oldPokemon.name,
    description: req.body.description !== undefined ? String(req.body.description).trim() : oldPokemon.description,
    weight: req.body.weight !== undefined ? Number(req.body.weight) || 0 : oldPokemon.weight,
    height: req.body.height !== undefined ? Number(req.body.height) || 0 : oldPokemon.height,
    base_experience:
      req.body.base_experience !== undefined
        ? Number(req.body.base_experience) || 0
        : oldPokemon.base_experience,
    abilities:
      req.body.abilities !== undefined
        ? parseAbilities(req.body.abilities)
        : oldPokemon.abilities,
    stats:
      req.body.stats !== undefined
        ? parseStats(req.body.stats)
        : oldPokemon.stats,
    image: req.body.image !== undefined ? String(req.body.image).trim() : oldPokemon.image,
    cries: {
      latest:
        req.body.cry !== undefined
          ? String(req.body.cry).trim()
          : oldPokemon.cries?.latest || ''
    }
  };

  pokemon[index] = updatedPokemon;
  writeCustomPokemon(pokemon);

  res.json(updatedPokemon);
});

/**
 * DELETE custom pokemon
 */
app.delete('/api/custom-pokemon/:id', (req, res) => {
  const pokemon = readCustomPokemon();
  const filtered = pokemon.filter((p) => p.id !== req.params.id);

  if (filtered.length === pokemon.length) {
    return res.status(404).json({ message: 'Custom Pokémon not found' });
  }

  writeCustomPokemon(filtered);
  res.json({ message: 'Custom Pokémon deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
