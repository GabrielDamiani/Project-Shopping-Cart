import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductById } from '../services/api';

export default class ProductDetails extends Component {
  state = {
    product: {},
    cartItems: [],
    validateInput: false,
    email: '',
    text: '',
    rating: '',
    reviews: [],
  };

  async componentDidMount() {
    const { match: { params: { id } } } = this.props;
    const localCartItems = JSON.parse(localStorage.getItem('cartItems'));
    const localReviews = JSON.parse(localStorage.getItem(id));
    if (localCartItems !== null) {
      this.setState({ cartItems: localCartItems });
    }

    if (localReviews !== null) {
      this.setState({ reviews: localReviews });
    }

    const data = await getProductById(id);
    this.setState({
      product: data,
    });
  }

  saveToLocalStorage = () => {
    const { cartItems } = this.state;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  addToCart = ({ id, title, price, thumbnail }) => {
    const { cartItems } = this.state;
    const cartItemsCopy = cartItems;
    let item;
    if (cartItems) {
      item = cartItemsCopy.find((product) => product.id === id);
    }

    if (!item) {
      cartItemsCopy.push({
        id,
        title,
        price,
        thumbnail,
        quantity: 1,
      });
    } else {
      item.quantity += 1;
    }

    const newCartItems = cartItemsCopy;
    this.setState({ cartItems: [...newCartItems] }, () => {
      this.saveToLocalStorage();
    });
  };

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleRadio = ({ target }) => {
    this.setState({ rating: target.value });
  };

  saveToLocalReview = (id) => {
    const { reviews } = this.state;
    localStorage.setItem(id, JSON.stringify(reviews));
  };

  validateInput = ({ id }) => {
    const { email, rating, reviews, text } = this.state;
    const isNotValidate = email.length && rating.length <= 0;
    const newReviews = [...reviews,
      {
        email,
        text,
        rating,
      },
    ];
    if (isNotValidate) {
      this.setState({ validateInput: true });
    } else {
      this.setState({ validateInput: false, reviews: newReviews }, () => {
        this.saveToLocalReview(id);
        this.setState({
          email: '',
          rating: '',
          text: '',
        });
      });
    }
  };

  render() {
    const { product, email, validateInput, reviews, text, cartItems } = this.state;
    const getQuantityProductInCard = () => {
      let quantityCart = 0;
      cartItems.forEach((item) => {
        quantityCart += item.quantity;
      });
      return quantityCart;
    };

    return (
      <div>
        {/* <img
          src={ kisspng
          alt="imagem Goku"
          onClick={ Link }
        /> */}
        <section>
          <img
            data-testid="product-detail-image"
            src={ product.thumbnail }
            alt={ product.title }
          />
          <h1 data-testid="product-detail-name">{product.title}</h1>
          <p data-testid="product-detail-price">{product.price}</p>
          <button
            data-testid="product-detail-add-to-cart"
            type="button"
            onClick={ () => this.addToCart(product) }
          >
            Adiciona ao carrinho
          </button>
          <Link data-testid="shopping-cart-button" to="/shopping-cart">Carrinho</Link>
          <span data-testid="shopping-cart-size">{getQuantityProductInCard()}</span>
        </section>

        <section>
          <h2>Avaliações</h2>
          <form onSubmit={ (e) => e.preventDefault() }>
            <label htmlFor="email">
              Email
              <input
                type="email"
                placeholder="Informe seu email"
                data-testid="product-detail-email"
                onChange={ this.handleChange }
                value={ email }
                name="email"
              />
            </label>
            <label htmlFor="rate">
              <input
                type="radio"
                name="rating"
                data-testid="1-rating"
                onChange={ this.handleRadio }
                value="1"
              />
              <input
                type="radio"
                name="rating"
                data-testid="2-rating"
                onChange={ this.handleRadio }
                value="2"
              />
              <input
                type="radio"
                name="rating"
                data-testid="3-rating"
                onChange={ this.handleRadio }
                value="3"
              />
              <input
                type="radio"
                name="rating"
                data-testid="4-rating"
                onChange={ this.handleRadio }
                value="4"
              />
              <input
                type="radio"
                name="rating"
                data-testid="5-rating"
                onChange={ this.handleRadio }
                value="5"
              />
            </label>
            <label htmlFor="description">
              Descreva sua avaliação
              <textarea
                cols="30"
                rows="5"
                data-testid="product-detail-evaluation"
                onChange={ this.handleChange }
                name="text"
                value={ text }
              />
            </label>
            <button
              type="button"
              data-testid="submit-review-btn"
              onClick={ () => this.validateInput(product) }
            >
              Enviar
            </button>
            {validateInput && <span data-testid="error-msg">Campos inválidos</span>}
          </form>

          {reviews ? reviews.map((review) => (
            <div key={ review.text }>
              <p data-testid="review-card-email">{review.email}</p>
              <p data-testid="review-card-rating">{review.rating}</p>
              <p data-testid="review-card-evaluation">{review.text}</p>
            </div>
          )) : null}
        </section>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.string,
}.isRequired;
