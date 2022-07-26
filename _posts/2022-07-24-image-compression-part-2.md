---
title: "Image compression (Part 2) - Choosing image format"
header:
  image: https://images.pexels.com/photos/56759/pexels-photo-56759.jpeg
categories:
  - Tech
tags:
  - Learning, Mobile, General
---

### Introduction

There is an array of image algorithms and formats out there. Each has unique strength and trade-off that we need to consider. Let's look into the most commonly used image format - `PNG`, `JPG`, `GIF` and `WebP`.

### Interesting history

In 1985, Unisys filed a [patent][lzw-patent] for `LZW` compression algorithm. A few years later, CompuServe invented 89a format (later became `GIF`) and uses `LZW` as its backbone without realizing the patent.Unisys didn't care about it until 1993, when animated image became a sensation on the web HTML `IMG` tag. Unisys started to enforce its patent and eventually reached to court agreement in 1994, collecting royalties from all software that uses 89a graphic format. In the months following this decision, a group of seven engineers developed an entirely new, patent-free format known as `PNG`. Within a few week, `PNG` is supported by Netscape browser. In 2004, the patent on `LZW` finally expired, the debate of `GIF` (including how to pronounce it) vs `PNG` continued.

`JPG` has been a standard for some time. In 2013, Google and a set of open source contributors created a new image codec algorithm called `WebP`, which aimed to compress images smaller than `JPG` while keeping same quality. Although the saving (5% - 30%) were not so huge, it was massive for companies that operates in big image business (shopping, social media and image hosting). `WebP` initially faced adaption problem - Mozilla's Firefox openly [rejected][mozilla-reject-webp] it. Mozilla also open-sourced a new [`MozJPEG`][mozjpeg] codec to rebuke `WebP` adaption. But it didn't hold out long. In 2015, Mozilla had a change of heart and accepted `WebP`, saying that at the end of the day,

> Sure, technology decisions often are the result of personal predilection, political scheming, and inter-company rivalries. But cold hard data still can win the day.
> Mozilla

This statement said a lot of technology adaption, developer mentality and the benefit to the end users. We do have a lot of bias and we must fight for acceptance and approval among a world of engineers who are generally skeptical by nature.

### PNG

`PNG` refers to `Portable Network Graphics`. It is a _loseless_ image format that uses Gzip style compressor to make the file size smaller. Since it is _loseless_, the compressed quality will be identical to original.

One of the biggest attraction of `PNG` is that it supports **transparency**. On top of `red`, `green` and `blue` channel, there is `alpha` channel that defines which pixels to alpha-blend during rendering. It becomes very attractive to the web and mobile app where we could retain the background color while rendering the image on the top. However, we are also paying to have this fourth color channel as it will increase our file size.

Additionally, the `PNG` format allow for chunks of `metadata` in a file. This makes some image editors adding extra data to the file. Due to that, `png` could be bloated with junk that is useless to the user. It is therefore important that we **\*strip** out this unneeded data.

The good news is that there are a lot of tools out there - eg. PNGCrush, PunyPNG, TruePNG, etc.

### JPG

If transparency is not needed for the image, the `JPG` format will be a much better option. `JPG` stands for `Joint Photographic Experts Group`. Some calls it `JPEG` or `JPG` for short. `JPG` is a format built for photographic images and does not support transparency.

It is a _lossy_ compression by a quality metric which allows to trade off between file size and image quality. The compression format is built on block encoding. The image is broken into small `8x8` blocks, and various transformation are applied to each block.

Much like `PNG`, `JPG` can also include meta data blocks, which means the editor or camera could add some junks into the file. Most mobile devices now come with hardware `JPG` encoders and decoders hence they could be rendered significantly faster over an equivalent `PNG` file.

There are many tools out there that could further optimize the `JPG` file format, including Google's [Guetzli](https://github.com/google/guetzli) and [MozJPEG](https://github.com/mozilla/mozjpeg).

### GIF

`GIF` is another format that supports the transparency, alongside with _animation_. The `GIF` has two stages of compression, a `lossy palletization` to reduce the color pallette for the entire image to only **256** colors and followed by `lossless LZW` compression. Limiting to 256 color results in an aggressive quality reduction at the benefit of better compression sizes. `GIF` tends to be pretty well supported on the web, but not native platforms.

### WebP

The `WebP` format offers a middle ground between `JPG` and `PNG`. `WebP` supports both _loseless_ and _lossy_ compression mode. We could get both of best worlds from `JPG` and `PNG`. While it sounds like the crystal ball, there are a few caveats with `WebP` - mainly, it is not 100% supported across all image browsers. For example, chrome 23 and above supports `WebP` while chrome 4 to 8 does not support (old browsers). Likewise for many other well-known web browsers such as Firefox, Safari and Edge, etc.

For mobile development, Android is natively supported (yeah!) for `WebP`, otherwise we have to include a library for it. In addition to that, the advanced nature of lossy compression mode means that the performance of decompression on image load is a little slower than with `JPG` or `PNG`.

### Conclusion

Given all the information above, it is now pretty clear which image format to choose -

![flow](/assets/images/image-compression.drawio.svg){: .align-center}

In the next post, we will look at `Vector Drawable`.

[lzw-patent]: https://cs.stanford.edu/people/eroberts/cs201/projects/1999-00/software-patents/lzw.html
[mozilla-reject-webp]: https://arstechnica.com/information-technology/2011/05/mozilla-rejects-webp-image-format-google-adds-it-to-picasa/
[mozjpeg]: https://github.com/mozilla/mozjpeg
[facebook-webp-adpation]: https://www.cnet.com/tech/services-and-software/facebook-tries-googles-webp-image-format-users-squawk/
[mozilla-accept-webp]: https://www.cnet.com/tech/services-and-software/why-mozilla-had-a-change-of-heart-about-webp-images/
