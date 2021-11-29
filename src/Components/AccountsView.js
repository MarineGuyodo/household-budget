import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { AddCircle, Cancel } from '@mui/icons-material';

import Account from './Account';


function AccountsView(props) {
    // Toggle accounts visibiliyy
    const [visibles, toggleVisibles] = useState([...props.data].reduce(
        (a, b) => { return {...a, [b.id]: true } }, {}
    ));

    const handleToggleVisible = (elemId) => {
        const newVisibles = {...visibles};
        newVisibles[elemId] = !newVisibles[elemId];
        toggleVisibles(newVisibles);
    }

    // Handling scroll depending on mouse position
    const handleOnScroll = (e) => {
        if (!e.target.closest('.scrollable-y')) {
            document.querySelector('.Accounts-main').scrollLeft += e.deltaY;
        }
    }

    // Toggle and manage new account form
    const [newAccountForm, toggleNewAccountForm] = useState(false);
    const [newName, setNewName] = useState("");

    const newAccountFormProps = {
        color: newAccountForm ? 'warning' : 'success',
        fontSize: 'large',
        onClick: () => {
            toggleNewAccountForm(!newAccountForm);
            setNewName("");
        }
    }

    const handleNewAccount = (e) => {
        e.preventDefault();

        let allAccounts = [...props.data];
        let highestId = [...allAccounts].sort((a, b) => b.id - a.id)[0]['id'] + 1;
        
        allAccounts.push({ id: highestId, name: newName, rows: [] });

        props.setData(allAccounts);
        setNewName("");
        toggleNewAccountForm(false);
        toggleVisibles({...visibles, [highestId]: true });
    }

    // Manage edit account (only name for the moment)
    const handleEditAccount = (obj, accountId) => {
        let allAccounts = [...props.data];

        let accountIndex = allAccounts.findIndex(item => item.id === accountId);
        Object.keys(obj).forEach(key => allAccounts[accountIndex][key] = obj[key]);

        props.setData(allAccounts);
    }

    // Manage delete account
    const handleDeleteAccount = (accountId) => {
        let allAccounts = [...props.data];
        
        const accountIndex = allAccounts.findIndex(item => item.id === accountId);
        allAccounts.splice(accountIndex, 1);

        props.setData(allAccounts);
    }


    return (
    <>
        <nav className="Accounts-toolbar">
            <Tooltip
                title={ newAccountForm ? "Annuler" : "Nouveau compte" }
                placement="left"
                TransitionComponent={Zoom}
            >
                <div>
                { newAccountForm
                    ? <Cancel {...newAccountFormProps} />
                    : <AddCircle {...newAccountFormProps} />
                }
                </div>
            </Tooltip>

            <div style={{ display: !newAccountForm && 'none', marginRight: '1em' }}>
                <form onSubmit={ handleNewAccount }>
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
            <Tooltip
                key={ elem.id }
                title={ visibles[elem.id] ? "Masquer" : "Afficher" }
                placement="bottom"
                TransitionComponent={Zoom}
            >
                <p
                    className='Accounts-toolbar-btn'
                    style={{
                        color: visibles[elem.id] === true ? 'black' : 'grey',
                        opacity: visibles[elem.id] === true ? '1' : '0.8'
                    }}
                    onClick={() => handleToggleVisible(elem.id)}
                >{ elem.name }</p>
            </Tooltip>
        ))}
        </nav>

        <main
            className="Accounts-main"
            style={{ columnGap: '1em' }}
            onWheel={ handleOnScroll }
        >
        { props.data.map((account) => (
            <Account
                key={ account.id }
                visible={ visibles[account.id] }
                name={ account.name }
                totals={ props.totals[account.id] }
                rows={ account.rows }
                setRows={(obj) => handleEditAccount(obj, account.id)}
                delete={() => handleDeleteAccount(account.id)}
            />
        ))}
        </main>
    </>
    );
  }
  
  export default AccountsView;