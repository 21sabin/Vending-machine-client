import React, { useContext, useState } from 'react';
import { Context as MainContext } from '../../context/mainContext'
import './style.css';
import {
  Card, Button, CardHeader, CardFooter, CardBody,
  FormGroup, Input,
  Col, Badge, Label, Spinner
} from 'reactstrap';
import Coke from '../../assests/images/coca-cola.jpg';
import Dew from '../../assests/images/dew.jpg';
import Pepsi from '../../assests/images/pepsi.jpeg';
import colors from '../../assests/colors';
import { AlertInfo, CustomModal } from '../../common';

export const ProductList = () => {

  const {
    state: { credit, loading },
    buyItem,
    getItems,
    getCredits,
    refundItem } =
    useContext<any>(MainContext);
  const [itemState, setItemState] = useState<any>({
    coke: { quantity: '', totalPrice: '', price: '', disabled: true, itemId: '', refunded: false, items: [] },
    dew: { quantity: '', totalPrice: '', price: '', disabled: true, itemId: '', refunded: false, items: [] },
    pepsi: { quantity: '', totalPrice: '', price: '', disabled: true, itemId: '', refunded: false, items: [] }
  });
  const [showAlert, setAlert] = useState(false);
  const [msg, setMsg] = useState('');
  const [showModal, setModal] = useState(false);
  const [isError, setError] = useState<any>(false);
  const [refundedItem, setRefundedItem] = useState<any>({})

  const renderImage = (item: string) => {
    switch (item) {
      case 'dew':
        return <img src={Dew} alt="dew" className="item_list" />
      case 'coke':
        return <img src={Coke} alt="coke" className="item_list" />
      case 'pepsi':
        return <img src={Pepsi} alt="pepsi" className="item_list" />
      default:
        return null;
    }
  }

  const handleChange = (value: any, item: any, key: string) => {
    const name = item.name.toLowerCase()
    switch (key) {
      case 'quantity':
        setItemState(() => {
          return {
            ...itemState,
            [name]: {
              ...itemState[name],
              name,
              quantity: value,
              totalPrice: value * item.price,
              disabled: (itemState[name].price && itemState[name].quantity) ? false : true,
              itemId: item._id
            }
          }
        });
        break;
      case 'price': setItemState({
        ...itemState,
        [name]: {
          ...itemState[name],
          name,
          price: value,
          disabled: (itemState[name].price && itemState[name].quantity) ? false : true
        }
      });
        break;
      default: return;
    }
  }

  const resetState = () => {
    setMsg('');
    setAlert(false);
    setError(false)
  }

  const handleBuy = (selectedItem: any) => {
    resetState()
    const name = selectedItem.name.toLowerCase();
    const item = itemState[name.toLowerCase()];
    if (parseFloat(item.price) < parseFloat(item.totalPrice)) {
      setMsg(`Sorry! couldn't proceed. Insufficient fund`);
      setAlert(true)
      return
    }
    buyItem(item, (success: boolean, msg: string) => {
      if (success) {
        setItemState({
          ...itemState,
          [name]: {
            ...itemState[name],
            refunded: true,
            items: [item, ...itemState[name].items]
          }
        });
        setMsg(msg)
        getItems();
        getCredits();
      } else {
        setError(true)
        setMsg(msg)
      }
      setAlert(true);
    })
  }

  const handleRefund = (item: any) => {
    const selectedRefundedItem = itemState[item.name.toLowerCase()].items;
    if (selectedRefundedItem.length > 0) {
      setRefundedItem(selectedRefundedItem[0]);
      setModal(true)
    }
  }
  const renderItem = (item: any, index: number) => {
    const name = item.name.toLowerCase();
    return <Card key={index} className="item">
      <CardHeader>
        <div className="item-header">
          <div>
            {item.name}
            <p
              style={{
                display: 'inline',
                padding: 9,
                fontWeight: 'bold'
              }}>
              Rs{item.price}
            </p>
          </div>
          <div>
            Stock
            <Badge style={{
              backgroundColor: item.stock > 0 ? colors.lightBlue : 'red',
              padding: 6, marginLeft: 10
            }} >
              {item.stock}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            disabled={!itemState[name].refunded}
            onClick={() => handleRefund(item)}
            style={{ backgroundColor: '#3c6291', marginBottom: 10 }}
            size="sm">
            Refund
          </Button>
        </div>
        {renderImage(item.name.toLowerCase())}
        <div className='input-wrapper'>
          <FormGroup row>
            <Col sm={10}>
              <Input
                type="number"
                name="qty"
                value={itemState[name].quantity}
                placeholder="quantity"
                onChange={(event) => handleChange(event.target.value, item, 'quantity')}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type="text"
                name="text"
                disabled={true}
                value={itemState[name].totalPrice}
                placeholder="total price"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              <Input type="number"
                name="text"
                value={itemState[name].price}
                placeholder="price"
                onChange={(event) => handleChange(event.target.value, item, 'price')}
              />
            </Col>
          </FormGroup>
        </div>

      </CardBody>
      <CardFooter>
        <Button
          style={{ width: '100%', backgroundColor: colors.lightBlue }}
          disabled={credit?.credit == 0 || itemState[name].disabled || item.stock == 0}
          onClick={() => handleBuy(item)}
        >
          {item.stock > 0 ? 'Buy' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  }

  const removeRefundedItem = (data: any) => {
    const name = data.name.toLowerCase();
    itemState[name].items.shift();
    let newItemState = {
      ...itemState,
      [name]: {
        ...itemState[name],
        refunded: itemState[name].items.length > 0 ? true : false
      }
    }
    setItemState(newItemState)
  }

  const { state: { items } } = useContext<any>(MainContext);
  return (
    <>
      {
        showAlert &&
        <AlertInfo
          message={msg}
          color={!isError ? 'success' : 'danger'}
          show={showAlert}
          setAlert={setAlert}
        />
      }
      <CustomModal
        visible={showModal}
        title={`Refund ${refundedItem.name}`}
        refundItem={
          () => {
            resetState();
            refundItem(refundedItem, (success: boolean, msg: string) => {
              if (success) {
                setModal(false)
                setMsg(msg)
                getCredits();
                getItems();
                removeRefundedItem(refundedItem)
              } else {
                setError(true)
                setMsg(msg)
              }
              setAlert(true)
            })
          }
        }
        toggleModal={
          () => {
            setModal(!showModal)
          }
        }>
        <FormGroup row>
          <Col sm={10}>
            <div style={{ display: 'flex' }}>
              <Label for="examplePassword" sm={2}>Quantity</Label>
              <Input
                type="number"
                name="qty"
                disabled={true}
                className="input-style"
                value={refundedItem.quantity}
                placeholder="quantity"
                onChange={(event) => { }}
              />
            </div>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={10}>
            <div style={{ display: 'flex' }}>
              <Label for="examplePassword" sm={2}>Total Price</Label>
              <Input type="text"
                name="text"
                disabled={true}
                className="input-style"
                value={refundedItem?.totalPrice}
                placeholder="total price"
              />
            </div>
          </Col>
        </FormGroup>

      </CustomModal>
      <AlertInfo show={credit?.credit == 0}
        message={`Your cann't purchase item, you are out of coin`}
        color="warning"
      ></AlertInfo>
      <div className="product-list">

        {
          items.map((item: any, index: number) => {
            return renderItem(item, index)
          })
        }
      </div>
    </>
  )
}
