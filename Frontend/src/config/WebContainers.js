import { WebContainer } from '@webcontainer/api';
let webcontainerInstance = null;

export const initializeWebContainer =  () => {
    if (webcontainerInstance===null) {
        webcontainerInstance = new WebContainer();
    }
    return webcontainerInstance;
};