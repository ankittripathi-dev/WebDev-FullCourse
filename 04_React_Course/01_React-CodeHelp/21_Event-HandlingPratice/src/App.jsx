import AlertButton from "./components/AlertButton";

const App = () => {
  return (
    <div className="flex flex-col gap-16 items-center">
      <AlertButton message="Playing...">Play Movie</AlertButton>
      <AlertButton message="Uploading...">Upload Image</AlertButton>
    </div>
  );
};

export default App;
