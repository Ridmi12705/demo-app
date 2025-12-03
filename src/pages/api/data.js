// pages/api/data.js (Modified)
import query from '../../lib/db'; 

export default async function handler(req, res) {
  // ---------------- GET METHOD (Read Data) ----------------
  if (req.method === 'GET') {
    // ... (පෙර තිබූ GET code එක) ...
    try {
      const result = await query('SELECT * FROM products ORDER BY id DESC'); // products Table එක භාවිතා කරයි
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch data.', error: error.message });
    }
  } 

  // ---------------- POST METHOD (Write Data) ----------------
  else if (req.method === 'POST') {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and Price are required.' });
    }

    try {
      // SQL Injection වලින් ආරක්ෂා වීමට Parameterized Query භාවිතා කරයි
      const text = 'INSERT INTO products(name, description, price) VALUES($1, $2, $3) RETURNING *';
      const values = [name, description, price];

      const result = await query(text, values);

      res.status(201).json({ success: true, message: 'Product added successfully.', data: result.rows[0] });
    } catch (error) {
      console.error('Database POST error:', error);
      res.status(500).json({ success: false, message: 'Failed to add product.', error: error.message });
    }
  } 

  // ---------------- METHOD NOT ALLOWED ----------------
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}