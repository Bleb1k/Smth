import {
  IKernelFunctionThis,
  IKernelRunShortcut,
  IConstantsThis,
  GPU,
  ThreadKernelVariable,
  Kernel,
  FunctionNode,
} from 'gpu.js'

interface Redraw {
  (): void
  change: IKernelRunShortcut
}

interface RenderValues {
  mouseX: number
  mouseY: number
}

interface IKernelFunction extends IKernelFunctionThis {
  num(a: unknown): number
  dist(x: number, y: number): number
}

export class Renderer {
  private renderSettings: RenderValues = {
    mouseX: 1,
    mouseY: 1,
  }

  protected isDrawing: boolean = false
  public redraw: Redraw

  protected async createRenderer(gpu: GPU, canvas: HTMLCanvasElement) {
    const redr = gpu
      .createKernel(function (mouseX, mouseY) {
        function num(a: ThreadKernelVariable) {
          return a as number
        }

        function dist(x: number, y: number) {
          return x + y
        }
        let dst =
          dist(this.thread.x - num(mouseX), this.thread.y - num(mouseY)) /
          dist(this.output.x, this.output.y)
        /*
          Math.sqrt(
            (this.thread.x - num(mouseX)) *
              (this.thread.x - (mouseX as number)) +
              (this.output.y - this.thread.y - (mouseY as number)) *
                (this.output.y - this.thread.y - (mouseY as number))
          ) /
          Math.sqrt(
            this.output.x * this.output.x + this.output.y * this.output.y
          )*/
        this.color(0.3, Math.max(1 - 2 * dst, 0), Math.max(1 - 2 * dst, 0), 1)
      })
      .setOutput([canvas.width, canvas.height])
      .setDynamicOutput(true)
      .setGraphical(true)

    let redraw = (() => {
      redr(this.renderSettings.mouseX, this.renderSettings.mouseY)
    }) as Redraw
    redraw.change = redr
    this.redraw = redraw
    redraw()
  }

  protected setVar(name: keyof RenderValues, val: number) {
    this.renderSettings[`${name as keyof RenderValues}`] = val
  }
}
