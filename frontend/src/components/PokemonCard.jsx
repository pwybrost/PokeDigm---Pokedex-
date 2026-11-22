import React from 'react';

// Asset Imports
import GrassBg from '../assets/Grass.png';
import FireBg from '../assets/Fire.png';
import WaterBg from '../assets/Water.png';
import ColorlessBg from '../assets/Colorless.png';
import LightningBg from '../assets/Lightning.png';
import PsychicBg from '../assets/Psychic.png';
import FightingBg from '../assets/Fighting.png';
import DarknessBg from '../assets/Darkness.png';
import MetalBg from '../assets/Metal.png';
import FairyBg from '../assets/Fairy.png';
import DragonBg from '../assets/Dragon.png';

export default function PokemonCard({ pokemon, onSelect }) {
  
  const typeBackgrounds = {
    grass: GrassBg,
    fire: FireBg,
    water: WaterBg,
    electric: LightningBg,
    lightning: LightningBg,
    psychic: PsychicBg,
    fighting: FightingBg,
    darkness: DarknessBg,
    metal: MetalBg,
    fairy: FairyBg,
    dragon: DragonBg,
    colorless: ColorlessBg
  };

  const apiMapping = {
    grass: [
      'bulbasaur', 'ivysaur', 'venusaur', 'caterpie', 'metapod', 'butterfree', 
      'weedle', 'kakuna', 'beedrill', 'oddish', 'gloom', 'vileplume', 
      'paras', 'parasect', 'bellsprout', 'weepinbell', 'victreebel', 'exeggcute', 
      'exeggutor', 'tangela', 'scyther', 'pinsir'
    ],
    fire: [
      'charmander', 'charmeleon', 'charizard', 'vulpix', 'ninetales', 
      'growlithe', 'arcanine', 'ponyta', 'rapidash', 'magmar', 'flareon', 'moltres'
    ],
    water: [
      'squirtle', 'wartortle', 'blastoise', 'psyduck', 'golduck', 'poliwag', 
      'poliwhirl', 'poliwrath', 'tentacool', 'tentacruel', 'slowpoke', 'slowbro', 
      'seel', 'dewgong', 'shellder', 'cloyster', 'krabby', 'kingler', 
      'horsea', 'seadra', 'goldeen', 'seaking', 'staryu', 'starmie', 
      'magikarp', 'gyarados', 'lapras', 'vaporeon', 'omanyte', 'omastar', 'kabuto', 'kabutops', 'articuno'
    ],
    lightning: [
      'pikachu', 'raichu', 'magnemite', 'magneton', 'voltorb', 'electrode', 'electabuzz', 'jolteon', 'zapdos'
    ],
    psychic: [
      'abra', 'kadabra', 'alakazam', 'drowzee', 'hypno', 'mewtwo', 'mew',
      'ekans', 'arbok', 'zubat', 'golbat', 'gastly', 'haunter', 'gengar', 'mr-mime', 'koffing', 'weezing', 'jynx'
    ],
    fighting: [
      'sandshrew', 'sandslash', 'diglett', 'dugtrio', 'mankey', 'primeape', 
      'machop', 'machoke', 'machamp', 'geodude', 'graveler', 'golem', 
      'onix', 'hitmonlee', 'hitmonchan', 'cubone', 'marowak', 'rhyhorn', 'rhydon', 'aerodactyl'
    ],
    colorless: [
      'pidgey', 'pidgeotto', 'pidgeot', 'rattata', 'raticate', 'spearow', 'fearow', 
      'meowth', 'persian', 'farfetchd', 'doduo', 'dodrio', 'lickitung', 'chansey', 'kangaskhan', 
      'eevee', 'porygon', 'snorlax', 'tauros', 'ditto'
    ],
    // ADDED TYPES BELOW
    fairy: [
      'clefairy', 'clefable', 'jigglypuff', 'wigglytuff', 'mr-mime'
    ],
    dragon: [
      'dratini', 'dragonair', 'dragonite'
    ],
    metal: [
      'magnemite', 'magneton', 'skarmory' // These were the only Gen 1 steel types added later
    ],
    darkness: [
      // Gen 1 didn't have many Dark types, but in TCG, Poison/Ghost often go here
      'grimer', 'muk', 'nidoran-f', 'nidorina', 'nidoqueen', 'nidoran-m', 'nidorino', 'nidoking',
    ]
  };

  let backgroundImage = ColorlessBg;
  const name = pokemon.name?.toLowerCase().trim() || "";
  const currentType = (pokemon.cardType || pokemon.type || '').toLowerCase().trim();

  // PRIORITY 1: Use selection from form
  if (typeBackgrounds[currentType]) {
    backgroundImage = typeBackgrounds[currentType];
  } 
  // PRIORITY 2: Check the hardcoded 151 list
  else {
    Object.keys(apiMapping).forEach(type => {
      if (apiMapping[type].includes(name)) {
        backgroundImage = typeBackgrounds[type];
      }
    });
  }

  return (
    <div 
      className={`pokemon-card type-${currentType || 'colorless'}`} 
      onClick={() => onSelect(pokemon)}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={pokemon.image} alt={pokemon.name} className="card-main-image" />
      <div className="card-name-container center-aligned">
        <p className="card-name">{pokemon.name}</p>
        {pokemon.isCustom && <span className="badge">Custom</span>}
      </div>
    </div>
  );
}