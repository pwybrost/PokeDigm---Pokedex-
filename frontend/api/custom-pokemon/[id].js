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
  const { id } = req.query;

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM custom_pokemon WHERE id = ${id}`;
    if (!rows.length) return res.status(404).json({ message: 'Custom Pokémon not found' });
    return res.status(200).json(formatPokemon(rows[0]));
  }

  if (req.method === 'PATCH') {
    const rows = await sql`SELECT * FROM custom_pokemon WHERE id = ${id}`;
    if (!rows.length) return res.status(404).json({ message: 'Custom Pokémon not found' });

    const old = formatPokemon(rows[0]);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const updated = {
      ...old,
      name: body.name !== undefined ? String(body.name).trim() : old.name,
      description: body.description !== undefined ? String(body.description).trim() : old.description,
      weight: body.weight !== undefined ? Number(body.weight) || 0 : old.weight,
      height: body.height !== undefined ? Number(body.height) || 0 : old.height,
      base_experience: body.base_experience !== undefined ? Number(body.base_experience) || 0 : old.base_experience,
      abilities: body.abilities !== undefined ? parseAbilities(body.abilities) : old.abilities,
      stats: body.stats !== undefined ? parseStats(body.stats) : old.stats,
      image: body.image !== undefined ? String(body.image).trim() : old.image,
      cries: {
        latest: body.cry !== undefined ? String(body.cry).trim() : old.cries?.latest || ''
      }
    };

    await sql`
      UPDATE custom_pokemon SET
        name = ${updated.name},
        description = ${updated.description},
        weight = ${updated.weight},
        height = ${updated.height},
        base_experience = ${updated.base_experience},
        abilities = ${JSON.stringify(updated.abilities)}::jsonb,
        stats = ${JSON.stringify(updated.stats)}::jsonb,
        image = ${updated.image},
        cries = ${JSON.stringify(updated.cries)}::jsonb
      WHERE id = ${id}
    `;

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const deleted = await sql`DELETE FROM custom_pokemon WHERE id = ${id} RETURNING id`;
    if (!deleted.length) return res.status(404).json({ message: 'Custom Pokémon not found' });
    return res.status(200).json({ message: 'Custom Pokémon deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}