import { Typography } from "@mui/material";
import { ImageBg } from "../components/ImageBg";

const NotFound = () => {
  return (
    <>
      <section className="relative flex h-screen w-[calc(100%)] flex-col items-center justify-center bg-bgColor">
        <ImageBg />
        <div className="z-10 flex w-11/12 lg:max-w-[25%] mx-auto flex-col justify-center rounded-md bg-white p-4 text-black">
          <div className="border border-black p-2">
            <Typography variant="h4" className="text-center">
              Not Found
            </Typography>
            <Typography variant="h6" className="text-center">
              The Page you are looking for, was not found.
            </Typography>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
