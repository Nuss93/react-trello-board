import React, { Component } from "react";
import initialData from "../initial-data.js";
import Column from "./Column.jsx";
import { DragDropContext } from "react-beautiful-dnd";
import firebase from 'firebase';

export default class TaskList extends Component {
  state = {
    tasks: {},
    columns: {
      'to do': {
        id: 'to do',
        title: 'To Do',
        name: 'to do',
        taskIds: [],
      },
      'in progress': {
        id: 'in progress',
        title: 'In Progress',
        name: 'in progress',
        taskIds: [],
      },
      'completed': {
        id: 'completed',
        title: 'Completed',
        name: 'completed',
        taskIds: [],
      }
    },
    columnOrder: ['to do', 'in progress', 'completed'],
    // data: {}
  };
  componentDidMount() {
    this.fetchList()
  }
  fetchList = () => {
    let TASKS = {}
    firebase.database().ref('trello_cards').once('value').then((snapshot) => {
      if(snapshot.exists()){
        TASKS = snapshot.val()
      }
    }).then(() => {
      firebase.database().ref('trello_list').once('value').then((snapshot) => {
        if(snapshot.exists()){
          let SNAPSHOT = snapshot.val()

          // console.log(TASKS, snapshot.val());
          let COLUMNS = {
            'to do': {
              id: 'to do',
              title: 'To Do',
              name: 'to do',
              taskIds: [],
            },
            'in progress': {
              id: 'in progress',
              title: 'In Progress',
              name: 'in progress',
              taskIds: [],
            },
            'completed': {
              id: 'completed',
              title: 'Completed',
              name: 'completed',
              taskIds: [],
            }
          }
  
          for (const columnId in SNAPSHOT) {
            let CURRENT = SNAPSHOT[columnId]
            // console.log(CURRENT, columnId);
            COLUMNS[columnId].taskIds = CURRENT
          }

          this.setState({tasks:TASKS, columns: COLUMNS})
        }
      })
    })
    
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("on drag end", result);

    // CHECKS TO SEE IF NO DESTINATION OR THE SAME PLACE
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // RETRIEVE COLUMN FROM THE STATE
    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];
    // IF IT IS IN THE SAME COLUMN
    if (start === finish) {
      // CREATE NEW ARRAY FOR TASKIDS ARRAY WITHOUT MUTATING
      const newTaskIds = Array.from(start.taskIds);

      // REMOVE ONE ITEM FROM THE SOURCE
      newTaskIds.splice(source.index, 1);
      // REMOVE NOTHING IN DESTINATION INDEX AND INSERT THE DRAGGABLE ID
      newTaskIds.splice(destination.index, 0, draggableId);

      // CREATE NEW COLUMNS WITH NEW TASKIDS ARRAY
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      // PUT INTO A NEW PICTURE OF THE STATE
      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          // JUST OVERWRITES THE ONE COLUMN ID
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState, () => {
        firebase.database().ref(`trello_list/${finish.name}`).set(newColumn.taskIds).then(() => {
          this.fetchList()
        })
      });
      return;
    }

    // PRETTY MUCH SIMILAR TO THE ABOVE FLOW, BUT NEED TO CONSIDER FROM DIFFERENT COLUMNS (START AND FINISH ARRAYS ARE DIFFERENT)
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        // JUST OVERWRITES THE COLUMN IDS
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    this.setState(newState, () => {
      firebase.database().ref(`trello_cards/${draggableId}/status`).set(newFinish.name).then(() => {
        firebase.database().ref(`trello_list`).update({
          'to do' : newState.columns['to do'].taskIds,
          'in progress' : newState.columns['in progress'].taskIds,
          'completed' : newState.columns['completed'].taskIds
        }).then(() => {
          this.fetchList()
        })
      })
    });
  };

  render() {
    return (
      <>
        <h1 className="mb-0" style={{margin: '15px 10px 20px'}}>React Beautiful DnD</h1>
        <div style={{ display: "flex" }}>
          <DragDropContext
            // 3 callbacks
            // onDragStart
            // onDragUpdate
            // only require
            onDragEnd={this.onDragEnd}
          >
            {this.state.columnOrder.map((columnId) => {
              const column = this.state.columns[columnId];
              const tasks = column.taskIds.map(
                (taskId) => this.state.tasks[taskId]
              );

              return <Column key={column.id} column={column} tasks={tasks} parentRefresh={this.fetchList} />;
            })}
          </DragDropContext>
        </div>
      </>
    );
  }
}
