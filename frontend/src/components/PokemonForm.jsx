import React, { useEffect, useState } from 'react';

const defaultForm = {
  name: '',
  description: '',
  weight: '',
  height: '',
  base_experience: '',
  abilities: '',
  stats: '',
  image: '',
  cry: '',
  cardType: 'colorless' 
};

export default function PokemonForm({ onSubmit, editingPokemon, onCancel }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingPokemon) {
      setForm({
        name: editingPokemon.name || '',
        description: editingPokemon.description || '',
        weight: editingPokemon.weight || '',
        height: editingPokemon.height || '',
        base_experience: editingPokemon.base_experience || '',
        // Ensures abilities string works for the text input
        abilities: Array.isArray(editingPokemon.abilities) 
          ? editingPokemon.abilities.join(', ') 
          : editingPokemon.abilities || '',
        stats: editingPokemon.stats?.map((s) => `${s.name}:${s.value}`).join(', ') || '',
        image: editingPokemon.image || '',
        cry: editingPokemon.cry || (editingPokemon.cries?.latest) || '',
        cardType: editingPokemon.cardType || 'colorless'
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingPokemon]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function parseStatsInput(statsInput) {
    if (!statsInput) return [];
    return statsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((pair) => {
        const [name, value] = pair.split(':');
        return {
          name: name?.trim() || '',
          value: Number(value) || 0
        };
      })
      .filter((stat) => stat.name);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      weight: Number(form.weight),
      height: Number(form.height),
      base_experience: Number(form.base_experience),
      // IMPORTANT: Convert string back to Array for the API/Details view
      abilities: form.abilities.split(',').map(a => a.trim()).filter(Boolean),
      stats: parseStatsInput(form.stats),
      image: form.image,
      cry: form.cry,
      cardType: form.cardType 
    };

    onSubmit(payload);
    if (!editingPokemon) {
      setForm(defaultForm);
    }
  }

  return (
    <form className="pokemon-form" onSubmit={handleSubmit}>
      <h2>{editingPokemon ? 'EDIT POKÉMON' : 'ADD NEW POKÉMON'}</h2>

      <div className="input-group">
        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="input-group">
        <label>Card Background</label>
        <select name="cardType" value={form.cardType} onChange={handleChange} className="fancy-select">
          <option value="colorless">Colorless (Normal)</option>
          <option value="grass">Grass</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="lightning">Lightning</option>
          <option value="psychic">Psychic</option>
          <option value="fighting">Fighting</option>
          <option value="darkness">Darkness</option>
          <option value="dragon">Dragon</option>
          <option value="metal">Metal</option>
          <option value="fairy">Fairy</option>
        </select>
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="input-group">
          <label>Weight</label>
          <input type="number" name="weight" value={form.weight} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Height</label>
          <input type="number" name="height" value={form.height} onChange={handleChange} />
        </div>
      </div>

      <div className="input-group">
        <label>Base Experience</label>
        <input type="number" name="base_experience" value={form.base_experience} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>Abilities (separate with commas)</label>
        <input type="text" name="abilities" value={form.abilities} onChange={handleChange} placeholder="e.g. Blaze, Solar Power" />
      </div>

      <div className="input-group">
        <label>Stats (hp:45, attack:50)</label>
        <input type="text" name="stats" value={form.stats} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>Image URL</label>
        <input type="text" name="image" value={form.image} onChange={handleChange} />
      </div>

      <div className="action-buttons">
        <button type="submit" className="submit-btn">
          {editingPokemon ? 'SAVE CHANGES' : 'CREATE POKÉMON'}
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </form>
  );
}