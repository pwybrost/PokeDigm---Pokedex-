import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function formatPokemon(row) {
  return {
    id: row.id,
    isCustom: row.is_custom,
    name: row.name,
    description: row.description || '',
    weight: Number(row.weight) || 0,
    height: Number(row.height) || 0,
    base_experience: Number(row.base_experience) || 0,
    abilities: row.abilities || [],
    stats: row.stats || [],
    image: row.image || '',
    cries: row.cries || { latest: '' }
  };
}

function parseAbilities(abilities) {
  if (Array.isArray(abilities)) return abilities.map((a) => String(a).trim()).filter(Boolean);
  if (typeof abilities === 'string') return abilities.split(',').map((a) => a.trim()).filter(Boolean);
  return [];
}

function parseStats(stats) {
  if (!Array.isArray(stats)) return [];
  return stats
    .map((s) => ({ name: String(s.name || '').trim(), value: Number(s.value) || 0 }))
    .filter((s) => s.name);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM custom_pokemon ORDER BY id ASC`;
    return res.status(200).json(rows.map(formatPokemon));
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name || '').trim();
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const newPokemon = {
      id: `custom-${Date.now()}`,
      isCustom: true,
      name,
      description: String(body.description || '').trim(),
      weight: Number(body.weight) || 0,
      height: Number(body.height) || 0,
      base_experience: Number(body.base_experience) || 0,
      abilities: parseAbilities(body.abilities),
      stats: parseStats(body.stats),
      image: String(body.image || '').trim(),
      cries: { latest: String(body.cry || '').trim() }
    };

    await sql`
      INSERT INTO custom_pokemon (
        id, is_custom, name, description, weight, height, base_experience, abilities, stats, image, cries
      ) VALUES (
        ${newPokemon.id},
        ${true},
        ${newPokemon.name},
        ${newPokemon.description},
        ${newPokemon.weight},
        ${newPokemon.height},
        ${newPokemon.base_experience},
        ${JSON.stringify(newPokemon.abilities)}::jsonb,
        ${JSON.stringify(newPokemon.stats)}::jsonb,
        ${newPokemon.image},
        ${JSON.stringify(newPokemon.cries)}::jsonb
      )
    `;

    return res.status(201).json(newPokemon);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}