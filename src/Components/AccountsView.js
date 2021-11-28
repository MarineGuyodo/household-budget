import Account from './Account';


function AccountsView(props) {    
    return (
    <>
        <nav
            style={{
                display: 'flex',
                height: '10%',
                padding: '1em',
                columnGap: '1em',
                backgroundColor: 'rgba(255, 187, 0, 0.2)',
                boxShadow: '14px 0px 14px 10px lightgrey',
                boxSizing: 'border-box'
            }}
        >
        { props.data.map(elem => {
            return (
            <p key={ elem.id }>{ elem.name }</p>
            )
        })}
        </nav>

        <main
            className="App-main"
            style={{ columnGap: '1em' }}
        >
        { props.data.map((account) => {
            return (
            <Account
                key={ account.id }
                name={ account.name }
                totals={ props.totals[account.id] }
                rows={ account.rows }
                setRows={(obj) => {
                let newData = [...props.data];

                let index = newData.findIndex(item => item.id === account.id);

                Object.keys(obj).forEach(key => newData[index][key] = obj[key]);

                props.setData(newData);
                }}
            />
            )
        })}
        </main>
    </>
    );
  }
  
  export default AccountsView;