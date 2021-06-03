import React, { useState, useEffect } from "react";
import Cropper from "cropperjs";
import "./App.css";

// installs ffmpeg packages
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

//allows us to work w ffmpeg lib and logs eveything that it (ffmpeg) does
const ffmpeg = createFFmpeg({ log: true });

function App() {
  // to track loading state, property "ready" w default value of false which will be flipped once the data has been loaded
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const generateGif = async (size, callback, vid, croppit) => {
    //Write the video file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(vid));
    await ffmpeg.run(
      "-i", //flag for input file
      "test.mp4", //input file
      "-framerate", //framerate flag
      "1/24",
      "-t", // flag for time/length of the output file
      "2.5", // length of output file is set to 2.5 seconds
      "-vf",
      `fps=12,scale=-1:${size}${croppit ? `,crop=${size * .9}:${size * .9}:0:0` : ""}`,
      "-f", // flag for file type
      "gif", // output file type is set to gif
      "out.gif" //name of file written to memory
    );

    //Read the result
    const data = ffmpeg.FS("readFile", "out.gif");
    console.log("DATA", data);
    //create a URL that the browser can reference
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    callback(url);
  };

  return ready ? (
    <div className="App">
      <h3>Preview</h3>
      <div>
        {preview && (
          <img
            width="500"
            src={preview}
            alt="preview"
            id="preview"
          />
        )}
      </div>
      <div>
        <input
          type="file"
          onChange={(event) => {
            generateGif(360, setPreview, event.target.files?.item(0), false);
          }}
        />
      </div>
      <button onClick={() => generateGif(60, setGif, preview, true)}>
        Convert
      </button>
      <div></div>
      <h3>Result</h3>
      <div>{gif && <img src={gif} alt="output_gif" />}</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
