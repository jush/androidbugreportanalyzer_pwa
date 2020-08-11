import React from 'react';
import JSZip from 'jszip';
import AceEditor from "react-ace";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-noconflict/theme-solarized_dark";

type BugreportAnalyzerProps = {
  file: File
}

type BugreportAnalyzerState = {
  logDFileNames: string[],
  log: string
}

class BugreportAnalyzer extends React.Component<BugreportAnalyzerProps, BugreportAnalyzerState> {
  state: BugreportAnalyzerState = {logDFileNames:[], log:''}
  componentDidMount() {
    const zipPromise = JSZip.loadAsync(this.props.file)
    zipPromise.then((zip)=> {
      //console.log('Zip files: ' + zip.files)
      //zip.forEach(this.printFile);
      const logd = zip.folder('FS/data/misc/logd/')!!
      const logdFileNames: string[] = []
      logd.forEach((path, file) => {
        console.log('Logd file: ' + path)
        if (path.startsWith('logcat')) {
          logdFileNames.push(path)
        }
      });
      // Reverse sort name of files to get proper timeline
      const sortedLogdFileNames = logdFileNames.sort((a,b) => b.localeCompare(a))
      this.setState({logDFileNames: sortedLogdFileNames})
      var contentPromises: Promise<string>[] = []
      sortedLogdFileNames.forEach((value, idx) =>{
        console.log('LogD: ' + value)
        const readContents = logd.file(value)!!.async("string").then((contents) => {
          /*
          this.setState((prevState, props) => ({
            log: prevState.log.concat(contents)
          }))
          */
         console.log('processing ' + value)
         return contents
        })
        contentPromises.push(readContents)
      })
      Promise.all(contentPromises).then((values:string[])=> {
        var content:string = ''
        values.forEach((contents)=> {
          content+=contents
        })
        this.setState({
          log: content
        })
      })
    })
    
    zipPromise.catch((reason: any) => {
      console.error('Failed to load zip ' + reason)
    })
  }

  render() {
    const logFiles = this.state.logDFileNames.map((logDFilename) => 
      <li key={logDFilename}>{logDFilename}</li>
    );
    return (
      <div>File selected: {this.props.file.name}
        <AceEditor value={this.state.log} readOnly={true} width="100%" showPrintMargin={false} maxLines={50} theme="solarized_dark"/>
      </div>
      
      )
  }

  printFile(relativePath:String, zip: JSZip.JSZipObject) {
    console.log('Zip path: ' + relativePath)  
  }
}

export default BugreportAnalyzer