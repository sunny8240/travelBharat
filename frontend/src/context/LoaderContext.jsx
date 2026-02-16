export const LoaderProvider = ({ children }) => children;

export function useLoader() {
  return {
    showLoader: () => {},
    hideLoader: () => {},
    visible: false,
    type: "initial",
  };
}
