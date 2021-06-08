import React, { Component } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { updateCropData } from "../redux/editor";
import { connect } from "react-redux";

class ImageCropper extends Component {
  constructor() {
    super();

    this.imageElement = React.createRef();
  }

  componentDidMount() {
    console.log('THIS IS THE BLAG', this.imageElement.current)
    const cropper = new Cropper(this.imageElement.current, {
      zoomable: false,
      scalable: false,
      aspectRatio: 1,
      crop: (event) => {
        this.props.updateCropData({
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
        </div>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => ({
  updateCropData: (cropData) => dispatch(updateCropData(cropData)),
});

export default connect(null, mapDispatch)(ImageCropper);
