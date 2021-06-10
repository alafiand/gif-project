import React, { useState, useEffect } from "react";
import ImageCropper from "./ImageCropper";
// installs ffmpeg packages
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useSelector, useDispatch } from "react-redux";
import { generalUpdate } from "../redux/editor";
import FileDropzone from './FileDropzone';
// import Dropzone from "react-dropzone";

//allows us to work w ffmpeg lib and logs eveything that it (ffmpeg) does
const ffmpeg = createFFmpeg({ log: true });

function Editor() {
  const [ready, setReady] = useState(false);

  //get cropping data from cropper
  const { x, y, width, height, preview, outputGif, outputFileSize, size, startTime, clipLength } = useSelector(
    (state) => state.editor
  );

  const dispatch = useDispatch();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const generateGif = async (outputSize, outputDestination, vid, croppit) => {
    //Write the video file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(vid));

    // Process the video/gif
    await ffmpeg.run(
      "-i", //flag for input file
      "test.mp4", //input file
      "-framerate", //framerate flag
      "1/24",
      "-ss", // flag for start time
      `${Number(startTime)}`, //input for start time in seconds
      "-t", // flag for time/length of the output file
      `${Number(clipLength)}`, // length of output file is set to # seconds
      "-vf", //flag for all the filters
      `${
        croppit ? `crop=${width}:${height}:${x}:${y},` : ""
      }fps=12,scale=-1:${Number(outputSize)}`, // This is where the magic happens
      "-f", // flag for output file type
      "gif", // output file type is set to gif
      "-loop", //loop flag
      "0", // makes the output gif loop infinitely
      "out.gif" //name of file written to memory
    );

    //Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // update output file size variable to display size
    if (outputDestination === 'outputGif') {
      dispatch(generalUpdate({outputFileSize: data.length / 1000}));
    }

    //create a URL that the browser can reference
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    dispatch(
      generalUpdate({
        [outputDestination]: url,
      })
    );
  };

  return ready ? (
    <div className="App">
      <FileDropzone />
      <h3>Preview</h3>
      <div>{preview && <ImageCropper />}</div>

      <div>
        <input
          type="file"
          onChange={(event) => {
            generateGif(360, 'preview', event.target.files?.item(0), false);
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
          dispatch(generalUpdate({size: event.target.value}));
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
          dispatch(generalUpdate({startTime: event.target.value}));
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
          dispatch(generalUpdate({clipLength: event.target.value}));
        }}
      ></input>
      <button onClick={() => generateGif(size, 'outputGif', preview, true)}>
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
