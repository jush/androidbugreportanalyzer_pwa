import React from 'react';

type SelectFileFormProps = {
  onFileSelected: (file: File)=> void
}

type SelectFileFormState = {
  value: string;
  files: FileList|null
}

class SelectFileForm extends React.Component<SelectFileFormProps, SelectFileFormState> {
  state: SelectFileFormState = {value: '', files: null};

  handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({value: e.currentTarget.value,files: e.currentTarget.files})
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('A file was submitted: ' + this.state.value);
    if (this.state.files != null) {
      let file = this.state.files[0]
      console.log('File selected: ' + file);
      // Notify the other components
      this.props.onFileSelected(file)
    } else {
      console.error('No file submitted')
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
        <label>
          Please submit bugreport zip file:
          <input type="file" value={this.state.value} onChange={this.handleChange} />
        </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default SelectFileForm