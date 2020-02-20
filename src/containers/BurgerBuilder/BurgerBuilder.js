import React, { Component } from "react";
import { connect } from 'react-redux';

import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/'
import axios from '../../axios-orders';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  };

  componentDidMount() {
    console.log(this.props);
    this.props.onInitIngredients()
  }

  updatePurchaseState = ingredients => {
    //Chuyển state từ Obj thành Array
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0
  };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth')

    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase()
    this.props.history.push('/checkout')
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    //{salad: true; meat: false...}
    let burger = this.props.error ? <p>Ingredients cant be load</p> : <Spinner/>

    
    let orderSummary = null
    // if(this.state.loading) {
    //   orderSummary = <Spinner />
    // }

    if(this.props.ings) {
      burger = (
        <Auxiliary>
          <Burger ingredients={this.props.ings} />
            <BuildControls
              ingredientsAdded={this.props.onIngredientAdded}
              ingredientsRemoved={this.props.onIngredientRemoved}
              disabled={disabledInfo}
              price={this.props.price}
              purchasable={this.updatePurchaseState(this.props.ings)}
              ordered={this.purchaseHandler}
              isAuth={this.props.isAuthenticated}
            />
        </Auxiliary>
      )
      orderSummary = <OrderSummary
        ingredients={this.props.ings}
        totalPrice={this.props.price}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
      />
    }

    return (
      <Auxiliary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removedIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
