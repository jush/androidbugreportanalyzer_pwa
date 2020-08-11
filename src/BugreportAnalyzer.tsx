import React from 'react';

type BugreportAnalyzerProps = {
  file: File
}

type BugreportAnalyzerState = {
  fileNames: String[]
}

class BugreportAnalyzer extends React.Component<BugreportAnalyzerProps, BugreportAnalyzerState> {
  state: BugreportAnalyzerState = {fileNames:[]}
  componentWillMount() {
    
  }
  render() {
    return (
      <div>File selected: {this.props.file.name}</div>
      )
  }
}

export default BugreportAnalyzer