import { WebContainer } from '@webcontainer/api';

let webcontainerInstance = null;

export const initializeWebContainer = async () => {
  if (webcontainerInstance === null) {
    webcontainerInstance = await WebContainer.boot();
    console.log("WebContainer instance ready:", webcontainerInstance);
  }
  return webcontainerInstance;
};
