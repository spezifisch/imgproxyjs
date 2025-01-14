import { createHmac } from 'crypto';
import { Buffer } from 'buffer';
import { transformers } from './transformer';
import { Adjust, Crop, Extend, GIFOptions, Gravity, Options, Padding, PNGOptions, Resize, RGBColor, Size, Trim, Watermark } from './types';

export class ImgProxy extends transformers {
  private options: any = {
    config: {},
    defaultOpts: {},
    settings: {},
  };

  private abbreviations = {
    resize: 'rs',
    size: 'size',
    resizing_type: 'rt',
    resizing_algorithm: 'ra',
    width: 'w',
    height: 'h',
    enlarge: 'el',
    extend: 'ex',
    gravity: 'g',
    crop: 'c',
    padding: 'pd',
    trim: 't',
    quality: 'q',
    max_bytes: 'mb',
    background: 'bg',
    adjust: 'a',
    brightness: 'br',
    contrast: 'co',
    saturation: 'sa',
    blur: 'bl',
    sharpen: 'sh',
    pixelate: 'pix',
    unsharpening: 'ush',
    watermark: 'wm',
    watermark_url: 'wmu',
    video_thumbnail_second: 'vts',
    style: 'st',
    jpeg_options: 'jpgo',
    png_options: 'pngo',
    gif_options: 'gifo',
    preset: 'pr',
    cachebuster: 'cb',
    strip_metadata: 'sm',
    strip_color_profile: 'scp',
    auto_rotate: 'ar',
    rotate: 'rot',
    filename: 'fn',
    format: 'ext',
  };

  private transformers = {
    resize: this.tresize,
    size: this.tsize,
    extend: this.textend,
    gravity: this.tgravity,
    crop: this.tcrop,
    padding: this.tpadding,
    background: this.tbackground,
    trim: this.ttrim,
    adjust: this.tadjust,
    watermark: this.twatermark,
    jpeg_options: this.tjpegOptions,
    png_options: this.tpngOptions,
    gif_options: this.tgifOptions,
  };

  constructor(
    { url, key, salt, autoreset, presetOnly }: { url: string; key?: string; salt?: string, autoreset: boolean, presetOnly?: boolean },
    options: Options = {},
  ) {
    super();

    this.options.config = {
      key,
      salt,
      url,
      autoreset: !!autoreset,
      presetOnly: !!presetOnly, // default: false
    };

    this.isObject(options);

    if (this.options.config.presetOnly) {
      this.setOption('preset', 'default');
    }
    for (const key in options) {
      this.setOption(key, options[key]);
    }
  }

  setAutoreset(autoreset: boolean) {
    this.options.config.autoreset = autoreset;
  }

  setOption(option: string, value: any): ImgProxy {
    if (value === null) {
      return this.resetOption(option);
    }

    const k = this.abbreviations?.[option] ?? option;
    const v = this.transformers?.[option]?.call?.(this, value) ?? value;
    this.options.settings[option] = `${k}:${v}`;

    return this;
  }

  private setOptions(options: Options) {
    this.isObject(options);
    for (const key in options) {
      this.setOption(key, options[key]);
    }
  }

  setDefaultOptions(options: Options) {
    this.isObject(options);
    this.options.defaultOpts = options;
    this.setOptions(options);
    
    return this;
  }
    
  getOption(option: string): any {
    if (!(option in this.options.settings)) {
        return;
    }
    return this.options.settings[option].split(':').pop();
  }

  resetDefaultOptions() {
    this.options.defaultOpts = {};
    return this;
  }

  resetOptions() {
    this.options.settings = {};
    this.setOptions(this.options.defaultOpts)
    return this;
  }

   resetOption(option: string) {
    delete this.options.settings?.[this.abbreviations?.[option] ?? option];
    return this;
  }

  resize(val: Resize) {
    return this.setOption('resize', val);
  }

  crop(val: Crop) {
    return this.setOption('crop', val);
  }

  size(val: Size) {
    return this.setOption('size', val);
  }

  extend(val: Extend) {
    return this.setOption('extend', val);
  }

  trim(val: Trim) {
    return this.setOption('trim', val);
  }

  adjust(val: Adjust) {
    return this.setOption('adjust', val);
  }

