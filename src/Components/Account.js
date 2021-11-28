import { useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { AddCircle, Cancel } from '@mui/icons-material';

import EditableContent from './EditableContent';


const columns = [
    // { id: 'date', label: 'Date', minWidth: 100 },
    { id: 'name', label: 'Intitulé', minWidth: 300 },
    {
      id: 'value',
      label: 'Montant',
      minWidth: 100,
      align: 'right',
      format: (value) => value.toLocaleString('fr-FR'),
    }
];

  
export default function Account(props) {
    const rows = props.rows;

    const [addForm, toggleAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState("");

    const addFormProps = {
        fontSize: 'large',
        color: addForm ? 'warning' : 'success',
        onClick: () => {
            toggleAddForm(!addForm);
            setNewName("");
            setNewValue("");
        }
    }

    const handleAddFormSubmit = (e) => {
        e.preventDefault();

        let newRows = [...rows];
        
        let highestId = 0;
        newRows.forEach(elem => {
            if (elem.id > highestId) highestId = elem.id;
        });
        
        newRows.push({
            id: highestId + 1,
            name: newName,
            value: newValue
        });

        props.setRows({ rows: newRows });
        setNewName("");
        setNewValue("");
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (e, newPage) => setPage(newPage);
  
    const handleChangeRowsPerPage = (e) => {
      setRowsPerPage(+e.target.value);
      setPage(0);
    };


    return (
        <Paper sx={{ overflow: 'hidden' }}>
            <div className="App-account-header">
                <div
                    style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}
                >
                    <h3>
                        <EditableContent
                            content={ props.name }
                            submit={(data) => props.setRows({ name: data })}
                            delete={ props.delete }
                        />
                    </h3>

                    <Tooltip
                        title={ addForm ? "Annuler" : "Nouvelle opération" }
                        placement="right"
                        TransitionComponent={Zoom}
                    >
                        { addForm
                            ? <Cancel {...addFormProps} />
                            : <AddCircle {...addFormProps} />
                        }
                    </Tooltip>

                    <div style={{ visibility: !addForm && 'hidden', marginRight: '1em' }}>
                        <form onSubmit={ handleAddFormSubmit }>
                            <input
                                type="text"
                                placeholder="Intitulé"
                                value={ newName }
                                onChange={(e) => setNewName(e.target.value)}
                                autoFocus
                            ></input>
                            <input
                                type="number"
                                placeholder="Montant"
                                step=".01"
                                value={ newValue }
                                onChange={(e) => setNewValue(e.target.value)}
                                autoFocus
                                style={{ width: '6em' }}
                            ></input>
                            <input
                                type="submit"
                                value="OK"
                            ></input>
                        </form>
                    </div>
                </div>

                <div className="App-account-totals">
                    <p>Balance : { props.totals.incomes + props.totals.expenses }€</p>
                    <p style={{ color: 'green' }}>Revenus : { props.totals.incomes }€</p>
                    <p style={{ color: 'red' }}>Dépenses : { props.totals.expenses }€</p>
                </div>
            </div>

            <TableContainer sx={{ maxHeight: '80%', overflowX: 'hidden', paddingRight: '0.5em' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    { rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            const color = row.value < 0
                                ? 'rgba(10, 46, 52, 0.4)'
                                : row.value > 0
                                    ? 'rgba(255, 187, 0, 0.4)'
                                    : 'lightgrey';
                            
                        return (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row.id}
                                style={{ 'backgroundColor': color }}
                            >
                            {columns.map((column) => { 
                                const value = row[column.id];

                                return (
                                <TableCell
                                    key={ column.id }
                                    align={ column.align }
                                >
                                    <EditableContent
                                        content={
                                            column.format && typeof value === 'number' ?
                                                column.format(value) :
                                                value
                                        }
                                        align={ column.align || 'default' }
                                        submit={(data) => {                                                
                                            let newRows = [...rows];
                                            
                                            let editingRow = newRows.find(item => item.id === row.id);
                                            editingRow[column.id] = data;

                                            props.setRows({ rows: newRows });
                                        }}
                                        delete={() => {
                                            let newRows = [...rows];
                                            
                                            const index = newRows.findIndex(item => item.id === row.id);
                                            newRows.splice(index, 1);
                                            
                                            props.setRows({ rows: newRows });
                                        }}
                                    />
                                </TableCell>
                                );
                            })}
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>

        { rows.length > 10 &&
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        }
        </Paper>
    );
}