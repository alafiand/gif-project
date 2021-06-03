import React, { useState, useEffect } from "react";
import "./App.css";

// installs ffmpeg packages
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

//allows us to work w ffmpeg lib and logs eveything that (ffmpeg) it does
const ffmpeg = createFFmpeg({ log: true });

function App() {
  // to track loading state, property "ready" w default value of false which will be flipped once the data has been loaded
  const [ready, setReady] = useState(false);

  const [video, setVideo] = useState();

  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const previewVideo = async (vid) => {
    //Write the video file to memory
    ffmpeg.FS("writeFile", "input.mov", await fetchFile(vid));

    //Run the FFMpeg command
    await ffmpeg.run(
      "-i", //flag for input file
      "input.mov", //input file
      "output.mp4" //name of file written to memory
    );

    //Read the result
    const data = ffmpeg.FS("readFile", "output.mp4");

    //create a URL that the browser can reference
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setVideo(url);
  };

  const convertToGif = async () => {
    //Write the video file to memory
    ffmpeg.FS("writeFile", "test.mov", await fetchFile(video));

    //Run the FFMpeg command (this is the syntax we will need to use)
    await ffmpeg.run(
      "-i", //flag for input file
      "test.mov", //input file
      "-t", // flag for time/length of the output file
      "2.5", // length of output file is set to 2.5 seconds
      // "-ss", // flag for offsetting when we start our output file from the input video
      // "2.0", // the output gif will start from 2 seconds into the input video
      "-vf",
      "scale=-1:360",
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
    setGif(url);
  };

  return ready ? (
    <div className="App">
      {video && (
        <video
          controls
          //autoplay="true"
          width="500"
          src={video}
        ></video>
      )}
      <div>
        <input
          type="file"
          onChange={(event) => {
            setVideo(event.target.files?.item(0));
            previewVideo(event.target.files?.item(0));
          }}
        />
      </div>
      <h3>Result</h3>
      <button onClick={convertToGif}>Convert</button>
      <div>{gif && <img src={gif} />}</div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