  resizingType(val: 'fit' | 'fill' | 'auto') {
    return this.setOption('resizing_type', val);
  }

  resizingAlgorithm(val: 'nearest' | 'linear' | 'cubic' | 'lanczos2' | 'lanczos3') {
    return this.setOption('resizing_algorithm', val);
  }

  width(width: number) {
    return this.setOption('width', `${width}`);
  }

  height(height: number) {
    return this.setOption('height', `${height}`);
  }

  dpr(val: number | string) {
    if (val > 0) {
      return this.setOption('dpr', `${val}`);
    }
    return this;
  }

  maxBytes(val: number) {
    return this.setOption('max_bytes', `${val}`);
  }

  padding(val: Padding) {
    return this.setOption('padding', val);
  }

  enlarge(val: number) {
    return this.setOption('enlarge', `${val}`);
  }

  pixelate(val: number) {
    return this.setOption('pixelate', `${val}`);
  }

  gravity(val: Gravity) {
    return this.setOption('gravity', val);
  }

  quality(quality: number) {
    return this.setOption('quality', `${quality}`);
  }

  background(color: RGBColor | string) {
    return this.setOption('background', color);
  }

  backgroundAlpha(val: number) {
    return this.setOption('background_alpha', `${val}`);
  }

  blur(val: number) {
    return this.setOption('blur', `${val}`);
  }

  saturation(val: number) {
    return this.setOption('saturation', `${val}`);
  }

  contrast(val: number) {
    return this.setOption('contrast', `${val}`);
  }

  brightness(val: number) {
    return this.setOption('brightness', `${val}`);
  }

  sharpen(val: number) {
    return this.setOption('sharpen', `${val}`);
  }

  watermark(val: Watermark) {
    return this.setOption('watermark', val);
  }

  watermarkUrl(val: string) {
    return this.setOption('watermark_url', val);
  }

  preset(...presets: string[]) {
    return this.setOption('preset', presets.join(':'));
  }

  cacheBuster(val: string) {
    return this.setOption('cachebuster', val);
  }

  format(val: string) {
    return this.setOption('format', val);
  }

  filename(val: string) {
    return this.setOption('filename', val);
  }

  rotate(val: number) {
    return this.setOption('rotate', val);
  }

  autoRotate(val: boolean) {
    return this.setOption('auto_rotate', val);
  }

  style(val: string) {
    return this.setOption('style', val);
  }

  page(val: number) {
    return this.setOption('page', `${val}`);
  }

  videoThumbnailSecond(val: number) {
    return this.setOption('video_thumbnail_second', `${val}`);
  }

  stripMetadata(val: boolean) {
    return this.setOption('strip_metadata', val);
  }

  strip_color_profile(val: boolean) {
    return this.setOption('strip_color_profile', val);
  }

  gifOptions(val: GIFOptions) {
    return this.setOption('gif_options', val);
  }

  pngOptions(val: PNGOptions) {
    return this.setOption('png_options', val);
  }

  private sign(target) {
    const { config }: any = this.options;
    const hexKey = ImgProxy.hexDecode(config?.key);
    const hexSalt = ImgProxy.hexDecode(config?.salt);

    const hmac = createHmac('sha256', hexKey);
    hmac.update(hexSalt);
    hmac.update(target);
    return ImgProxy.urlSafeBase64(hmac.digest());
  }

  static hexDecode(hex) {
    return Buffer.from(hex, 'hex');
  }

  static urlSafeBase64(string) {
    return Buffer.from(string)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  public get(originalImage: string) {
    const { settings, config }: any = this.options;

    if (!originalImage) {
      throw 'Missing required param: image';
    }

    const encoded_url = ImgProxy.urlSafeBase64(originalImage);

    let options = Object.values(settings).join('/');
    if (config.presetOnly) {
      // on preset-only mode no options can be given
      // and 'pr/preset:' key can be omitted.
      options = this.getOption('preset');
    }

    const path = options ? `/${options}/${encoded_url}` : `/${encoded_url}`;

    let url;
    if (config.key && config.salt) {
      url = `${config.url}/${this.sign(path)}${path}`;
    } else {
      url = `${config.url}/insecure${path}`;
    }

    if (this.options.config.autoreset) {
      this.resetOptions();
    }

    return url;
  }
}

export default ImgProxy;
