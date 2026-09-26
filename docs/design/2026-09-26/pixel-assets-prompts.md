# 彩色像素插画提示词

工具：内置 image_gen。网页实际使用的文件为 src/assets/pixel-world.webp 和 src/assets/pixel-covers.webp。生成后只做 WebP 格式压缩（质量 88），没有裁切或重绘。图集通过 CSS background-position 选择单个封面。

## hero

```text
Use case: illustration-story
Asset type: production website hero illustration.
Reference image role: ONLY composition and pixel-art world reference from the large monochrome illustration in the attached website design. Do not reproduce the website UI, text, header or game cards.
Generate a full-bleed horizontal pixel-art landscape, aspect ratio about 2.5:1, ideal 2000x800. Scene: at left a tiny traveler with a coral-red scarf standing on a lush grass floating island, facing an open rectangular luminous cream-gold doorway on a larger floating island at right, with several smaller islands, old stone ruins, vines, tiny flowers and cloud sea stretching across the scene. Keep the original reference's atmosphere of an imaginative pixel adventure and the strong asymmetrical composition.
Transform its black-and-white palette into a bright beautiful daytime palette: clear turquoise and cornflower blue sky, puffy pale ivory clouds, vibrant mint and grassy green vegetation, warm ochre stone, salmon-pink and golden tiny flowers, a luminous buttery-yellow portal. Rich pixel clusters and crisp square edges, lovingly hand-crafted detailed 16-bit/32-bit pixel landscape. Foreground silhouettes can be deep navy green for readable depth but absolutely no monochrome or nighttime. Sunlit, joyful, spacious, a hint of wonder, no glossy 3D, no rounded clay toys, no smooth painted brushstrokes or anti-aliased vector.
Reference is ONLY visual input; output illustration alone, NO text, NO letters, NO website UI, NO borders, NO watermarks, NO buttons. This will be a hero illustration in an editorial gaming website with large bold Chinese typography beside it.
```

## atlas

```text
Use case: illustration-story
Asset type: production sprite atlas of 8 colorful pixel-art game-cover illustrations for an editorial minigame website.
One exact 4-column by 2-row equal grid contact sheet, total aspect ratio 8:3, ideally 2048x768. Each panel is 4:3 landscape. NO margins, NO gutters, NO separating lines, NO panel labels or text except numerals on 2048 tiles. Exact cuts at x25%50%75% and y50%. Fully fill each panel. Cover illustrations ONLY, not a website UI.
Art style: crisp authentic illustrated pixel art, detailed 16-bit game art, deliberately visible square pixel clusters, bright saturated color, charming arcade character. Not glossy 3D, not soft clay, not monochrome. Coherent palette of blue, green, coral, gold and cream, vivid cover art with enough darker contrasting local colors for game legibility.
Panel order:
Top left: 2048 numbered square tiles 2 4 8 16 32 64 2048, cream peach coral and golden yellow against a warm terracotta game-board backdrop; pixel borders and little corner highlights.
Top second: cute green pixel snake curved into S on a grassy turquoise checkerboard board, red apple, simple bright eyes, tiny daisies at corners.
Top third: multicolored falling tetromino shapes stacked into a pixel game board, vivid orange gold cyan coral and green blocks, deep cobalt blue well with faint square grid, bright sky-blue border.
Top fourth: original yellow pixel bird flapping between green pixel pipe obstacles in azure daytime sky, white clouds, distant green hills, no exact famous character reproduction.
Bottom left: original orange white pixel cat curled sleeping on a butter-yellow cushion by sunlit pastel coral windowsill, tiny potted plant.
Bottom second: small cozy pixel farm, red barn, orange pumpkins and carrots, bright green fields and rich blue sky.
Bottom third: pixel memory-match cards in peach coral green and blue, two upturned cards showing same orange flower symbol, muted lavender board, crisp stepped square corners.
Bottom fourth: two cream pixel dice with dark red and navy pips falling on a coral orange board, tiny gold pixel sparkles and blue accent shadow.
No titles, words, UI, buttons, logos or screenshots. Each panel is a distinct game art thumbnail, built for CSS background-position so the even 4x2 grid must be geometrically exact.
```
