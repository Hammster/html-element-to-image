export interface ICaptureOptions {
    targetNode: HTMLElement | Element;
    excludedNodes: HTMLElement[] | Element[];
    customStyle: string;
    returnType: string;
}
export interface IDirections {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export default function nodeToDataURL(userConfig: Partial<ICaptureOptions>): Promise<string>;
