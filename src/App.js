import logo from './logo512.png';
import './App.css';

import Account from './Components/Account';

function App() {
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

      <main className="App-main">
        <p>Main part</p>

        <Account
          name="Compte 1"
        />
      </main>
    </div>
  );
}

export default App;
