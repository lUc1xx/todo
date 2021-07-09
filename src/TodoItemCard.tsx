import {useCallback, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import {makeStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {TodoItem, useTodoItems} from './TodoItemsContext';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from "@material-ui/core/TextField";
import CancelIcon from '@material-ui/icons/Cancel';

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
});

const TodoItemCard = function ({item}: { item: TodoItem }) {
    const classes = useTodoItemCardStyles();
    const {dispatch} = useTodoItems();

    const [editingData, setEditingData] = useState({
        state: false,
        title: item.title,
        details: item.details
    });

    const handleDelete = useCallback(
        () => dispatch({type: 'delete', data: {id: item.id}}),
        [item.id, dispatch],
    );

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: {id: item.id},
            }),
        [item.id, dispatch],
    );

    const handleToggleEdit = (): void => {
        setEditingData(prev => ({...prev, state: !prev.state}));
    };

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEditingData(prev => ({...prev, title: e.target.value}));
    };

    const handleChangeDetails = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEditingData(prev => ({...prev, details: e.target.value}));
    };

    const saveDispatch = useCallback(
        () =>
            dispatch({
                type: 'edit',
                data: {
                    id: item.id,
                    title: editingData.title,
                    details: editingData.details
                },
            }),
        [item.id, dispatch, editingData],
    );

    const handleSave = () => {
        saveDispatch();
        handleToggleEdit();
    };

    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                action={
                    <>
                        {editingData.state ?
                            <>
                                <IconButton aria-label="save" color="primary" onClick={handleSave}>
                                    <SaveIcon/>
                                </IconButton>
                                <IconButton aria-label="cancel" onClick={handleToggleEdit}>
                                    <CancelIcon/>
                                </IconButton>
                            </>
                            :
                            <IconButton color="primary" aria-label="edit" onClick={handleToggleEdit}>
                                <EditIcon/>
                            </IconButton>
                        }
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon/>
                        </IconButton>
                    </>
                }
                title={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={item.done}
                                onChange={handleToggleDone}
                                name={`checked-${item.id}`}
                                color="primary"
                            />
                        }
                        label={
                            <>
                                {editingData.state ?
                                    <TextField
                                        value={editingData.title}
                                        onChange={handleChangeTitle}
                                        fullWidth={true}
                                        multiline={true}
                                    />
                                    :
                                    item.title
                                }
                            </>
                        }
                    />
                }
            />

            <CardContent>
                {editingData.state ?
                    <TextField
                        value={editingData.details}
                        onChange={handleChangeDetails}
                        fullWidth={true}
                        multiline={true}
                    />
                    :
                    item.details ?
                        <Typography variant="body2" component="p">
                            {item.details}
                        </Typography>
                        :
                        null
                }
            </CardContent>
        </Card>
    );
};

export default TodoItemCard;