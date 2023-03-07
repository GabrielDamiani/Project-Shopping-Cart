import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default class ShoppingCart extends Component {
  state = {
    cartItems: [],
  };

  componentDidMount() {
    const localCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (localCartItems !== undefined) {
      this.setState({ cartItems: localCartItems });
    }
  }

  saveToLocalStorage = () => {
    const { cartItems } = this.state;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  increaseQuantity = ({ id, stock }) => {
    const { cartItems } = this.state;
    const cartItemsCopy = cartItems;
    const item = cartItemsCopy.find((product) => product.id === id);
    if (item.quantity < stock) {
      item.quantity += 1;
    }
    const newCartItems = cartItemsCopy;
    this.setState({ cartItems: [...newCartItems] }, () => {
      this.saveToLocalStorage();
    });
  };

  decreaseQuantity = ({ id }) => {
    const { cartItems } = this.state;
    const cartItemsCopy = cartItems;
    const item = cartItemsCopy.find((product) => product.id === id);
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
    const newCartItems = cartItemsCopy;
    this.setState({ cartItems: [...newCartItems] }, () => {
      this.saveToLocalStorage();
    });
  };

  removeProduct = ({ id }) => {
    const { cartItems } = this.state;
    const cartItemsCopy = cartItems;
    const items = cartItemsCopy.filter((product) => product.id !== id);
    const newCartItems = items;
    if (newCartItems.length <= 0) {
      localStorage.clear();
      this.setState({ cartItems: null });
    } else {
      this.setState({ cartItems: [...newCartItems] }, () => {
        this.saveToLocalStorage();
      });
    }
  };

  render() {
    const { cartItems } = this.state;
    return (
      <div>
        { cartItems
          ? (
            cartItems.map((product) => (
              <div key={ product.id }>
                <ProductCard
                  name={ product.title }
                  price={ product.price }
                  image={ product.thumbnail }
                  id={ product.id }
                  shipping={ product.shipping }
                  quantity={ product.quantity }
                />
                <button
                  type="button"
                  data-testid="product-decrease-quantity"
                  onClick={ () => this.decreaseQuantity(product) }
                >
                  -
                </button>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <button
                  type="button"
                  data-testid="product-increase-quantity"
                  onClick={ () => this.increaseQuantity(product) }
                >
                  +
                </button>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={ () => this.removeProduct(product) }
                >
                  Remover
                </button>
                <hr />
              </div>
            ))
          )
          : <p data-testid="shopping-cart-empty-message">Seu carrinho está vazio</p>}

        {cartItems ? (
          <Link to="/checkout" data-testid="checkout-products">Finalizar Compra</Link>
        ) : null}
      </div>
    );
  }
}
