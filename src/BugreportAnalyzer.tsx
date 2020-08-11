import React from "react";
import JSZip from "jszip";
import LogcatExtractVisualize from "./LogcatExtractVisualize";

type BugreportAnalyzerProps = {
  file: File;
  onReset: () => void;
};

type BugreportAnalyzerState = {
  bugreportZip: JSZip | null;
};

class BugreportAnalyzer extends React.Component<
  BugreportAnalyzerProps,
  BugreportAnalyzerState
> {
  state: BugreportAnalyzerState = {
    bugreportZip: null,
  };

  componentDidMount() {
    const zipPromise = JSZip.loadAsync(this.props.file);
    zipPromise.then((zip) => {
      this.setState({ bugreportZip: zip });
    });

    zipPromise.catch((reason: any) => {
      console.error("Failed to load zip " + reason);
    });
  }

  render() {
    return (
      <div>
        <h2>{this.props.file.name}</h2>
        <button onClick={this.props.onReset}>Change file</button>
        {this.state.bugreportZip != null && (
          <LogcatExtractVisualize bugreportZip={this.state.bugreportZip} />
        )}
      </div>
    );
  }

  printFile(relativePath: String, zip: JSZip.JSZipObject) {
    console.log("Zip path: " + relativePath);
  }
}

export default BugreportAnalyzer;
