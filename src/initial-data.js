const initialData = {
    tasks: {
        'task-1': {id: 'task-1', content: 'Take out Garbage'},
        'task-2': {id: 'task-2', content: 'Netflix and chill'},
        'task-3': {id: 'task-3', content: 'SING!'},
        'task-4': {id: 'task-4', content: 'Makan. Lapar.'},
        'task-5': {id: 'task-5', content: 'Grocery shopping'},
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'TO DO',
            taskIds: ['task-1','task-2','task-3','task-4']
        },
        'column-2': {
            id: 'column-2',
            title: 'IN PROGRESS',
            taskIds: ['task-5']
        },
        'column-3': {
            id: 'column-3',
            title: 'COMPLETED',
            taskIds: []
        }
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
}

export default initialData;