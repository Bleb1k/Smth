import { GPU, IKernelRunShortcut } from 'gpu.js'
import { Renderer } from '@/renderer'

// interface Physics {}

class DrawingApp extends Renderer {
  private gpu: GPU
  private canvas: HTMLCanvasElement
  // private context: WebGL2RenderingContext

  private pressed: boolean = false
  private clickX: number
  private clickY: number

  constructor() {
    super()
    let body = document.getElementsByTagName('body')[0]
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('webgl2')
    let gpu = new GPU({ canvas, context })

    body.style.margin = '0px'
    body.style.overflow = 'hidden'
    body.appendChild(canvas)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.canvas = canvas
    // this.context = context
    this.gpu = gpu

    this.createUserEvents()
    this.createRenderer(gpu, canvas)
  }

  private createUserEvents() {
    let canvas = this.canvas

    document.addEventListener('pointe', this.focusEventHandler)
    document.addEventListener('pointerout', () => (this.isDrawing = false))

    canvas.addEventListener('mousedown', this.pressEventHandler)
    canvas.addEventListener('mousemove', this.dragEventHandler)
    canvas.addEventListener('mouseup', this.releaseEventHandler)
    canvas.addEventListener('mouseout', this.cancelEventHandler)

    canvas.addEventListener('touchstart', this.pressEventHandler)
    canvas.addEventListener('touchmove', this.dragEventHandler)
    canvas.addEventListener('touchend', this.releaseEventHandler)
    canvas.addEventListener('touchcancel', this.cancelEventHandler)

    window.addEventListener('resize', this.resizeEventHandler)
  }

  private focusEventHandler = () => {
    requestAnimationFrame(this.redraw)
  }

  private resizeEventHandler = () => {
    this.redraw.change.setOutput([window.innerWidth, window.innerHeight])
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  private releaseEventHandler = () => {
    this.pressed = false
  }

  private cancelEventHandler = () => {
    this.pressed = false
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY
    mouseX -= this.canvas.offsetLeft
    mouseY -= this.canvas.offsetTop

    this.pressed = true
    this.clickX = mouseX
    this.clickY = mouseY
    this.setVar('mouseX', mouseX)
    this.setVar('mouseY', mouseY)
    e.preventDefault()
  }

  private dragEventHandler = (e: MouseEvent | TouchEvent) => {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY
    mouseX -= this.canvas.offsetLeft
    mouseY -= this.canvas.offsetTop

    if (this.pressed) {
      this.clickX = mouseX
      this.clickY = mouseY
      this.setVar('mouseX', mouseX)
      this.setVar('mouseY', mouseY)
    }
    // game.redraw()
    e.preventDefault()
  }
}

const game = new DrawingApp()
;(function loop() {
  game.redraw()
  requestAnimationFrame(loop)
})()
