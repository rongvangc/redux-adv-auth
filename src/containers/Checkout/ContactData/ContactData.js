import React, {Component} from 'react';
import { connect } from 'react-redux'

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'

import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email',
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          option: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'},
          ]
        },
        value: 'fastest',
        validation: {},
        valid: true
      },
    },
    formIsValid: false,
  }
  

  orderHandler = (event) => {
    event.preventDefault();
    
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }

    // console.log(formData);
    
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData 
    }
    
    this.props.onOrderBurger(order, this.props.token)

  }

  checkValidity(value, rules) {
    let isValid = true;

    if( !rules ) {
      return true
    }

    if ( rules.required ) {
      isValid = value.trim() !== '' && isValid
    }

    if ( rules.minLength ) {
      isValid = value.length >= rules.minLength && isValid
    }

    if ( rules.maxLength ) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    ///// Hàm xử lý hành động cho input khi chạm, thay đổi, cập nhập...

    //Copy state
    const updatedOrderForm = {
      ...this.state.orderForm
    }

    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    } //inputIdentifier là key của state như : name, email, country ... 
    updatedFormElement.value = event.target.value;

    //check dữ liệu từ hàm checkValidity
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);  

    //Cập nhập khi click vào input
    updatedFormElement.touched = true;

    updatedOrderForm[inputIdentifier] = updatedFormElement;
    // console.log(updatedFormElement);

    //Kiểm tra Form Valid
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    // console.log(formIsValid)
    
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    // console.log(this.state.orderForm.deliveryMethod.validation);
    
  }

  render() {
    const formElementArray = [];
    for(let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }

    // console.log(formElementArray);
    
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {this.props.loading ? <Spinner /> : 
        <form onSubmit={this.orderHandler}>
          {formElementArray.map(formElement => (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              shouldValidate={formElement.config.validation}
              invalid={!formElement.config.valid}
              touched={formElement.config.touched}
              changed={(event) => this.inputChangedHandler(event, formElement.id)} />
          ))}
          <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
        </form>}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))