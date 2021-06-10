import React, { useState, useEffect, useRef } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { generalUpdate } from "../redux/editor";
import { useDispatch, useSelector } from "react-redux";

function ImageCropper() {
  const { preview } = useSelector((state) => state.editor);
  const [cropper, setCropper] = useState();

  const dispatch = useDispatch();

  const imageElement = useRef();

  const initializeCropper = () => {
    if (cropper !== undefined) {
      cropper.replace(preview);
    } else {
      setCropper(
        new Cropper(imageElement.current, {
          zoomable: false,
          scalable: false,
          aspectRatio: 1,
          crop: (event) => {
            dispatch(
              generalUpdate({
                x: event.detail.x,
                y: event.detail.y,
                width: event.detail.width,
                height: event.detail.height,
              })
            );
          },
        })
      );
    }
  };

  useEffect(() => {
    initializeCropper();
  }, [preview]);

  return (
    <div>
      <div className="img-container">
        <img ref={imageElement} src={preview} alt="Source" />
      </div>
    </div>
  );
}

export default ImageCropper;
