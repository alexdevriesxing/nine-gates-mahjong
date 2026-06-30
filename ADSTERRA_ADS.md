# Adsterra Ad Units Source of Truth

This file serves as the master source of truth for all Adsterra ad unit scripts and keys integrated into Nine Gates Mahjong.

## Current implementation notes
- Banner units are mounted through `/ad.html` with explicit `placement`, width, and height parameters.
- Above-the-fold placements use eager iframe loading; lower placements remain lazy.
- React now renders only the ad size that matches the current viewport instead of mounting hidden desktop/mobile iframes.
- `/ads.txt` is a real text file instead of the SPA fallback. Add the exact authorized seller lines from the Adsterra dashboard when available.

## 1. Native Banner
- **Container ID:** `container-c9947e22755623a8fe8d556aa1ba06d5`
- **Script URL:** `https://pl29884536.effectivecpmnetwork.com/c9947e22755623a8fe8d556aa1ba06d5/invoke.js`
- **Embed Code:**
```html
<script async="async" data-cfasync="false" src="https://pl29884536.effectivecpmnetwork.com/c9947e22755623a8fe8d556aa1ba06d5/invoke.js"></script>
<div id="container-c9947e22755623a8fe8d556aa1ba06d5"></div>
```

## 2. Social Bar
- **Script URL:** `https://pl29884537.effectivecpmnetwork.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js`
- **Embed Code:**
```html
<script src="https://pl29884537.effectivecpmnetwork.com/3e/87/21/3e8721aaa237eaa7a4118f7681d665f6.js"></script>
```

## 3. Banner 728x90 (Desktop Leaderboard)
- **Key:** `759777117285af8156ae217ed7fc2a0b`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : '759777117285af8156ae217ed7fc2a0b',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/759777117285af8156ae217ed7fc2a0b/invoke.js"></script>
```

## 4. Banner 468x60 (Tablet Leaderboard)
- **Key:** `3d687f838f7b1a2353a56d39e059e906`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : '3d687f838f7b1a2353a56d39e059e906',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/3d687f838f7b1a2353a56d39e059e906/invoke.js"></script>
```

## 5. Banner 320x50 (Mobile Leaderboard)
- **Key:** `cdc33de3506804ba73d2d3661ed4fd0a`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : 'cdc33de3506804ba73d2d3661ed4fd0a',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/cdc33de3506804ba73d2d3661ed4fd0a/invoke.js"></script>
```

## 6. Banner 300x250 (Rectangle / Sidebar / Content)
- **Key:** `933dafe9ee5494fdc3ed74bb4ad047a6`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : '933dafe9ee5494fdc3ed74bb4ad047a6',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/933dafe9ee5494fdc3ed74bb4ad047a6/invoke.js"></script>
```

## 7. Banner 160x600 (Skyscraper)
- **Key:** `f2411eb715b2fe1af0fafb73c5825345`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : 'f2411eb715b2fe1af0fafb73c5825345',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/f2411eb715b2fe1af0fafb73c5825345/invoke.js"></script>
```

## 8. Banner 160x300 (Half Skyscraper)
- **Key:** `4492bd5c94522d00777227f98028a4c4`
- **Embed Code:**
```html
<script>
  atOptions = {
    'key' : '4492bd5c94522d00777227f98028a4c4',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/4492bd5c94522d00777227f98028a4c4/invoke.js"></script>
```
