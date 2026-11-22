import React from 'react';

export default function PokemonDetail({ pokemon, onEdit, onDelete, onClose }) {
  // If no pokemon is selected, show the empty state with the close button
  if (!pokemon) {
    return (
      <div className="pd-modal-wrapper empty-state">
        <div className="pd-header-large">
          <h1 className="pd-header-title">PokeDigm Pokedex</h1>
          <button className="pd-close-pokedex" onClick={onClose}>X</button>
        </div>
        <div className="pd-content-square">
          <p className="pd-stylish-text">Select a Pokémon from the list to view details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-modal-wrapper active-detail">
      
      {/* THE THICK RED HEADER - Now with the functional X button */}
      <div className="pd-header-large">
        <h1 className="pd-header-title">PokeDigm Pokedex</h1>
        
        {/* This button matches the CSS .pd-close-pokedex for the white capsule */}
        <button className="pd-close-pokedex" onClick={onClose}>
          X
        </button>
      </div>

      <div className="pd-content-square">
        
        {/* LEFT COLUMN: Basic Info */}
        <div className="pd-column">
          <h2 className="pd-pokemon-name">{pokemon.name}</h2>
          <div className="pd-divider"></div>
          <p className="pd-stylish-text"><strong>Description:</strong> {pokemon.description || 'No description available.'}</p>
          <p className="pd-stylish-text"><strong>Weight:</strong> {pokemon.weight}</p>
          <p className="pd-stylish-text"><strong>Height:</strong> {pokemon.height}</p>
          <p className="pd-stylish-text"><strong>Base Exp:</strong> {pokemon.base_experience}</p>
          
          <div className="pd-section">
            <strong className="pd-label">Abilities:</strong>
            <ul className="pd-stylish-list">
              {pokemon.abilities?.length ? (
                pokemon.abilities.map((ability, index) => (
                  <li key={index} className="pd-stylish-item">{ability}</li>
                ))
              ) : (
                <li>No abilities listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* CENTER: Logo Area */}
        <div className="pd-column-center">
          <div className="pd-image-focus">
            {pokemon.image && (
              <img src={pokemon.image} alt={pokemon.name} className="pd-main-art" />
            )}
            
            <div className="pd-sprite-row">
              {pokemon.sprites?.front_default && (
                <img src={pokemon.sprites.front_default} alt="front" className="pd-sprite" />
              )}
              {pokemon.sprites?.back_default && (
                <img src={pokemon.sprites.back_default} alt="back" className="pd-sprite" />
              )}
              {pokemon.sprites?.front_shiny && (
                <img src={pokemon.sprites.front_shiny} alt="shiny" className="pd-sprite pd-shiny" />
              )}
              {pokemon.sprites?.back_shiny && (
                <img src={pokemon.sprites.back_shiny} alt="shiny back" className="pd-sprite pd-shiny" />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats & Audio */}
        <div className="pd-column">
          <div className="pd-section">
            <strong className="pd-label">Stats:</strong>
            <ul className="pd-stats-list">
              {pokemon.stats?.length ? (
                pokemon.stats.map((stat, index) => (
                  <li key={index} className="pd-stat-item">
                    <span>{stat.name}:</span> <span>{stat.value}</span>
                  </li>
                ))
              ) : (
                <li>No stats listed</li>
              )}
            </ul>
          </div>

          {pokemon.cries?.latest && (
            <div className="pd-audio-block">
              <strong className="pd-label">Cries:</strong>
              <audio controls src={pokemon.cries.latest} className="pd-custom-audio">
                Your browser does not support audio.
              </audio>
            </div>
          )}

          {pokemon.isCustom && (
            <div className="pd-action-buttons">
              <button className="pd-edit-btn" onClick={() => onEdit(pokemon)}>Edit</button>
              <button className="pd-delete-btn" onClick={() => onDelete(pokemon.id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}