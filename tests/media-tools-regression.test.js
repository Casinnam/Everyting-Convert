const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const imageConverter = fs.readFileSync(path.join(root, 'image converter', 'image-converter.html'), 'utf8');
const mediaConverter = fs.readFileSync(path.join(root, 'media converter', 'media-converter.html'), 'utf8');

assert(
    imageConverter.includes('const MAX_IMAGES = 10') &&
    imageConverter.includes('selectedFiles = files.slice(0, MAX_IMAGES)') &&
    imageConverter.includes('id="previewList"') &&
    imageConverter.includes("item.className = 'preview-item'") &&
    imageConverter.includes('multiple'),
  'Image converter should support up to 10 selected images with contained preview cards.',
);

assert(
  !imageConverter.includes('id="previewImg"') &&
    !imageConverter.includes('let currentFile = null;'),
  'Image converter should no longer use the old single-image preview state.',
);

assert(
  mediaConverter.includes('const ffmpegCorePaths = [') &&
    mediaConverter.includes('@ffmpeg/core-st@0.11.1') &&
    mediaConverter.includes('async function createEngine(corePath)') &&
    mediaConverter.includes("mainName: 'main'") &&
    mediaConverter.includes('async function runConversionCommand(engine, input, output, outFormat)') &&
    mediaConverter.includes("'-c', 'copy'") &&
    mediaConverter.includes("'-preset', 'ultrafast'") &&
    mediaConverter.includes('for (const corePath of ffmpegCorePaths)') &&
    mediaConverter.includes('id="mediaPreview"'),
  'Media converter should show selected media, load single-thread FFmpeg cores, and avoid needless video re-encoding.',
);

assert(
  mediaConverter.includes('data-language="ko">한국어</button>') &&
    mediaConverter.includes('data-language="es">Español</button>') &&
    mediaConverter.includes('data-language="fr">Français</button>'),
  'Media converter footer language labels should be readable static text.',
);

console.log('media tools regression tests passed');
