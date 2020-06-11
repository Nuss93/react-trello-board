import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Task from './Task.jsx'
import { Droppable } from 'react-beautiful-dnd' 
import styled from 'styled-components'

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
    margin: 0 0 15px;
`;
const TaskList = styled.div`
    padding: 10px;
    flex-grow: 1;
    min-height: 100px;
`;

export default class Column extends Component {
    static propTypes = {
        column: PropTypes.object,
        tasks: PropTypes.array,
    }

    render() {
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
                    {(provided, snapshot) => {
                        // console.log('snapshot', snapshot)
                        return <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
                            {provided.placeholder}
                        </TaskList>
                    }}
                </Droppable>
            </Container>
        )
    }
}
