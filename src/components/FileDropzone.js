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
  backgroundColor: "#b9adf0",
  color: "#47324e",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#8c54a4",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function FileDropzone(props) {

  const onDrop = useCallback((acceptedFiles) => {
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
      <div className="dropper-text">Drag and drop your videos here,</div>
      <div className="dropper-text">or click to select a video</div>
    </div>
  );
}

export default FileDropzone;
