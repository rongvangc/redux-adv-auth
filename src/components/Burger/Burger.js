import React from 'react'
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

import { withRouter } from 'react-router-dom'

const Burger = (props) => {
  //Chuyển state từ Obj thành Array
  // let transformedIngredients = [];
  // for (let key in props.ingredients) {
  //   for (let i = 0; i < props.ingredients[key]; i++) {
  //     transformedIngredients.push(<BurgerIngredient key={key + i} type={key} />);
  //   }
  // }
  // console.log(props);
  let transformedIngredients = Object.keys( props.ingredients )
  .map( igKey => {
      return [...Array( props.ingredients[igKey] )].map( ( _, i ) => {
          return <BurgerIngredient key={igKey + i} type={igKey} />;
      } );
  } )
  .reduce((arr, el) => {
      return arr.concat(el)
  }, []);

  console.log(transformedIngredients);

  if(transformedIngredients.length === 0) {
    transformedIngredients = <p>Please Start adding ingredient</p>
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default withRouter(Burger)