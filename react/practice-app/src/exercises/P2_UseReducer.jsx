import React, { useReducer } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Laptop', price: 999, emoji: '💻' },
  { id: 2, name: 'Phone', price: 699, emoji: '📱' },
  { id: 3, name: 'Headphones', price: 199, emoji: '🎧' },
  { id: 4, name: 'Watch', price: 299, emoji: '⌚' },
  { id: 5, name: 'Camera', price: 499, emoji: '📷' },
  { id: 6, name: 'Game Console', price: 399, emoji: '🎮' }
];

// TODO: Define action type constants:
// ADD_ITEM, REMOVE_ITEM, INCREMENT, DECREMENT, CLEAR_CART
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  CLEAR_CART: 'CLEAR_CART'
};

// TODO: Define initial state for cart:
// - items: array of { product, quantity }
// - totalItems: number
// - totalPrice: number
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// TODO: Implement cartReducer(state, action) to handle:
// - ACTIONS.ADD_ITEM: Add product to cart or increment quantity if already present. Update totalItems and totalPrice.
// - ACTIONS.REMOVE_ITEM: Remove product by id. Deduct its quantity from totalItems and cost from totalPrice.
// - ACTIONS.INCREMENT: Increment quantity of the item with the given id.
// - ACTIONS.DECREMENT: Decrement quantity (remove if quantity reaches 0). Update totalItems and totalPrice.
// - ACTIONS.CLEAR_CART: Reset to initialState.
// Note: Ensure all state updates are immutable.
function cartReducer(state, action) {
  switch (action.type) {
    // TODO: Implement action cases
    default:
      return state;
  }
}

export default function UseReducerCart() {
  // TODO: Initialize useReducer hook with cartReducer and initialState
  // const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      <div>
        <h2>Products</h2>
        <div>
          {PRODUCTS.map(product => (
            <div key={product.id}>
              <div>{product.emoji}</div>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              {/* TODO: Wire up Add to Cart button to dispatch ADD_ITEM with product */}
              <button /* onClick={() => dispatch({ type: ACTIONS.ADD_ITEM, payload: product })} */>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2>Shopping Cart</h2>
        {/* TODO: If state.items is empty, display empty message: */}
        <p>Your cart is empty.</p>

        {/* TODO: If state.items has items, render cart items and summary */}
        <div>
          {/* Map over state.items to render each cart item:
              <div key={item.product.id}>
                <div>
                  {item.product.emoji} {item.product.name}
                  <div>${item.product.price} x {item.quantity} = ${item.product.price * item.quantity}</div>
                </div>
                <div>
                  <button onClick={() => dispatch({ type: ACTIONS.DECREMENT, payload: item.product.id })}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch({ type: ACTIONS.INCREMENT, payload: item.product.id })}>+</button>
                  <button onClick={() => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: item.product.id })}>Remove</button>
                </div>
              </div>
          */}
          <div>
            <div>
              {/* Product emoji and name */}
              <div>{/* Subtotal: $price x quantity = $total */}</div>
            </div>
            <div>
              {/* TODO: Decrement button */}
              <button>-</button>
              <span>{/* item.quantity */}</span>
              {/* TODO: Increment button */}
              <button>+</button>
              {/* TODO: Remove button */}
              <button>Remove</button>
            </div>
          </div>

          <div>
            <p>Total Items: {/* state.totalItems */}</p>
            <p>Total Price: ${/* state.totalPrice */}</p>
            {/* TODO: Wire up Clear Cart button to dispatch CLEAR_CART */}
            <button /* onClick={() => dispatch({ type: ACTIONS.CLEAR_CART })} */>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
