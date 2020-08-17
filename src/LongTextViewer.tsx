import React from "react";
import "./LongTextViewer.css";

type LongTextViewerProps = {
  longText: string;
};

type LongTextViewerState = {
  // Nothing
};

class LongTextViewer extends React.Component<LongTextViewerProps, LongTextViewerState> {
  state: LongTextViewerState = { };

  componentDidMount() {
    document.getElementsByClassName("")
  }

  render() {
    const contents = this.props.longText.split(/\r\n|\r|\n/, 5).map((line, idx) => {
      return <div className="LTV_line" id={'LTV_line_'+idx}>{line}</div>
    })
    return <div className="LTV_container">
      <div className="LTV_line" id="LTV_line_template">ॲ / ऍ 7</div>
      {contents}
      </div>;
  }
}

export default LongTextViewer;
