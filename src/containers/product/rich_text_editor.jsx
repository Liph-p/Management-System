import React, { Component } from 'react';
import {EditorState,convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  //从富文本编辑器中提取出所有该商品对应的详情，供新增商品使用。
  getRichText = ()=>{
    let {editorState} = this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }
  
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="demo-wrapper"
          // editorClassName="demo-editor"
          editorStyle={{
            border:' 1px solid black',
            paddingLeft:'10px',
            minHeight: '200px'
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}