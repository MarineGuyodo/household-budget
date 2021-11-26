import { useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

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

const rows = [
    { name: 'Loyer', value: '-450' },
    { name: 'Courses', value: '-300' },
    { name: 'Carburant', value: '-120' },
    { name: 'Salaire', value: '1450' },
    { name: 'Assurance auto', value: '-75' },
    { name: 'Assurance habitation', value: '-25' },
    { name: 'Aide famille', value: '150' }
];

const calculateTotals = () => {
    return [...rows].reduce((acc, current) => {
        if (current.value[0] === '-') {
            acc.expenses += parseInt(current.value);
        } else {
            acc.incomes += parseInt(current.value);
        }

        return acc;
    }, { incomes: 0, expenses: 0 });
}
  
export default function Account(props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totals = calculateTotals();
  
    const handleChangePage = (e, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (e) => {
      setRowsPerPage(+e.target.value);
      setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <div className="App-account-header">
                <h3>
                    <EditableContent
                        content={ props.name }
                    />
                </h3>

                <div className="App-account-totals">
                    <p>Total : { totals.incomes + totals.expenses }€</p>
                    <p style={{ color: 'green' }}>Revenus : { totals.incomes }€</p>
                    <p style={{ color: 'red' }}>Dépense : { totals.expenses }€</p>
                </div>
            </div>

            <TableContainer sx={{ maxHeight: '80%' }}>
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
                    {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, i) => {
                        const rowKey = "row" + i;
                        const color = row.value[0] === "-" ?
                            'rgba(255, 0, 0, 0.25)' :
                            'rgba(0, 255, 0, 0.25)';
                        
                        return (
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={rowKey}
                            >
                            {columns.map((column) => { 
                                const value = row[column.id];
                                // const cellKey = rowKey + column.id;
                                // console.log('CellKey:', cellKey);

                                return (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ 'backgroundColor': color }}
                                >
                                    <EditableContent
                                        content={
                                            column.format && typeof value === 'number' ?
                                                column.format(value) :
                                                value
                                        }
                                        align={{
                                            vertical: '-50%',
                                            horizontal: column.align === 'right' ? '-50%' : '0'
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