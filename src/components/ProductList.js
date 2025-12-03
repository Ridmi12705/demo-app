import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vercel API endpoint එකට Call කරන්න
    // Local development වලදී, එය http://localhost:3000/api/data වනු ඇත.
    // Production වලදී, එය /api/data වනු ඇත.
    fetch('/api/data') 
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProducts(data.data); // data.rows වෙනුවට data.data භාවිතා කරන්න
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <h1>Loading Products...</h1>;
  
  return (
    <div>
      <h2>Products from Neon DB</h2>
      {products.map(product => (
        // ඔබගේ Table column names (id, name, price) මෙහි භාවිතා කරන්න
        <p key={product.id}>
          {product.name} - ${product.price}
        </p>
      ))}
    </div>
  );
}

export default ProductList;