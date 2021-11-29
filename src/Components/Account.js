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
    // Main data (operations)
    const rows = props.rows;

    // Manage navigation between table pages
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const handleChangePage = (e, newPage) => setPage(newPage);
    
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    // Toggle and manage new operation form
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

    const handleNewOperation = (e) => {
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

    // Manage edit operation 
    const handleEditOperation = (data, rowId, columnId) => {                                                
        let newRows = [...rows];
        
        let editingRow = newRows.find(item => item.id === rowId);
        editingRow[columnId] = data;

        props.setRows({ rows: newRows });
    }

    // Manage delete operation
    const handleDeleteOperation = (rowId) => {
        let newRows = [...rows];
        
        const index = newRows.findIndex(item => item.id === rowId);
        newRows.splice(index, 1);
        
        props.setRows({ rows: newRows });
    }


    return (
        <Paper sx={{ display: props.visible ? 'block' : 'none' }}>
            <div className="Account-header">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <h3>
                        <EditableContent
                            content={ props.name }
                            submit={(data) => props.setRows({ name: data })}
                            delete={ props.delete }
                        />
                    </h3>

                    <div className="Account-totals">
                        <p style={{ color: 'green' }}>
                            Revenus
                            <span>{ props.totals.incomes }€</span>
                        </p>
                        <p style={{ color: 'red' }}>
                            Dépenses
                            <span>{ props.totals.expenses }€</span>
                        </p>
                        <p>
                            Balance
                            <span>{ props.totals.incomes + props.totals.expenses }€</span>
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Tooltip
                        title={ addForm ? "Annuler" : "Nouvelle opération" }
                        placement="left"
                        TransitionComponent={Zoom}
                    >
                        <div>
                        { addForm
                            ? <Cancel {...addFormProps} />
                            : <AddCircle {...addFormProps} />
                        }
                        </div>
                    </Tooltip>

                    <div
                        style={{
                            visibility: !addForm && 'hidden',
                            marginRight: '1em'
                        }}
                    >
                        <form
                            style={{ width: '100%' }}
                            onSubmit={ handleNewOperation }
                        >
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
            </div>

            <TableContainer
                className={ rows.length > 10 ? 'scrollable-y' : '' }
                sx={{
                    maxHeight: '79%',
                    overflowX: 'hidden',
                    marginRight: '0.6em',
                    paddingRight: '0.2em'
                }}
            >
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
                                            column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value
                                        }
                                        align={ column.align || 'default' }
                                        submit={(data) => handleEditOperation(data, row.id, column.id)}
                                        delete={() => handleDeleteOperation(row.id)}
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