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
import {motion} from 'framer-motion';
import {TodoItem, useTodoItems} from './TodoItemsContext';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const TodoItemsList = function () {
    const {todoItems, dispatch} = useTodoItems();

    const classes = useTodoItemListStyles();

    function onDragEnd(result: any) {
        console.log(result)
        if (!result.destination) return;

        if (result.destination.index === result.source.index) return;

        const test = reorder(
            todoItems,
            result.source.index,
            result.destination.index
        );

        dispatch({type: 'reorder', data: test})
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="items">
                {provided => (
                    <ul className={classes.root} {...provided.droppableProps} ref={provided.innerRef}>
                        {todoItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <motion.li key={item.id} transition={spring} layout={true}>
                                                <TodoItemCard item={item}/>
                                            </motion.li>
                                        </div>
                                    )}
                                </Draggable>

                        ))}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

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

export const TodoItemCard = function ({item}: { item: TodoItem }) {
    const classes = useTodoItemCardStyles();
    const {dispatch} = useTodoItems();

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

    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            <CardHeader
                action={
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon/>
                    </IconButton>
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
                        label={item.title}
                    />
                }
            />
            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
    );
};
