const Video = ({ url }) => {
  return (
    <iframe
      src={url}
      width="100%" // Chiếm 100% chiều rộng của div bao bọc
      height="100%" // Chiếm 100% chiều cao của div bao bọc
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="YouTube Video"
      style={{ height: "100%" }}
    ></iframe>
  );
};

export default Video;
