import React, { useContext } from 'react'
import './header.css';
import { Link } from 'react-router-dom';
import { Context as MainContext } from '../context/mainContext';
import { Badge } from 'reactstrap'
import colors from '../assests/colors';

export default function Header() {
  const { state: { items, credit } } = useContext<any>(MainContext);
  return (
    <nav className="header">
      <div>
        <Link to="/" className="header-title">Vending Machine</Link>
      </div>
      <div>
        <ul className="header_list">
          {
            items.map((list: any, index: number) => {
              return <li key={index}>
                {list.name}
              </li>
            })
          }
          <li>
            <Badge color="light">Coins
             <span style={{ fontWeight: 'bold', color: colors.lightBlue, paddingLeft: 10 }}>
                {credit?.credit}
              </span>
            </Badge>
          </li>
        </ul>
      </div>
    </nav>
  )
}
