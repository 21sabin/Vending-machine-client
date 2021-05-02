import React, { useContext, useEffect } from 'react'
import './home.css';
import VendingMachine from '../../assests/images/vendingMachine1.png';
import { Context as MainContext } from '../../context/mainContext';
import { ListGroup, ListGroupItem, Badge, Card, Button, CardTitle, CardText } from 'reactstrap';
import colors from '../../assests/colors';
import { AlertInfo } from '../../common/';

const Home = (props: any) => {
  const { history } = props;
  const { state: { items, credit, loading }, getItems, getCredits, loadData } = useContext<any>(MainContext);

  useEffect(() => {
    getItems();
    getCredits();
  }, []);

  const exploreProducts = () => {
    history.push('/products')
  }

  return (
    <>
      <AlertInfo show={credit.credit == 0}
        message="You are out of coin.Buy more coins"
        color="warning"
      >
        <Button
          style={{ backgroundColor: '#3c6291' }}
          size="sm"
          onClick={() => {
            loadData(() => {
              getItems();
              getCredits()
            })
          }}>
          {loading ? '...loading' : ' Load Data'}
        </Button>
      </AlertInfo>
      <div className="home">
        <div className="home_left">
          <Card body>
            <CardTitle tag="h5" >Welcome To our Vending Machine</CardTitle>
            <CardText>Explore our drinks and Enjoy</CardText>
            <Button
              style={{ backgroundColor: colors.lightBlue }}
              onClick={exploreProducts}>
              Explore
           </Button>
          </Card>
        </div>
        <div className="home_center">
          <img src={VendingMachine} alt="Vending Machine" />
        </div>
        <div className="home_right">
          <ListGroup>
            {
              items.map((item: any, index: number) => {
                return (
                  <>
                    <ListGroupItem key={index}
                      className="justify-content-between">
                      {item.name} (
                        <p
                        style={{
                          fontWeight: 'bold',
                          display: "inline"
                        }}>
                        Rs{item.price}
                      </p>)
                  <Badge
                        pill
                        style={{
                          backgroundColor: item.stock > 0 ? colors.lightBlue : 'red',
                          color: "white",
                          marginLeft: 10
                        }}>
                        {item.stock}
                      </Badge>
                    </ListGroupItem>
                  </>
                )
              })
            }
          </ListGroup>
        </div>
      </div >
    </>
  )
}

export { Home };
