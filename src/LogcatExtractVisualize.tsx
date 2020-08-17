import React from "react";
import JSZip, { JSZipObject } from "jszip";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/theme-solarized_dark";
import State from "./State";
import LongTextViewer from "./LongTextViewer";

type LogcatExtractVisualizeProps = {
  bugreportZip: JSZip;
};

type LogcatExtractVisualizeState = {
  resourceState: State<string>;
  maxLines: number;
};

class Logcat {
  filename: string;
  contents: string;
  constructor(filename: string, contents: string) {
    this.filename = filename;
    this.contents = contents;
  }
}

class LogcatExtractVisualize extends React.Component<
  LogcatExtractVisualizeProps,
  LogcatExtractVisualizeState
> {
  state: LogcatExtractVisualizeState = {
    resourceState: { state: "loading" },
    maxLines: 60,
  };

  componentDidMount() {
    const zip = this.props.bugreportZip;
    const logd = zip.folder("FS/data/misc/logd/");
    // This check doesn't seem to work
    if (logd == null) {
      this.setState({
        resourceState: {
          state: "failed",
          message: "Unable to find logcat files",
        },
      });
    } else {
      this.loadLogcatContents(logd!!);
    }
  }

  private loadLogcatContents(logdZip: JSZip) {
    const logcatFiles: JSZipObject[] = [];
    logdZip.forEach((path, file) => {
      console.log("Logcat path: " + path + ", file name: " + file.name);
      if (path.startsWith("logcat") && path !== "logcat.id") {
        logcatFiles.push(file);
      }
    });
    if (logcatFiles.length === 0) {
      this.setState({
        resourceState: {
          state: "failed",
          message: "Unable to find logcat files",
        },
      });
      return;
    }
    // Reverse sort name of files to get proper timeline
    const sortedLogcatFiles = logcatFiles.sort((a, b) =>
      b.name.localeCompare(a.name)
    );

    // We need to make sure we load the logcats in sequential order.
    // To do so we create a chain of promises that accumulate the contents of each logcat.
    var contentPromise: Promise<Logcat> = Promise.resolve(
      new Logcat("empty", "")
    );
    sortedLogcatFiles.forEach((logcatFile) => {
      contentPromise = contentPromise.then(async (logcat) => {
        console.log("Concatenating log from " + logcat.filename);
        const contents = await logcatFile.async("string");
        return new Logcat(logcatFile.name, logcat.contents.concat(contents));
      });
    });
    contentPromise.then((logcat) => {
      console.log("Concatenating last log: " + logcat.filename);
      this.setState((prevState) => ({
        resourceState: { state: "success", value: logcat.contents },
      }));
    });
  }

  onMaxLinesChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ maxLines: e.currentTarget.valueAsNumber });
  };

  render() {
    const resourceState = this.state.resourceState;
    return (
      <div>
        {resourceState.state === "loading" && <h2>Loading logs...</h2>}
        {resourceState.state === "success" && (
          <div>
            <h2>{this.props.bugreportZip.name}</h2>
            <label>Number of lines for editor: </label>
            <input
              type="number"
              value={this.state.maxLines}
              onChange={this.onMaxLinesChanged}
            />
            <LongTextViewer longText={'ॲ / ऍ 7'+resourceState.value} />
            <AceEditor
              value={resourceState.value}
              width="100%"
              maxLines={this.state.maxLines}
              theme="solarized_dark"
              setOptions={{
                showGutter: false,
                showPrintMargin: false,
                readOnly: true,
                scrollPastEnd: true,
              }}
            />
          </div>
        )}
        {resourceState.state === "failed" && <h2>{resourceState.message}</h2>}
      </div>
    );
  }
}

export default LogcatExtractVisualize;
