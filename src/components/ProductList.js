import React, { useState, useEffect } from 'react';

function ProductList() {
    // GET (Read) මෙහෙයුම සඳහා States
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // POST (Write) මෙහෙයුම සඳහා States
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [postMessage, setPostMessage] = useState('');

    // --- GET Data Function ---
    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/data') 
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setProducts(data.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    // Component එක Mount වන විට දත්ත load කරන්න
    useEffect(() => {
        fetchProducts();
    }, []); 

    // --- POST Data Function (Form Submit Logic) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setPostMessage('Adding product...');

        if (!name || !price) {
            setPostMessage('Error: Name and Price are required.');
            return;
        }

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    // Price එක number එකක් ලෙස යැවීම වැදගත්
                    price: parseFloat(price) 
                }),
            });

            const result = await response.json();

            if (result.success) {
                setPostMessage(`Success! Product: ${result.data.name} added.`);
                
                // නව Product එක ලැයිස්තුවට එකතු වී ඇත්දැයි බැලීමට නැවත fetch කරන්න
                fetchProducts(); 
                
                // Form එක clear කරන්න
                setName('');
                setPrice('');
                setDescription('');
            } else {
                setPostMessage(`Error adding product: ${result.message}`);
            }

        } catch (error) {
            setPostMessage(`Network Error: ${error.message}`);
        }
    };

    // --- Render Section ---
    if (loading) return <h1>Loading Products...</h1>;
    
    return (
        <div style={{ padding: '20px' }}>
            
            {/* === ADD PRODUCT FORM === */}
            <h2>Add New Product to Neon DB</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Product Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ margin: '5px', padding: '8px' }}
                />
                <input 
                    type="number" 
                    placeholder="Price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                    step="0.01"
                    style={{ margin: '5px', padding: '8px' }}
                />
                <textarea 
                    placeholder="Description (Optional)" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    style={{ margin: '5px', padding: '8px', display: 'block', width: '95%' }}
                />
                <button type="submit" style={{ margin: '5px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                    Add Product
                </button>
                {postMessage && <p style={{ marginTop: '10px', color: postMessage.includes('Error') ? 'red' : 'green' }}>{postMessage}</p>}
            </form>

            {/* === PRODUCT LIST === */}
            <h2>Products from Neon DB ({products.length})</h2>
            {products.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {products.map(product => (
                        <li key={product.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <strong>{product.name}</strong> - ${parseFloat(product.price).toFixed(2)}
                            <br/>
                            <small>{product.description || 'No description'}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found in the database. Add one above!</p>
            )}
        </div>
    );
}

export default ProductList;