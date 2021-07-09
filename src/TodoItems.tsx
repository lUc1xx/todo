import {makeStyles} from '@material-ui/core/styles';
import {motion} from 'framer-motion';
import {TodoItem, useTodoItems} from './TodoItemsContext';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import TodoItemCard from "./TodoItemCard";

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

const reorderItems = (list: TodoItem[], startIndex: number, endIndex: number): TodoItem[] => {
    const [selected] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, selected);

    return list;
};

export const TodoItemsList = function () {
    const {todoItems, dispatch} = useTodoItems();
    const classes = useTodoItemListStyles();

    const onDragEnd = (result: any): void => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const reorderTodoItems = reorderItems(
            todoItems,
            result.source.index,
            result.destination.index
        );

        dispatch({type: 'reorder', data: {todoItems: reorderTodoItems}})
    };

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

