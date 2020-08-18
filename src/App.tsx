import React from "react";
import "./App.css";
import SelectFileForm from "./SelectFileForm";
import BugreportAnalyzer from "./BugreportAnalyzer";

type AppState = {
  file: File | null;
};

class App extends React.Component</*No props*/ {}, AppState> {
  state: AppState = { file: null };

  onFileSelected = (selectedFile: File): void => {
    this.setState({ file: selectedFile });
  };

  onReset = (): void => {
    this.setState({ file: null });
  };
  render() {
    const hasFile = this.state.file != null;
    let contents;
    if (!hasFile) {
      contents = <SelectFileForm onFileSelected={this.onFileSelected} />;
    } else {
      contents = (
        <BugreportAnalyzer file={this.state.file!!} onReset={this.onReset} />
      );
    }
    return <div className="App">
      {contents}
      </div>;
  }
}

export default App;
