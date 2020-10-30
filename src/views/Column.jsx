import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from './Card.jsx'
import { Button, Input, Label } from 'reactstrap'
import { Droppable } from 'react-beautiful-dnd' 
import styled from 'styled-components'

import firebase from 'firebase';

const Container = styled.div`
    margin: 10px;
    border: 1px solid lightgrey;
    border-radius: 0.5rem;
    width: 25%;

    display: flex;
    flex-direction: column;
`;
const Title = styled.h3`
    padding: 10px;
    margin: 0;
`;
const List = styled.div`
    padding: 10px;
    flex-grow: 1;
    min-height: 100px;
    border-radius: 0 0 0.5rem 0.5rem;
`;
const InputContainer = styled.div`
    display: flex;
    align-items: stretch;

`;
export default class Column extends Component {
    static propTypes = {
        column: PropTypes.object,
        tasks: PropTypes.array,
        parentRefresh: PropTypes.func,
    }
    state = {
        task: '',
    }
    handleTaskChange = (evt) => {
        let STRING = evt.target.name.split('_')
        let COLUMN = STRING[1]
        // console.log(COLUMN, evt.target.value);
        this.setState({ task: evt.target.value });
    }
    _addTask = () => {
        let TASK = this.state.task, COLUMN = this.props.column
        if(TASK === ''){
            alert('Cannot input empty task!')
            return;
        }
        // console.log(TASK);
        // console.log(this.props.column.name);
        let uuid = firebase.database().ref('trello_cards/').push().getKey();
        let STORE = {
            id: uuid,
            content: TASK,
            status: COLUMN.name
        }
        COLUMN.taskIds.push(uuid)
        // console.log(this.props);
        firebase.database().ref(`trello_cards/${uuid}`).update(STORE).then(() => {
            firebase.database().ref(`trello_list/${COLUMN.name}`).set(COLUMN.taskIds).then(() => {
                this.props.parentRefresh()
                this.setState({task:''})
            });
        })
    }

    render() {
        // console.log(this.state, this.props);
        return (
            <Container>
                <Title>{this.props.column.title}</Title>

                {/* NOTE: Droppable uses render props pattern and expects child to be a function that returns a component. So react b dnd doesnt need to create DOM nodes */}
                {/* NOTE: 
                    provided object
                    - droppableProps
                    - innerRef : supply DOM node of component to react b dnd
                    - placeholder : react element used to increase available space in droppable when needed. needs to be added as a child of the component of droppable
                    */}
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <List
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                background: snapshot.isDraggingOver ? 'lightblue' : 'white',
                                ...provided.droppableProps.style
                            }}
                        >
                            {/* {console.log(this.props.column.id, this.props.tasks)} */}
                            {this.props.tasks.map((task, index) => <Card key={task.id} task={task} index={index} />)}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>

                <InputContainer>
                    {/* <Label for={'task_' + this.props.column.name}>Create task</Label> */}
                    <Input type='text' name={'task_' + this.props.column.name} id={'task_' + this.props.column.name} onChange={this.handleTaskChange} value={this.state.task} placeholder="Create task..." />
                    <Button size="sm" color="info" onClick={this._addTask}>+</Button>
                </InputContainer>
            </Container>
        )
    }
}
