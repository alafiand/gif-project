import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";


const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function FileDropzone(props) {

  const onDrop = useCallback((acceptedFiles) => {
    console.log(URL.createObjectURL(acceptedFiles[0]));
    console.log(`props`, props)
    props.dropUpdate(URL.createObjectURL(acceptedFiles[0]))
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "video/*, image/gif",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <div>Drag and drop your videos here,</div>
      <div>or double click to select a video</div>
    </div>
  );
}

export default FileDropzone;
