declare module "html-element-to-image" {
    export interface ICaptureOptions {
        targetNode: HTMLElement,
        padding: IDirections;
        margin: IDirections
        returnType: string
    }

    export interface IDirections {
        top: number,
        right: number,
        bottom: number,
        left: number
    }
}
