import React from 'react';
import './App.css';
import SelectFileForm from './SelectFileForm';

type AppState = {
  file: File | null
}

class App extends React.Component</*No props*/{}, AppState> {
  state: AppState = {file: null}
  onFileSelected = (selectedFile: File): void => {
    this.setState({file: selectedFile})
  }
  render() {
    const hasFile = this.state.file != null
    let contents
    if (!hasFile) {
      contents = <SelectFileForm onFileSelected={this.onFileSelected}/>
    } else {
      contents = <div>File selected: {this.state.file?.name}</div>
    }
    return (
      <div className="App">
        {contents}
      </div>
    )
  }
}

export default App;