import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import './Home.css';
import { invokeApig } from '../libs/awsLib';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return invokeApig({ path: '/notes' });
  }

  renderNotesList(notes) {
    // It always renderes a Create a new note button as the first item in
    // the list (even if the list is empty) by concatenating an array
    // with an empty object with our notes array [{}].concat(notes)
    return [{}, ...notes].map(
      (note, i) =>
        i !== 0 ? (
          <ListGroupItem
            key={note.noteId}
            href={`/notes/${note.noteId}`}
            onClick={this.handleNoteClick}
            header={note.content.trim().split('\n')[0]}
          >
            {'Created: ' + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        ) : (
          <ListGroupItem
            key="new"
            href="/notes/new"
            onClick={this.handleNoteClick}
          >
            <h4>
              <b>{'\uFF0B'}</b>Create a new note
            </h4>
          </ListGroupItem>
        )
    );
  }

  handleNoteClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  };

  renderLander() {
    return (
      <div className="lander">
        <h1>Noterer</h1>
        <p>A simple note taking app</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}

export default Home;
