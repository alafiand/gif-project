import React, { Component } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

class ImageCropper extends Component {
  constructor() {
    super();
    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.imageElement = React.createRef();
  }

  componentDidMount() {
    const cropper = new Cropper(this.imageElement.current, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: (event) => {
        console.log("CROPPING");
        this.setState({
          x: event.detail.x,
          y: event.detail.y,
          width: event.detail.width,
          height: event.detail.height,
        });
      },
    });
  }

  render() {
    return (
      <div>
        <div className="img-container">
          <img ref={this.imageElement} src={this.props.src} alt="Source" />
          <p>x is {this.state.x}</p>
          <p>y is {this.state.y}</p>
          <p>width is {this.state.width}</p>
          <p>height is {this.state.height}</p>
        </div>
      </div>
    );
  }
}

export default ImageCropper;
