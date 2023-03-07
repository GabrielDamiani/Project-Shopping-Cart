import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class ProductCard extends Component {
  render() {
    const { name, price, image, id, quantity, shipping } = this.props;

    return (
      <div data-testid="product">
        <Link data-testid="product-detail-link" to={ `/product-details/${id}` }>
          <img src={ image } alt={ name } />
          <h5 data-testid="shopping-cart-product-name">{name}</h5>
          <p>{price}</p>
          { quantity && <p data-testid="shopping-cart-product-quantity">{ quantity }</p> }
        </Link>
        {shipping && shipping.free_shipping && (
          <p data-testid="free-shipping">Frete Grátis</p>
        ) }
      </div>
    );
  }
}

ProductCard.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  image: PropTypes.string,
  quantity: PropTypes.number,
}.isRequired;
