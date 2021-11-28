import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { AddCircle, Cancel } from '@mui/icons-material';

import Account from './Account';


function AccountsView(props) {
    const [visibles, toggleVisibles] = useState(
        [...props.data].reduce((a, b) => {
            a[b.id] = true;
            return a;
        }, {})
    );

    const [addForm, toggleAddForm] = useState(false);
    const [newName, setNewName] = useState("");

    const addFormProps = {
        fontSize: 'large',
        color: addForm ? 'warning' : 'success',
        onClick: () => {
            toggleAddForm(!addForm);
            setNewName("");
        }
    }

    const handleAddAccountSubmit = (e) => {
        e.preventDefault();

        let allAccounts = [...props.data];
        
        let highestId = 0;
        allAccounts.forEach(elem => {
            if (elem.id > highestId) highestId = elem.id;
        });
        
        allAccounts.push({
            id: highestId + 1,
            name: newName,
            rows: []
        });

        props.setData(allAccounts);
        setNewName("");
        toggleAddForm(false);
        toggleVisibles({...visibles, [highestId + 1]: true });
    }


    return (
    <>
        <nav
            style={{
                display: 'flex',
                height: '10%',
                boxSizing: 'border-box',
                padding: '1em',
                alignItems: 'center',
                columnGap: '1em',
                backgroundColor: 'rgba(255, 187, 0, 0.2)',
                boxShadow: '14px 0px 14px 10px lightgrey'
            }}
        >
            <Tooltip
                title={ addForm ? "Annuler" : "Nouveau compte" }
                placement="left"
                TransitionComponent={Zoom}
            >
                { addForm
                    ? <Cancel {...addFormProps} />
                    : <AddCircle {...addFormProps} />
                }
            </Tooltip>

            <div style={{ visibility: !addForm && 'hidden', marginRight: '1em' }}>
                <form onSubmit={ handleAddAccountSubmit }>
                    <input
                        type="text"
                        placeholder="Nom du nouveau compte"
                        value={ newName }
                        onChange={(e) => setNewName(e.target.value)}
                        autoFocus
                    ></input>
                    <input
                        type="submit"
                        value="Créer"
                    ></input>
                </form>
            </div>

        { props.data.map(elem => (
            <p
                key={ elem.id }
                style={{ color: visibles[elem.id] === true ? 'green' : 'red' }}
                onClick={() => {
                    const newVisibles = {...visibles};
                    newVisibles[elem.id] = !newVisibles[elem.id];
                    toggleVisibles(newVisibles);
                }}
            >{ elem.name }</p>
        ))}
        </nav>

        <main
            className="App-main"
            style={{ columnGap: '1em' }}
        >
        { props.data.map((account) => (
        <Account
            key={ account.id }
            visible={ visibles[account.id] }
            name={ account.name }
            totals={ props.totals[account.id] }
            rows={ account.rows }
            setRows={(obj) => {
                let newData = [...props.data];

                let index = newData.findIndex(item => item.id === account.id);
                Object.keys(obj).forEach(key => newData[index][key] = obj[key]);

                props.setData(newData);
            }}
            delete={() => {
                let allAccounts = [...props.data];
                
                const index = allAccounts.findIndex(item => item.id === account.id);
                allAccounts.splice(index, 1);

                props.setData(allAccounts);
            }}
        />
        ))}
        </main>
    </>
    );
  }
  
  export default AccountsView;