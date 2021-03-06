import logo from './logo512.png';
import './App.css';

import seeding from './Data/seeding.json';

import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { Balance, Euro, Receipt } from '@mui/icons-material';

import AccountsView from './Components/AccountsView';


const calculateTotals = (accounts) => {
  const totals = {
    all: {
      incomes: 0,
      expenses: 0
    }
  };

  [...accounts].forEach(account => {   
    const result = account.rows.reduce((obj, current) => {
      if (current.value < 0) {
        obj.expenses += parseInt(current.value);
      } else {
        obj.incomes += parseInt(current.value);
      }
      
      return obj;
    }, { incomes: 0, expenses: 0 });

    totals[account.id] = result;
    totals.all.incomes += result.incomes;
    totals.all.expenses += result.expenses;
  });
  
  totals.all.balance = totals.all.incomes + totals.all.expenses;
  return totals;
};


function App() {
  const [data, setData] = useState(seeding);
  const totals = calculateTotals(data);
  const { balance, incomes, expenses } = totals.all;
  
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">
          <img src={logo} className="App-logo" alt="logo" />
          <span>
            Household
          </span>
          Budget
        </h1>
        
        <nav>
          <div className="App-summary">
            <Tooltip
                title={ "Revenus" }
                placement="top"
                TransitionComponent={Zoom}
            >
              <div key='incomes'>
                <Euro />
                { incomes }
              </div>
            </Tooltip>

            <Tooltip
                title={
                  "Dépenses (" + parseInt(expenses / incomes * 100) + "% des revenus)" }
                placement="top"
                TransitionComponent={Zoom}
            >
              <div key='expenses'>
                <Receipt />
                { expenses }
              </div>
            </Tooltip>

            <Tooltip
                title={ "Balance" }
                placement="top"
                TransitionComponent={Zoom}
            >
              <div>
                <Balance />
                { balance }
              </div>
            </Tooltip>
          </div>

          <h2>Saisie des données</h2>
          <p className="App-link">Comptes</p>
          <p className="App-link">Projets</p>

          <h2>Redistribution</h2>
          <p className="App-link">Selon modèle</p>
          <p className="App-link">Selon pourcentage</p>
        </nav>

        <footer className="App-footer">
          <p className="App-link">Mentions légales</p>
          <p>-</p>
          <p className="App-link">Contact</p>
        </footer>
      </header>

      <div className="App-main">
        <AccountsView
          data={ data }
          setData={ setData }
          totals={ totals }
        />
      </div>
    </div>
  );
}

export default App;
