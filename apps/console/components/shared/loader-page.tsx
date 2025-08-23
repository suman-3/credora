import { Spinner } from "./spinner";

const LoaderPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <Spinner className="size-14" />
    </div>
  );
};

export default LoaderPage;
