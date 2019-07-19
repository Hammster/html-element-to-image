declare module "html-element-to-image" {
    export interface ICaptureOptions {
        targetNode: HTMLElement | Element
        excludedNodes: HTMLElement[] | Element[]
        padding: IDirections
        margin: IDirections
        returnType: string
    }

    export interface IDirections {
        top: number
        right: number
        bottom: number
        left: number
    }

    export default function NodeToDataURL (userConfig: Partial<ICaptureOptions>): Promise<string>
}
