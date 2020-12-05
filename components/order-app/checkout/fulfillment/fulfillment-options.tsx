import React from 'react';
import OrderStore from '../../stores/order-store';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

import FulfillmentInput from './fulfillment-input';
import DeliveryAutocomplete from './delivery-autocomplete';
import { getNextAvailableFulfillmentDateStr, getOneYearFromTodayStr } from '../../stores/date-utils';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;

  > div {
    margin: 0 5px 10px 5px;
  }
`;

const PickupLocation = styled.div`
  width: 100%;
  font-style: italic;
  color: #902e2d;
  font-size: 16px;
`;

const RedAnchor = styled.a`
  color: #902e2d;
  text-decoration: underline;
`;

const FulfillmentOptions = observer(() => {
  return (
    <Container>
      <FulfillmentInput
        title={OrderStore.fulfillment.option === 'delivery' ? 'Delivery contact' : 'Name'}
        type="text"
        value={OrderStore.fulfillment.contactName}
        setFunc={(val) => OrderStore.fulfillment.setContactName(val)}
      />
      <FulfillmentInput
        title="phone #"
        type="tel"
        value={OrderStore.fulfillment.contactNumber}
        setFunc={(val) => OrderStore.fulfillment.setContactNumber(val)}
      />
      <FulfillmentInput
        title={`${OrderStore.fulfillment.option} date`}
        type="date"
        value={OrderStore.fulfillment.dateStore.fulfillmentDate}
        setFunc={(val) => OrderStore.fulfillment.dateStore.setFulfillmentDate(val)}
        error={OrderStore.fulfillment.dateStore.fulfillmentDateError}
        min={getNextAvailableFulfillmentDateStr()}
        max={getOneYearFromTodayStr()}
      />
      <FulfillmentInput
        title={`${OrderStore.fulfillment.option} time`}
        type="time"
        error={OrderStore.fulfillment.dateStore.fulfillmentTimeError}
        value={OrderStore.fulfillment.dateStore.fulfillmentTime}
        setFunc={(val) => OrderStore.fulfillment.dateStore.setFulfillmentTime(val)}
        step="300"
      />
      {OrderStore.fulfillment.option === 'delivery' && (
        <>
          <FulfillmentInput
            title="Number of guests"
            type="number"
            value={String(OrderStore.fulfillment.numberOfGuests)}
            setFunc={(val) => OrderStore.fulfillment.setNumberOfGuests(val)}
          />
          <DeliveryAutocomplete />
        </>
      )}
      <FulfillmentInput
        title="Any special instructions?"
        type="text"
        value={OrderStore.fulfillment.specialInstructions}
        setFunc={(val) => OrderStore.fulfillment.setSpecialInstructions(val)}
      />
      {OrderStore.fulfillment.option !== 'delivery' && (
        <PickupLocation>
          You can pick it up at the register at the Meatball Stoppe:{' '}
          <RedAnchor href="https://goo.gl/maps/RcCxxDcBH1Vfo2Zz7" target="_blank" rel="noopener noreferrer">
            7325 Lake Underhill Road
          </RedAnchor>
        </PickupLocation>
      )}
    </Container>
  );
});

export default FulfillmentOptions;
