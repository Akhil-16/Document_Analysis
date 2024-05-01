import Loader from "react-spinners/GridLoader";

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#6d1b7b]">
      <Loader size={45} color={"white"} />
    </div>
  );
};

export default LoadingPage;
