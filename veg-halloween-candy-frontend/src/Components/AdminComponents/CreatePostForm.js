import React from 'react';
import {Component, Fragment} from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField';
import { flexbox } from '@material-ui/system';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createPostFetch, createPost } from '../../actions/postActions'


import CreatePostCard from './CreatePostCard'
import ConfirmationModal from './modals/confirmationModal'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const initialState = {
  title: "",
  contentBody: "",
  imgUrl1: "",
  imgUrl2: "",
  candyName: "",
  candyType: "",
  referralLink: "",
  postPreviewOpen: false,
  previewProps: "",
  confirmationOpen: false
}

class CreatePostForm extends Component {

  state = initialState

  handleFormChange = name => event => {
    this.setState({...this.state, [name]: event.target.value})
  }

  handlePreview = (state) => {
    this.setState({
        ...this.state,
        postPreviewOpen: true,
        previewProps: state
      }
    )
  }

  handlePostClick = (state) => {
    this.handlePost(this.state)
  }

  //create post helper function
  handlePost = (state) => {
    delete state.postPreviewOpen
    delete state.urlError

    const payload = {
      ...state,
      token: this.props.token
    }

    this.props.createPost(createPost(payload))
    this.props.handlePostCreated()

  }

  handleSaveClick = (state) => {
    let payload={
      ...this.state,
      token: this.props.token,
      userId: this.props.currentUser.id
    }
    delete payload.confirmationOpen
    delete payload.previewProps
    delete payload.postPreviewOpen
    // savePost(payload)
    this.setState({...this.state, confirmationOpen: false})
  }

  handleCancelClick = () => {
    this.setState({
      ...this.state,
      confirmationOpen: true
    })
  }

  handleModuleExitClick = () => {
    this.setState({...this.state, postPreviewOpen: false})
  }

  cancelPost = (yesOrNo) => {
    if(yesOrNo){
      this.setState({
        ...this.state,
        confirmationOpen: false
      }, this.props.handleCancel)
    } else {
      this.setState({...this.state, confirmationOpen: false})
    }
  }

  confirmationModal = () => {
    return (
      <ConfirmationModal
        isOpen={this.state.confirmationOpen}
        cancelPost={this.cancelPost}
      />
    )
  }

  postPreview = (content) => {
    return (
      <Modal
        open={this.state.postPreviewOpen}
        fullWidth
        onBackdropClick={this.handleModuleExitClick}
        onEscapeKeyDown={this.handleModuleExitClick}
      >
        <Container
        component="div"
        style={{"width":"100%", "height":"100%"}}
        >
        <CreatePostCard content={content}/>
          <Button
            label="Exit"
            variant="contained"
            onClick={this.handleModuleExitClick}
          >
            Exit
          </Button>
        </Container>
      </Modal>
    )
  }

  render(){
    return (
      <Fragment>
        {this.state.previewProps && this.postPreview(this.state.previewProps)}
        {this.state.confirmationOpen && this.confirmationModal()}
        <Container component="div">
          <Container
          component="div"
          style={
            {"display": "flex",
            "justify-content":"center",
            "width":"100%"
          }}
          >
            <TextField
              autoFocus
              fullWidth
              label="Title"
              className="textField"
              value={this.state.title}
              onChange={this.handleFormChange("title")}
              margin="normal"
            />
          </Container>

            <br/>
            <TextField
              label="Image URL"
              className="textField"
              fullWidth
              value={this.state.imgUrl1}
              onChange={this.handleFormChange("imgUrl1")}
              margin="normal"
            />
            <TextField
              label="Backup image URL"
              className="textField"
              fullWidth
              value={this.state.imgUrl2}
              onChange={this.handleFormChange("imgUrl2")}
              margin="normal"
            />
            <br/>
            <TextField
              label="Content Body"
              className="textField"
              variant="outlined"
              fullWidth
              multiline
              rows={10}
              value={this.state.contentBody}
              onChange={this.handleFormChange("contentBody")}
              margin="normal"
            />
            <br/>
            <TextField
              label="Referral Link"
              className="textField"
              fullWidth
              value={this.state.referralLink}
              onChange={this.handleFormChange("referralLink")}
              margin="normal"
            />
            <br/>
            <Container
              component="div"
              style={
                {
                "display": "flex",
                "justify-content":"space-between"
              }}
            >
              <TextField
                label="Candy Name"
                className="textField"
                value={this.state.candyName}
                onChange={this.handleFormChange("candyName")}
                margin="normal"
              />
              <TextField
                label="Candy Type"
                className="textField"
                value={this.state.candyType}
                onChange={this.handleFormChange("candyType")}
                margin="normal"
              />
            </Container>
            <br/>
            <br/>
            <Container
              component="div"
              style={
                {"display": "flex",
                "justify-content":"space-between",
                "width":"100%"
              }}
            >
              <Button
                variant="contained"
                className={"Button"}
                onClick={() => this.handlePostClick(this.state)}
                label="POST"
              >
              POST
              </Button>
              <Button
                label="Preview"
                variant="contained"
                onClick={() => this.handlePreview(this.state)}
              >
              PREVIEW
              </Button>
              <Button
                label="SAVE"
                variant="contained"
                onClick={this.handleSaveClick}
              >
              SAVE
              </Button>
              <Button
                label="Save"
                variant="contained"
                onClick={this.handleCancelClick}
              >
              CANCEL
              </Button>
            </Container>
            <br/>
            <br/>
            </Container>
          </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.session.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    savePost: (postContent) => dispatch(createPostFetch(postContent, "save")),
    createPost: (postContent) => dispatch(createPostFetch(postContent, "create"))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePostForm));
