import React, { useState, useEffect } from "react";
import ImageCropper from "./ImageCropper";
// installs ffmpeg packages
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { useSelector, useDispatch } from "react-redux";
import { generalUpdate } from "../redux/editor";
import FileDropzone from "./FileDropzone";
import generateGif from "./gifGenerator";
// import Dropzone from "react-dropzone";

//allows us to work w ffmpeg lib and logs eveything that it (ffmpeg) does
const ffmpeg = createFFmpeg({ log: true });

function Editor() {
  const [ready, setReady] = useState(false);

  //get cropping data from cropper
  const {
    x,
    y,
    width,
    height,
    preview,
    outputGif,
    outputFileSize,
    size,
    startTime,
    clipLength,
  } = useSelector((state) => state.editor);

  const dispatch = useDispatch();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      <FileDropzone dropUpdate={(video) => {
        const gifProcessingDetails = {
          startTime,
          clipLength,
          width,
          height,
          x,
          y,
        };
        generateGif(
          ffmpeg,
          dispatch,
          360,
          "preview",
          video,
          false,
          gifProcessingDetails
        );
      }}/>
      <h3>Preview</h3>
      <div>{preview && <ImageCropper />}</div>

      <div>
        <input
          type="file"
          onChange={(event) => {
            const gifProcessingDetails = {
              startTime,
              clipLength,
              width,
              height,
              x,
              y,
            };
            generateGif(
              ffmpeg,
              dispatch,
              360,
              "preview",
              event.target.files?.item(0),
              false,
              gifProcessingDetails
            );
          }}
        />
      </div>
      <label htmlFor="outputGifSize">Size (in pixels):</label>
      <input
        type="number"
        id="outputGifSize"
        name="outputGifSize"
        required
        defaultValue={size}
        onChange={(event) => {
          dispatch(generalUpdate({ size: event.target.value }));
        }}
      ></input>
      <label htmlFor="startTime">Start Time (in seconds):</label>
      <input
        type="number"
        id="startTime"
        name="startTime"
        required
        defaultValue={startTime}
        onChange={(event) => {
          dispatch(generalUpdate({ startTime: event.target.value }));
        }}
      ></input>
      <label htmlFor="clipLength">Output Gif Length (in seconds):</label>
      <input
        type="number"
        id="clipLength"
        name="clipLength"
        required
        defaultValue={Number(clipLength)}
        onChange={(event) => {
          dispatch(generalUpdate({ clipLength: event.target.value }));
        }}
      ></input>
      <button
        onClick={(event) => {
          const gifProcessingDetails = {
            startTime,
            clipLength,
            width,
            height,
            x,
            y,
          };
          generateGif(
            ffmpeg,
            dispatch,
            360,
            "gifOutput",
            preview,
            false,
            gifProcessingDetails
          );
        }}
      >
        Convert
      </button>
      <div></div>
      <h3>Result</h3>
      <div>{outputGif && <img src={outputGif} alt="output_gif" />}</div>
      <div>{outputFileSize}</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default Editor;
