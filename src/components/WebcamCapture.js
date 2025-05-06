import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Capture photo
  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot();
    if (image) {
      setImageSrc(image);
    } else {
      alert("Could not capture image. Please allow camera access.");
    }
  }, []);

  // Delay loading webcam to reduce flicker
  useEffect(() => {
    const timer = setTimeout(() => setCameraReady(true), 500); // 0.5 sec delay
    return () => clearTimeout(timer);
  }, []);

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.video?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-4">
      {cameraReady ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded shadow"
          onUserMedia={() => console.log("Camera started")}
          onUserMediaError={(err) => console.error("Camera error", err)}
        />
      ) : (
        <p className="text-gray-500 mb-4">Loading camera...</p>
      )}

      <button
        onClick={capture}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Capture Photo 📸
      </button>

      {imageSrc && (
        <div className="mt-4">
          <h4 className="text-center mb-2">Captured Image:</h4>
          <img src={imageSrc} alt="Captured" className="rounded shadow-md" />
        </div>
      )}
    </div>
  );
};

// Prevent re-renders
export default React.memo(WebcamCapture);
