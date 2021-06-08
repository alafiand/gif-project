import React, { useState, useEffect } from "react";
import ImageCropper from "./ImageCropper";
// installs ffmpeg packages
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useSelector } from "react-redux";

//allows us to work w ffmpeg lib and logs eveything that it (ffmpeg) does
const ffmpeg = createFFmpeg({ log: true });

function Editor() {
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState();
  const [gif, setGif] = useState();
  const [size, setSize] = useState(80);
  const [outputFileSize, setOutputFileSize] = useState();
  const [startTime, setStartTime]= useState(0)

  //get cropping data from cropper
  const { x, y, width, height } = useSelector((state) => state.editor);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const generateGif = async (outputSize, callback, vid, croppit) => {
    //Write the video file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(vid));

    await ffmpeg.run(
      "-i", //flag for input file
      "test.mp4", //input file
      "-framerate", //framerate flag
      "1/24",
      "-ss", // flag for start time
      `${startTime}`, //input for start time in seconds
      "-t", // flag for time/length of the output file
      "3", // length of output file is set to # seconds
      "-vf", //flag for all the filters
      `${
        croppit ? `crop=${width}:${height}:${x}:${y},` : ""
      }fps=12,scale=-1:${outputSize}`, // This is where the magic happens
      "-f", // flag for output file type
      "gif", // output file type is set to gif
      "-loop", //loop flag
      "0", // makes the output gif loop infinitely
      "out.gif" //name of file written to memory
    );

    //Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // update output file size variable to display size
    if (callback === setGif) {
      setOutputFileSize(`${data.length / 1000} Kb`);
    }

    //create a URL that the browser can reference
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    callback(url);
  };

  return ready ? (
    <div className="App">
      <h3>Preview</h3>
      <div>{preview && <ImageCropper src={preview} />}</div>
      <div>{JSON.stringify(preview)}</div>
      <div>
        <input
          type="file"
          onChange={(event) => {
            setPreview(null);
            generateGif(360, setPreview, event.target.files?.item(0), false);
            console.log(event.target.files);
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
          setSize(event.target.value);
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
          setStartTime(event.target.value);
        }}
      ></input>
      <button onClick={() => generateGif(size, setGif, preview, true)}>
        Convert
      </button>
      <div></div>
      <h3>Result</h3>
      <div>{gif && <img src={gif} alt="output_gif" />}</div>
      <div>{outputFileSize}</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default Editor;
