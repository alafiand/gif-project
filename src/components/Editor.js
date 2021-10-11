import React, { useState, useEffect } from "react";
import ImageCropper from "./ImageCropper";
// installs ffmpeg packages
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { useSelector, useDispatch } from "react-redux";
import { generalUpdate } from "../redux/editor";
import FileDropzone from "./FileDropzone";
import generateGif from "./gifGenerator";
// import Dropzone from "react-dropzone";
import loadingGif from "../assets/loadingGif.gif";

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
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      <div>
        <h1 className="section-header">Preview</h1>
        <FileDropzone
          dropUpdate={(video) => {
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
          }}
        />

        <div className="preview-area">{preview && <ImageCropper />}</div>

        <div className="grid grid-cols-3 gap-6">
          <span>
            <div className="mb-3 pt-0">
              <label htmlFor="outputGifSize">Size (in pixels):</label>
              <input
                type="text"
                placeholder={size}
                defaultValue={size}
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                required
                onChange={(event) => {
                  dispatch(generalUpdate({ size: event.target.value }));
                }}
              />
            </div>
          </span>

          <span>
            <div className="mb-3 pt-0">
              <label htmlFor="startTime">Start Time (in seconds)</label>
              <input
                type="text"
                placeholder={startTime}
                defaultValue={startTime}
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                required
                onChange={(event) => {
                  dispatch(generalUpdate({ startTime: event.target.value }));
                }}
              />
            </div>
          </span>

          <span>
            <div className="mb-3 pt-0">
              <label htmlFor="clipLength">Output Gif Length (in seconds)</label>
              <input
                type="text"
                placeholder={clipLength}
                defaultValue={clipLength}
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                required
                onChange={(event) => {
                  dispatch(generalUpdate({ clipLength: event.target.value }));
                }}
              />
            </div>
          </span>
        </div>
        <button
          className="bg-blue-200 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
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
              size,
              "outputGif",
              preview,
              true,
              gifProcessingDetails
            );
          }}
        >
          Convert
        </button>
        <div></div>
        <h1 className="section-header">Result</h1>
        <div className="output-canvas">
          {outputGif && (
            <img src={outputGif} alt="output_gif" className="gif-product" />
          )}
        </div>
        <div>{`${outputFileSize} Kb`}</div>
      </div>
    </div>
  ) : (
    <div>
      <p className="loading-text">Loading the magic!</p>
      <img src={loadingGif} alt="loading" />
    </div>
  );
}

export default Editor;
