import React, { CSSProperties } from "react";
import "./LongTextViewer.css";

type LongTextViewerProps = {
  longText: string;
};

type LongTextViewerState = {
  longTextLines: string[]
  longestLine: string
  currentLine: number
  linesToShow: number
  lineWidth: number
  lineHeight: number
  position: {x:number, y:number}
};

class LongTextViewer extends React.Component<LongTextViewerProps, LongTextViewerState> {
  private extraLines:number = 2;
  constructor(props: LongTextViewerProps) {
    super(props)
    const lines = this.props.longText.split(/\r\n|\r|\n/)
    const longestLine = lines.reduce((prev, current) => {
      const prevLength = prev.length;
      const currentLength = current.length;
      return prevLength < currentLength ? current : prev;
    });
    this.state = { 
      longTextLines: lines,
      longestLine: longestLine,
      currentLine: 0,
      linesToShow: 10,
      lineWidth: 0,
      lineHeight: 16,
      position: {x:0,y:0}
    };
  }

  componentDidMount() {
    const templateRect = document.getElementById("LTV_line_template")!!.getBoundingClientRect();
    const templateWidth = Math.round(templateRect.width)
    console.log("Template width: " + templateWidth)
    this.setState({
       lineWidth: templateWidth
    })
  }

  onScrollerWheel = (event: React.WheelEvent<HTMLDivElement>): void  => {
    event.stopPropagation()
    const deltaX = -event.deltaX
    const deltaY = -event.deltaY
    this.setState((prevState, props) => {
      var positionX = prevState.position.x + deltaX;
      if (positionX > 0) positionX = 0
      var positionY = prevState.position.y + deltaY;
      if (positionY > 0) positionY = 0

      const currentLinePosY = prevState.currentLine * prevState.lineHeight + prevState.lineHeight
      var newCurrentLine = Math.floor(Math.abs(positionY) / prevState.lineHeight)
      
      return {
        position: {
          // TODO: Figure the maximum negative X allowed based on lineWidth and current target width
          x: positionX, 
          y: positionY
        },
        currentLine: newCurrentLine
      }
    })
  };

  render() {
    const currentLine = this.state.currentLine
    const linesToShow = this.state.linesToShow
    const lineHeight = this.state.lineHeight
    const contents = this.state.longTextLines.slice(currentLine, currentLine+linesToShow+this.extraLines).map((line, idx) => {
      const lineStyle: CSSProperties = {
        top: lineHeight * (currentLine + idx)
      }
      return <div className="LTV_line" id={'LTV_line_'+(currentLine+idx)} key={idx} style={lineStyle}>{line}</div>
    })
    const viewerStyle: CSSProperties = {
      height: linesToShow * lineHeight + 'px'
    }
    const contentStyle: CSSProperties = {
      height: (linesToShow + this.extraLines) * lineHeight + 'px',
      width: this.state.lineWidth + 'px',
      transform: 'translate('+this.state.position.x + 'px, '+this.state.position.y % lineHeight +'px)'
    }
    const textLayerStyle: CSSProperties = {
      transform: 'translate(0px, -'+lineHeight * currentLine+'px)'
    }
    const scrollbarInnerVertical = {
      height: this.state.longTextLines.length / linesToShow * lineHeight + 'px',
      width: 20+'px'
    }
    const scrollbarInnerHorizontal = {
      width: this.state.lineWidth + 'px',
      height: 20+'px'
    }
    return <div>
      {this.state.lineWidth === 0 &&
            <div className="LTV_line" id="LTV_line_template">{this.state.longestLine}</div>
      }
    <div className="LTV_viewer" style={viewerStyle}>
      <div className="LTV_scroller" onWheel={this.onScrollerWheel}>
        <div className="LTV_content" style={contentStyle}>
          <div id="LTV_text_layer" style={textLayerStyle}>
            {contents}
          </div>
        </div>
      </div>
      <div className="LTV_scrollbar LTV_scrollbar-v">
        <div className="LTV_scrollbar-inner" style={scrollbarInnerVertical}>&nbsp;</div>
      </div>
      <div className="LTV_scrollbar LTV_scrollbar-h">
        <div className="LTV_scrollbar-inner" style={scrollbarInnerHorizontal}>&nbsp;</div>
      </div>
    </div>
    </div>;
  }
}

export default LongTextViewer;
