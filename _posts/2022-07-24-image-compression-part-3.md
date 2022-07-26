---
title: "Image compression (Part 3) - Vector Graphic like SVG"
header:
  image: https://images.pexels.com/photos/1556707/pexels-photo-1556707.jpeg
categories:
  - Tech
tags:
  - Learning, Mobile, General
---

### Introduction

Typically, the images are arranged in 2D grid (`x` and `y` of the pixels), and each pixel represents the colors of image itself. When we view those from a distance, the edge disappears and our eyes see a smooth color gradients. This is called `raster` format. What if instead of sending the final image, we send around some `codes` on how to draw the image? This concept is **vector** image format. It contains a number of commands and when executed procedurally, generates a final output image.

### Benefit

Let's think of technical drawing (like a building) that primarily consist of lines. Instead of telling every line points, we only need a `start` and `stop` point. We could then just draw it, hence we saved a lot of data drawing that line with just two points. It is like a form of compression.

Second, the vector image could be scaled very well with high accuracy. Drawing a millimeter line is the same as drawing a meter line. It becomes a huge win if we need the image for both thumbnail or full screen. It will serve very well across millions of devices with different resolutions and sizes.

### Price

After we discussed about the benefit, what is the price to pay? **Load Time**. This vector image expect the client to do the computation and the rendering. If the client device is fast, then the image rendering will be fast. It saves on the wire, but will incur more client-side overhead to reconstruct the image when it is rendered.

### SVG

One commonly used vector format is `SVG`. It stands for `Scalable Vector Graphics`. We could think `SVG` as a file format that stores image description in very low memory and generate a high quality, resolution independent image on the client.

<svg width="400" height="180">
  <rect x="50" y="20" width="150" height="150" style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9" />
  Sorry, your browser does not support inline SVG.  
</svg>

```
<svg width="400" height="180">
  <rect x="50" y="20"
  width="150"
  height="150"
  style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9" />
  Sorry, your browser does not support inline SVG.
</svg>
```

One of the limitation of `SVG` format is that it can only represent a certain type of image quality (only suitable for simple image and colors). If we are thinking of a picture of sunset with flowers, for instance, may not be the best candidate as the compression benefit yields less than processing it on client's device computation power.

### Conclusion

Vector images are great for things like logos, icons, technical drawings or simple image patterns, whereas raster images are best suited for photos and other rich information images.
