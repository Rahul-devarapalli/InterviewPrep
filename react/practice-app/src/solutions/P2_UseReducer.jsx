import React, { useReducer } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Laptop', price: 999, emoji: '💻' },
  { id: 2, name: 'Phone', price: 699, emoji: '📱' },
  { id: 3, name: 'Headphones', price: 199, emoji: '🎧' },
  { id: 4, name: 'Watch', price: 299, emoji: '⌚' },
  { id: 5, name: 'Camera', price: 499, emoji: '📷' },
  { id: 6, name: 'Game Console', price: 399, emoji: '🎮' }
];

// Key concept: action types constants prevent typo bugs
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  CLEAR_CART: 'CLEAR_CART'
};

const initialState = {
  items: [], // Array of { product, quantity }
  totalItems: 0,
  totalPrice: 0
};

// Key concept: reducer pattern. Calculates new state based on current state and action.
// Key concept: immutable state updates. Always return a new state object.
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(item => item.product.id === action.payload.id);
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity: newItems[existingItemIndex].quantity + 1 };
      } else {
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }
      return {
        ...state,
        items: newItems,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price
      };
    }
    case ACTIONS.REMOVE_ITEM: {
      const itemToRemove = state.items.find(item => item.product.id === action.payload);
      if (!itemToRemove) return state;
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.product.price * itemToRemove.quantity)
      };
    }
    case ACTIONS.INCREMENT: {
      const item = state.items.find(i => i.product.id === action.payload);
      return cartReducer(state, { type: ACTIONS.ADD_ITEM, payload: item.product });
    }
    case ACTIONS.DECREMENT: {
      const itemIndex = state.items.findIndex(i => i.product.id === action.payload);
      const item = state.items[itemIndex];
      if (item.quantity === 1) {
        return cartReducer(state, { type: ACTIONS.REMOVE_ITEM, payload: action.payload });
      }
      const newItems = [...state.items];
      newItems[itemIndex] = { ...item, quantity: item.quantity - 1 };
      return {
        ...state,
        items: newItems,
        totalItems: state.totalItems - 1,
        totalPrice: state.totalPrice - item.product.price
      };
    }
    case ACTIONS.CLEAR_CART:
      return initialState;
    default:
      return state;
  }
}

// Key concept: when to use useReducer vs useState?
// useReducer is better when state logic is complex, involves multiple sub-values, 
// or when the next state depends on the previous state in complex ways.
export default function UseReducerCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
              <button onClick={() => dispatch({ type: ACTIONS.ADD_ITEM, payload: product })}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2>Shopping Cart</h2>
        {state.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {state.items.map(item => (
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
            ))}
            <div>
              <p>Total Items: {state.totalItems}</p>
              <p>Total Price: ${state.totalPrice}</p>
              <button onClick={() => dispatch({ type: ACTIONS.CLEAR_CART })}>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
