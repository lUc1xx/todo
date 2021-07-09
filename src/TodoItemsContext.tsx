import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';

export interface TodoItem {
    id: string;
    title: string;
    details?: string;
    done: boolean;
}

interface TodoItemsState {
    todoItems: TodoItem[];
}

// T2 - решил путем создания type`ов
// обычно - создаю для каждого action отдельный интерфейс

export type TodoItemAdd = { title: string, details?: string };

type TodoItemsAction =
      { type: 'loadState' | 'reorder', data: TodoItemsState }
    | { type: 'add', data: TodoItemAdd }
    | { type: 'delete' | 'toggleDone', data: { id: string } }
    | { type: 'edit', data: { id: string, title: string, details?: string } }

// interface TodoItemsAction {
//     type: 'loadState' | 'add' | 'delete' | 'toggleDone' | 'reorder';
//     data: any;
// }

const TodoItemsContext = createContext<(TodoItemsState & { dispatch: (action: TodoItemsAction) => void }) | null>(null);

const defaultState = {todoItems: []};
const localStorageKey = 'todoListState';

export const TodoItemsContextProvider = ({
                                             children,
                                         }: {
    children?: ReactNode;
}) => {
    const [state, dispatch] = useReducer(todoItemsReducer, defaultState);

    useEffect(() => {
        const savedState = localStorage.getItem(localStorageKey);

        if (savedState) {
            try {
                dispatch({type: 'loadState', data: JSON.parse(savedState)});
            } catch {
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }, [state]);

    return (
        <TodoItemsContext.Provider value={{...state, dispatch}}>
            {children}
        </TodoItemsContext.Provider>
    );
};

export const useTodoItems = () => {
    const todoItemsContext = useContext(TodoItemsContext);

    if (!todoItemsContext) {
        throw new Error(
            'useTodoItems hook should only be used inside TodoItemsContextProvider',
        );
    }

    return todoItemsContext;
};

function todoItemsReducer(state: TodoItemsState, action: TodoItemsAction) {
    switch (action.type) {
        case 'loadState': {
            return action.data;
        }
        case 'add':
            return {
                ...state,
                todoItems: [
                    {id: generateId(), done: false, ...action.data},
                    ...state.todoItems,
                ],
            };
        case 'delete':
            return {
                ...state,
                todoItems: state.todoItems.filter(
                    ({id}) => id !== action.data.id,
                ),
            };
        case 'toggleDone':
            const itemIndex = state.todoItems.findIndex(
                ({id}) => id === action.data.id,
            );
            const item = state.todoItems[itemIndex];

            return {
                ...state,
                todoItems: [
                    ...state.todoItems.slice(0, itemIndex),
                    {...item, done: !item.done},
                    ...state.todoItems.slice(itemIndex + 1),
                ],
            };
        case 'reorder': {
            return action.data
        }

        case 'edit': {
            console.log('edit')
            const list = state.todoItems.map(item =>
                item.id === action.data.id ?
                    {
                        ...item,
                        title: action.data.title,
                        details: action.data.details
                    } : item
            );
            return {...state, todoItems: list}
        }

        default:
            throw new Error();
    }
}

function generateId() {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16,
    ).toString(36)}`;
}
