import { useState } from 'react';

import { Cancel, CheckCircle, Delete, Edit } from '@mui/icons-material';

export default function Account(props) {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState("");

    let transform = "translate(";
    transform += (props?.align?.horizontal || 0) + ', ';
    transform += (props?.align?.vertical || 0) + ')';

    const handleChange = (e) => {
        // TODO: Validations will come later
        setValue(e.target.value);
    }

    const handleCancel = () => {
        setValue("");
        setEditMode(false);
    }

    const handleSubmit = () => {
        if (value !== "") {
            // console.log('Event on submit:', value);
            props.submit(value);
        }

        handleCancel();
    }


    return (
    <>{ editMode ?
        <form
            className="App-edit-form"
            style={{ transform }}
            onSubmit={ handleSubmit }
        >
            <input
                type="text"
                value={ value }
                placeholder={ props.content }
                onChange={ handleChange }
                autoFocus
            />

            <CheckCircle
                onClick={ handleSubmit }
                color="success"
            />

            <Cancel
                onClick={ handleCancel }
                color="warning"
            />
        </form> : <div className="icon-on-hover">
            { props.content }
            <div className="show-on-hover" >
                <Edit
                    onClick={() => setEditMode(!editMode)}
                />
                <Delete
                    onClick={() => {
                        window.confirm(
                            'Voulez-vous vraiment supprimer cette opération ?'
                        ) && props.delete();
                    }}
                />
            </div>
        </div>
    }</>
    );
};