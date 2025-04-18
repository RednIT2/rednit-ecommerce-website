import React from 'react';
import '../App.css';

export function ShoeList({ shoes }) {
  return (
    <div className="shoe-list">
      <h2>Shoe List</h2>
      <div className="shoe-cards">
        {shoes.map((shoe) => (
          <div className="shoe-card" key={shoe._id}>
            <img src={shoe.image} alt={shoe.name} className="shoe-image" />
            <div className="shoe-details">
              <h3>{shoe.name}</h3>
              <p>Type: {shoe.type}</p>
              <p>Sizes: {shoe.sizes.join(', ')}</p>
              <p>Color: {shoe.color}</p>
              <p>Price: ${shoe.price}</p>
              <p>Stock: {shoe.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}