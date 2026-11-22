import React, { useEffect, useState } from 'react';
import {
  fetchApiPokemonList,
  fetchPokemonDetails,
  fetchCustomPokemonList,
  createCustomPokemon,
  updateCustomPokemon,
  deleteCustomPokemon
} from './api';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import PokemonForm from './components/PokemonForm';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pokemonToDelete, setPokemonToDelete] = useState(null); // The modal controller

  async function loadPokemon() {
    try {
      setLoading(true);
      setError('');
      const [apiPokemon, customPokemon] = await Promise.all([
        fetchApiPokemonList(),
        fetchCustomPokemonList()
      ]);
      // MERGING: Ensures custom ones appear first
      const merged = [...customPokemon, ...apiPokemon];
      setPokemonList(merged);
    } catch (err) {
      setError(err.message || 'Failed to load Pokémon.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPokemon();
  }, []);

  async function handleSelect(pokemon) {
    try {
      setError('');
      // Standard API fetch requires ID, Custom fetch requires ID + flag
      const details = await fetchPokemonDetails(pokemon.id, pokemon.isCustom);
      setSelectedPokemon(details); 
    } catch (err) {
      setError(err.message || 'Failed to load Pokémon details.');
    }
  }

  // Handle both Create and Update in one function
  async function handleCreateOrUpdate(payload) {
    try {
      setError('');
      
      // Formatting the payload to match API data structure
      const finalPayload = {
        ...payload,
        isCustom: payload.isCustom || false, // Preserve flag if editing
        // Standardize cardType for CSS classes
        cardType: payload.cardType ? payload.cardType.toLowerCase() : 'colorless'
      };

      if (editingPokemon) {
        await updateCustomPokemon(editingPokemon.id, finalPayload);
        setEditingPokemon(null);
      } else {
        // When creating, always set isCustom to true
        await createCustomPokemon({...finalPayload, isCustom: true});
      }
      
      // Complete state refresh
      await loadPokemon(); 
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  }

  function handleEdit(pokemon) {
    setEditingPokemon(pokemon);
    setSelectedPokemon(null); // Close detail view
    setShowForm(true); // Open form
  }

  // MODAL TRIGGER: Sets the ID, showing the confirm screen
  function handleDeleteRequest(id) {
    setPokemonToDelete(id);
  }

  // Actual persistent deletion logic (only runs when 'YES' is clicked)
  async function confirmDelete() {
    if (!pokemonToDelete) return;
    try {
      setError('');
      await deleteCustomPokemon(pokemonToDelete);
      // REFRESH: Get the new list without the deleted item
      await loadPokemon();
      
      // Close all UI layers
      setPokemonToDelete(null); // Close confirm modal
      setSelectedPokemon(null); // Close pokedex detail view
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <div className="app-container">
      <header className="glass-header">
        <div className="header-content">
          <h1>PokéDigm</h1>
          <button className="fancy-add-btn" onClick={() => setShowForm(true)}>
            <div className="pokeball-icon"></div>
            <span className="btn-text">ADD NEW POKEMON</span>
          </button>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      <main className="content-area">
        {loading ? (
          <div className="loading-spinner">Loading Pokémon...</div>
        ) : (
          <div className="pokemon-grid">
            {pokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </main>

      {/* DETAIL MODAL (TRANSPARENT POKEDEX UI) */}
      {selectedPokemon && (
        <div className="modal-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPokemon(null)}>×</button>
            <PokemonDetail
              pokemon={selectedPokemon}
              onEdit={handleEdit}
              // This prop now triggers the confirmation flow, not immediate delete
              onDelete={handleDeleteRequest}
              onClose={() => setSelectedPokemon(null)}
            />
          </div>
        </div>
      )}

      {/* FORM MODAL (ADD/EDIT - SOLID BG) */}
      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingPokemon(null); }}>
          <div className="modal-card form-modal form-variant" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setShowForm(false); setEditingPokemon(null); }}>×</button>
            <PokemonForm
              onSubmit={handleCreateOrUpdate}
              editingPokemon={editingPokemon}
              onCancel={() => { setShowForm(false); setEditingPokemon(null); }}
            />
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* FINAL CONFIRMATION MODAL         */}
      {/* (Perfected Interactive Buttons)     */}
      {/* ========================================= */}
      {/* ========================================= */}
{/* FINAL CONFIRMATION MODAL         */}
{/* ========================================= */}
{pokemonToDelete && (
  <div className="modal-overlay" onClick={() => setPokemonToDelete(null)} style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 9999, transition: 'all 0.3s ease'
  }}>
    <div className="modal-card form-modal form-variant" onClick={(e) => e.stopPropagation()} style={{
      maxWidth: '550px', borderRadius: '15px', overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', transition: 'transform 0.3s ease-out'
    }}>
      <div style={{ textAlign: 'center', padding: '40px', position: 'relative', zIndex: 10 }}>
        
        {/* BIG HEADLINE */}
        <h2 style={{
          color: '#000', 
          fontSize: '34px', 
          fontWeight: '900', 
          textTransform: 'uppercase',
          marginBottom: '25px',
          letterSpacing: '1px',
          WebkitTextStroke: '1px rgba(0,0,0,0.1)'
        }}>RELEASE POKÉMON?</h2>
        
        {/* MAIN MESSAGE */}
        <p style={{
          color: '#333', 
          fontSize: '19px', 
          fontWeight: '600', 
          marginBottom: '15px',
          lineHeight: '1.4'
        }}>
          Are you sure you want to release this Pokémon back into the wild?
        </p>
        
        {/* THE "CANNOT BE UNDONE" TEXT - NOW ROYAL BLUE */}
        <p style={{
          color: '#1a4fdb', /* This is the fix for readability */
          fontSize: '18px', 
          fontWeight: '800', 
          textTransform: 'uppercase',
          marginBottom: '40px',
          backgroundColor: 'rgba(255,255,255,0.7)', /* Added subtle text backing */
          padding: '5px 10px',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          This action <strong>CANNOT BE UNDONE</strong>.
        </p>
        
        {/* CREATIVE BUTTONS GROUP */}
        <div className="action-buttons" style={{
          display: 'flex', 
          justifyContent: 'center', 
          gap: '25px',
          marginTop: '10px'
        }}>
          
          {/* CREATIVE 'YES' BUTTON (TCG STYLE RED) */}
          <button 
            className="submit-btn creative-yes-btn" 
            onClick={confirmDelete}
            style={{
              /* Final perfect size */
              padding: '16px 36px !important', 
              fontSize: '18px !important',
              fontWeight: '800 !important',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '8px !important',
              transition: 'all 0.2s ease-in-out',
              
              /* Creative styling: TCG-like 3D effect */
              background: 'linear-gradient(180deg, #ff4d4d 0%, #cc0000 100%) !important',
              color: 'black',
              border: '2px solid #b30000 !important',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #800000',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            YES, RELEASE!
          </button>
          
          {/* CREATIVE 'NO' BUTTON (TCG STYLE BLUE) */}
          <button 
            className="cancel-btn creative-no-btn" 
            onClick={() => setPokemonToDelete(null)}
            style={{
              /* Match size */
              padding: '16px 36px !important', 
              fontSize: '18px !important',
              fontWeight: '800 !important',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '8px !important',
              transition: 'all 0.2s ease-in-out',
              
              /* Creative styling: TCG-like 3D effect */
              background: 'linear-gradient(180deg, #4d89ff 0%, #1a4fdb 100%) !important',
              color: 'white',
              border: '2px solid #1440af !important',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 0 #0f2d7a',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            NO, KEEP IT
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <footer className="glass-footer">
        <p>© PokéDigm 2026 - ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}