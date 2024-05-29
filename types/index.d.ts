export interface CaptureOptions {
    targetNode: HTMLElement | Element;
    excludedNodes: HTMLElement[] | Element[];
    customStyle: string;
    returnType: string;
}

export default function nodeToDataURL(userConfig: Partial<CaptureOptions>): Promise<string>;
