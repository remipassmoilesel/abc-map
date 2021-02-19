import { DEVICE_PIXEL_RATIO } from 'ol/has';
import { FillProperties } from './AbcStyleProperties';
import { FillPatterns } from '@abc-map/shared-entities';

const ratio = DEVICE_PIXEL_RATIO;

declare type CanvasContext = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D };

export class FillPatternFactory {
  private static canvasContext?: CanvasContext;

  public static create(properties: FillProperties): CanvasPattern | undefined {
    if (FillPatterns.Circles === properties.pattern) {
      return this.createCircles(properties);
    } else if (FillPatterns.Squares === properties.pattern) {
      return this.createSquares(properties);
    } else if (FillPatterns.HatchingVertical === properties.pattern) {
      return this.createVerticalHatching(properties);
    } else if (FillPatterns.HatchingHorizontal === properties.pattern) {
      return this.createHorizontalHatching(properties);
    } else if (FillPatterns.HatchingObliqueRight === properties.pattern) {
      return this.createObliqueHatchingRight(properties);
    } else if (FillPatterns.HatchingObliqueLeft === properties.pattern) {
      return this.createObliqueHatchingLeft(properties);
    }
  }

  public static createCircles(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // circle
    ctx.fillStyle = properties.color2 || 'blue';
    ctx.beginPath();
    ctx.arc(8 * ratio, 8 * ratio, 3 * ratio, 0, 2 * Math.PI);
    ctx.fill();

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  public static createSquares(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // square
    ctx.fillStyle = properties.color2 || 'blue';
    const x = 5 * ratio;
    const y = 5 * ratio;
    const w = 6;
    const h = 6;
    ctx.fillRect(x, y, w, h);

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  public static createVerticalHatching(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;
    const lineWidth = 4 * ratio;

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // hatch
    ctx.strokeStyle = properties.color2 || 'blue';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(8 * ratio, 0);
    ctx.lineTo(8 * ratio, 16 * ratio);
    ctx.stroke();

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  public static createHorizontalHatching(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;
    const lineWidth = 4 * ratio;

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // hatch
    ctx.strokeStyle = properties.color2 || 'blue';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, 8 * ratio);
    ctx.lineTo(16 * ratio, 8 * ratio);
    ctx.stroke();

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  public static createObliqueHatchingRight(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;
    const lineWidth = 4 * ratio;
    const halfLineSide = Math.sqrt(Math.pow(lineWidth / 2, 2) * 2);

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hatch
    ctx.strokeStyle = properties.color2 || 'blue';
    ctx.fillStyle = properties.color2 || 'blue';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // Top right corner
    ctx.beginPath();
    ctx.moveTo(canvas.width - halfLineSide, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, halfLineSide);
    ctx.fill();

    // Bottom left corner
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - halfLineSide);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(halfLineSide, canvas.height);
    ctx.fill();

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  public static createObliqueHatchingLeft(properties: FillProperties): CanvasPattern {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = 16 * ratio;
    canvas.height = 16 * ratio;
    const lineWidth = 4 * ratio;
    const halfLineSide = Math.sqrt(Math.pow(lineWidth / 2, 2) * 2);

    // background
    ctx.fillStyle = properties.color1 || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hatch
    ctx.strokeStyle = properties.color2 || 'blue';
    ctx.fillStyle = properties.color2 || 'blue';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // Top left corner
    ctx.beginPath();
    ctx.moveTo(0, halfLineSide);
    ctx.lineTo(halfLineSide, 0);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Bottom right corner
    ctx.beginPath();
    ctx.moveTo(canvas.width - halfLineSide, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - halfLineSide);
    ctx.fill();

    return ctx.createPattern(canvas, 'repeat') as CanvasPattern;
  }

  private static getCanvas() {
    if (!this.canvasContext) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Context not ready');
      }
      this.canvasContext = { canvas, ctx };
    }
    return this.canvasContext;
  }
}