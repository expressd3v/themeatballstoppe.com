import React, { useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import addZero from '../../../../../utilities/add-zero';
import ItemStore from '../../../stores/item-store';
import OrderStore from '../../../stores/order-store';

const Container = styled.div<{ ready: boolean; highlightColor: string }>`
  position: sticky;
  height: 70px;
  background-color: #b37f7e;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transition: all 500ms;
  user-select: none;
  cursor: not-allowed;

  ${({ ready, highlightColor }) =>
    ready &&
    `
      background-color: #902e2d;
      cursor: pointer;
      &:hover {
        background-color: ${highlightColor};
      }
  `};
`;

const CartCountContainer = styled.div`
  position: absolute;
  left: 20px;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Price = styled.div`
  position: absolute;
  right: 20px;
`;

const CountBtn = styled.div<{ ready: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${({ ready }) => ready && '#9a4645'};
  &:hover {
    cursor: pointer;
  }
`;

const Number = styled.span`
  font-size: 22px;
  margin: 0 10px;
`;

interface AddToCartProps {
  itemStore: ItemStore;
  closeFunc: () => void;
}

export const AddToCart = observer(({ itemStore, closeFunc }: AddToCartProps) => {
  const [cartCount, setCartCount] = useState(1);
  const [highlightColor, setHighlightColor] = useState('#ae3635');
  const itemTotal = itemStore.total * cartCount;

  const addItemsToCart = () => {
    if (itemStore.readyForCart) {
      for (let i = 0; i < cartCount; i++) {
        OrderStore.addToCart(itemStore);
      }
      closeFunc();
    }
  };

  return (
    <Container highlightColor={highlightColor} ready={itemStore.readyForCart} onClick={addItemsToCart}>
      <CartCountContainer
        onMouseEnter={() => itemStore.readyForCart && setHighlightColor('#902e2d')}
        onMouseLeave={() => itemStore.readyForCart && setHighlightColor('#ae3635')}
        onClick={(e) => e.stopPropagation()}
      >
        <CountBtn ready={itemStore.readyForCart} onClick={() => cartCount > 1 && setCartCount(cartCount - 1)}>
          -
        </CountBtn>
        <Number>{cartCount}</Number>
        <CountBtn ready={itemStore.readyForCart} onClick={() => setCartCount(cartCount + 1)}>
          +
        </CountBtn>
      </CartCountContainer>
      <span>{itemStore.readyForCart ? 'Add to Cart' : <i>Make selections</i>}</span>
      <Price>${addZero(parseFloat(itemTotal.toFixed(2)))}</Price>
    </Container>
  );
});
