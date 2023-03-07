import { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import ProductCard from '../components/ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';

class Main extends Component {
  state = {
    productsList: [],
    categories: [],
    search: '',
    searchValidation: true,
    cartItems: [],
  };

  async componentDidMount() {
    const data = await getCategories();
    this.setState({ categories: data });
    const localCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (localCartItems !== null) {
      this.setState({ cartItems: localCartItems });
    }
  }

  handleChange = ({ target }) => {
    const { value } = target;
    this.setState({ search: value });
  };

  getProduct = async (id) => {
    const { search } = this.state;
    let data = '';
    if (id) {
      data = await getProductsFromCategoryAndQuery(id, null);
      this.setState({ productsList: data.results });
    }
    if (search) {
      data = await getProductsFromCategoryAndQuery(null, search);
      this.setState({ productsList: data.results, search: '' });
    }

    if (!data.length) {
      this.setState({ searchValidation: false });
    } else {
      this.setState({ searchValidation: true });
    }
  };

  saveToLocalStorage = () => {
    const { cartItems } = this.state;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  addToCart = ({ id, title, price, thumbnail, shipping, available_quantity: stock }) => {
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
        shipping,
        stock,
      });
    } else {
      item.quantity += 1;
    }

    const newCartItems = cartItemsCopy;
    this.setState({ cartItems: [...newCartItems] }, () => {
      this.saveToLocalStorage();
    });
  };

  render() {
    const { productsList, categories, search, searchValidation, cartItems } = this.state;
    const getQuantityProductInCard = () => {
      let quantityCart = 0;
      cartItems.forEach((item) => {
        quantityCart += item.quantity;
      });
      return quantityCart;
    };
    return (
      <div>
        <form onSubmit={ (e) => e.preventDefault() }>
          <label htmlFor="search">
            Pesquise o produto
            <input
              type="text"
              data-testid="query-input"
              id="searchCamp"
              onChange={ this.handleChange }
              value={ search }
            />
          </label>
          <button
            type="button"
            id="querryBtn"
            variant="outline-dark"
            data-testid="query-button"
            onClick={ this.getProduct }
          >
            Procurar
          </button>
        </form>
        <div>
          {productsList.length
            ? productsList.map((product) => (
              <div key={ product.id }>
                <ProductCard
                  name={ product.title }
                  price={ product.price }
                  image={ product.thumbnail }
                  shipping={ product.shipping }
                  id={ product.id }
                />
                <button
                  type="button"
                  data-testid="product-add-to-cart"
                  onClick={ () => this.addToCart(product) }
                >
                  Adicionar ao carrinho
                </button>
              </div>
            ))
            : null }

          {!searchValidation && productsList.length <= 0 ? (
            <p>Nenhum produto foi encontrado</p>
          ) : null }

          {searchValidation && (
            <span data-testid="home-initial-message">
              Digite algum termo de pesquisa ou escolha uma categoria.
            </span>
          )}
        </div>

        <div>
          {
            categories.map((category) => (
              <button
                type="button"
                key={ category.id }
                data-testid="category"
                onClick={ () => this.getProduct(category.id) }
              >
                {category.name}
              </button>
            ))
          }
        </div>
        <Link
          to="/shopping-cart"
        >
          <button
            data-testid="shopping-cart-button"
            type="button"
          >
            Carrinho
          </button>
          <span data-testid="shopping-cart-size">{getQuantityProductInCard()}</span>
        </Link>
      </div>
    );
  }
}

export default Main;
