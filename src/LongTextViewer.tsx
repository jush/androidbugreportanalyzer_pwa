import React, { CSSProperties } from "react";
import "./LongTextViewer.css";

type LongTextViewerProps = {
  longText: string;
};

type LongTextViewerState = {
  longTextLines: string[]
  // Used to decide the width for the text container
  longestLine: string
  currentLine: number
  linesToShow: number
  lineWidth: number
  lineHeight: number
  position: {x:number, y:number}
};

class LongTextViewer extends React.Component<LongTextViewerProps, LongTextViewerState> {
  private extraLines:number = 2
  /**
   * If we have many many many lines the height can reach absurd numbers that don't work really well for browsers.
   * So we use this arbitrary maximum height and use module to wrap the different translations/heights used.
   */
  private maxHeightPx: number = 5e5
  
  constructor(props: LongTextViewerProps) {
    super(props)
    const lines = this.props.longText.split(/\r\n|\r|\n/)
    console.log("Total lines: " + lines.length)
    console.log("First line: " + lines[0])
    console.log("Second last line: " + lines[lines.length-2])
    console.log("Last line: " + lines[lines.length-1])
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

  onVerticalScrollerScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    event.stopPropagation()
    const positionY = -event.currentTarget.scrollTop
    this.setState((prevState)=>{
      var newCurrentLine = Math.floor(Math.abs(positionY) / prevState.lineHeight)
      return {
        position: {
          x: prevState.position.x, 
          y: positionY
        },
        currentLine: newCurrentLine
      }
    })
  }

  onHorizontalScrollerScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    event.stopPropagation()
    const positionX = -event.currentTarget.scrollLeft
    this.setState((prevState)=>{
      return {
        position: {
          x: positionX, 
          y: prevState.position.y
        }
      }
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
      
      var newCurrentLine = Math.floor(Math.abs(positionY) / prevState.lineHeight)
      
      // Update the horizontal and vertical scroll bars
      const scrollBarH = document.getElementById("LTV_scrollbar-h")!!
      scrollBarH.scrollLeft = -positionX
      const scrollBarV = document.getElementById("LTV_scrollbar-v")!!
      scrollBarV.scrollTop = -positionY
      
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
    // Let's calculate the top position in pixels of the first line to show. Taking into account that
    // we have to wrap at this.maxHeightPx
    const topLinePx = (lineHeight * currentLine) % this.maxHeightPx

    // Le'ts build each line as a div where its `top` is translated from the top line based on its index
    const contents = this.state.longTextLines.slice(currentLine, currentLine+linesToShow+this.extraLines).map((line, idx) => {
      const lineStyle: CSSProperties = {
        top: topLinePx + (lineHeight * idx)
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
      transform: 'translate(0px, -'+ topLinePx +'px)'
    }

    // We add this.extraLines to allow the vertical scrollbar to scroll some extra empty lines
    const totalHeight = (this.state.longTextLines.length + this.extraLines) * lineHeight + "px"
    const scrollbarInnerVertical: React.CSSProperties = {
      height: totalHeight,
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
      <div className="LTV_scroller" onWheel={this.onScrollerWheel} >
        <div className="LTV_content" style={contentStyle}>
          <div id="LTV_text_layer" style={textLayerStyle}>
            {contents}
          </div>
        </div>
      </div>
      <div className="LTV_scrollbar" id="LTV_scrollbar-v" onScroll={this.onVerticalScrollerScroll}>
        <div className="LTV_scrollbar-inner" style={scrollbarInnerVertical}>&nbsp;</div>
      </div>
      <div className="LTV_scrollbar" id="LTV_scrollbar-h" onScroll={this.onHorizontalScrollerScroll}>
        <div className="LTV_scrollbar-inner" style={scrollbarInnerHorizontal}>&nbsp;</div>
      </div>
    </div>
    </div>;
  }
}

export default LongTextViewer;
