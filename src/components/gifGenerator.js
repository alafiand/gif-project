import { generalUpdate } from "../redux/editor";
import { fetchFile } from "@ffmpeg/ffmpeg";

const generateGif = async (ffmpeg, dispatch, outputSize, outputDestination, vid, croppit, {startTime, clipLength, width, height, x, y }) => {

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
  if (outputDestination === "outputGif") {
    dispatch(generalUpdate({ outputFileSize: data.length / 1000 }));
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

export default generateGif
