import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const SOURCE_DIR = path.join(process.env.HOME!, 'Documents', 'speaking');
const PROJECT_ROOT = process.cwd();
const SPEAKING_OUT = path.join(PROJECT_ROOT, 'public', 'speaking-images');
const HACKATHON_OUT = path.join(PROJECT_ROOT, 'public', 'hackathon-images');
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'speaking-images.json');

const FULL_MAX_WIDTH = 1600;
const THUMB_MAX_WIDTH = 400;

const VIDEO_EXTENSIONS = ['.mov', '.mp4', '.avi', '.mkv'];

const FOLDER_MAP: Record<string, { id: string; type: 'speaking' | 'hackathon' }> = {
    'APU - Hiring in Tech': { id: 'apu-hiring-tech-2025', type: 'speaking' },
    'BERNAMA TV': { id: 'bernama-tv-interview-2025', type: 'speaking' },
    'CRADLE Interview': { id: 'cradle-interview-2025', type: 'speaking' },
    'DSCUTP - Flutter Workshops': { id: 'dsc-utp-flutter-2021', type: 'speaking' },
    'DSCUTP - Git Workshop': { id: 'dsc-utp-git-workshop-2021', type: 'speaking' },
    'IDFR': { id: 'idfr-ai-work-2025', type: 'speaking' },
    'UM Data Science Talk 2025': { id: 'um-data-science-2025', type: 'speaking' },
    'UPM semiconductor ai panel': { id: 'ai-semiconductor-forum-2024', type: 'speaking' },
    'US Digital Dialoge': { id: 'us-digital-dialogue-2025', type: 'speaking' },
    'UTP Nexoria - STAR (sekolah tuanku abdul rahman - Career in tech': { id: 'utp-nexoria-star-2025', type: 'speaking' },
    'ameu economic summit': { id: 'ameu-economics-summit-2024', type: 'speaking' },
    'antler ai ml machine learning user group lesson from building llm app in production': { id: 'antler-ai-ml-llm-2024', type: 'speaking' },
    'friendsoffigma': { id: 'friends-of-figma-2025', type: 'speaking' },
    'itrain': { id: 'itrain-nextgen-ai-2025', type: 'speaking' },
    'leds studio': { id: 'leds-studio-exploration-2024', type: 'speaking' },
    'tech trove 2- taylors uni - judging': { id: 'tech-trove-hackathon-2025', type: 'speaking' },
    'techitorleaveit podcast': { id: 'techitorleaveit-podcast-2025', type: 'speaking' },
    'um spill the tea stories from data science frontier 2024': { id: 'spillthetea-mytech-2024', type: 'speaking' },
    '| Aug 15 | APU - APAC Tech Talk Ep 2 | Lessons Learned in Building LLM App in Production | Asia Pacific Analytics Club |': { id: 'apac-llm-production-2024', type: 'speaking' },
    'aitinkerers': { id: 'ai-tinkerers-paynet-2025', type: 'speaking' },
    'rtm tv1 interview': { id: 'rtm-tv1-interview-2025', type: 'speaking' },
    'utp expert panel': { id: 'utp-expert-panel-2025', type: 'speaking' },
    'yayasan-peneraju nextgen': { id: 'future-ready-connect-2025', type: 'speaking' },
    'UM KitaHack - Mentoring 2025': { id: 'um-kitahack-mentoring-2025', type: 'hackathon' },
    'UM Pitchlab': { id: 'um-pitchlab-2025', type: 'hackathon' },
    'taylors uni kiyoko-con game jam 0 judging': { id: 'kiyoko-con-game-jam-2025', type: 'hackathon' },
};

function isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.heic', '.webp'].includes(ext) && !VIDEO_EXTENSIONS.includes(ext);
}

function isVideoFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return VIDEO_EXTENSIONS.includes(ext);
}

async function convertHeicToBuffer(filePath: string): Promise<Buffer> {
    // Try sharp first
    try {
        return await sharp(filePath).jpeg({ quality: 90 }).toBuffer();
    } catch {
        // Fallback to sips (macOS)
        console.log(`  sharp failed for HEIC, trying sips: ${path.basename(filePath)}`);
        const tmpPath = filePath + '.tmp.jpg';
        try {
            execSync(`sips -s format jpeg "${filePath}" --out "${tmpPath}"`, { stdio: 'pipe' });
            const buffer = fs.readFileSync(tmpPath);
            fs.unlinkSync(tmpPath);
            return buffer;
        } catch (e) {
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            throw e;
        }
    }
}

async function processImage(
    inputPath: string,
    outputDir: string,
    thumbDir: string,
    index: number
): Promise<string> {
    const filename = `${String(index).padStart(2, '0')}.jpg`;
    const fullOutPath = path.join(outputDir, filename);
    const thumbOutPath = path.join(thumbDir, filename);

    const ext = path.extname(inputPath).toLowerCase();
    let inputBuffer: Buffer;

    if (ext === '.heic') {
        inputBuffer = await convertHeicToBuffer(inputPath);
    } else {
        inputBuffer = fs.readFileSync(inputPath);
    }

    // Full size
    await sharp(inputBuffer)
        .resize({ width: FULL_MAX_WIDTH, withoutEnlargement: true })
        .rotate() // auto-rotate based on EXIF
        .jpeg({ quality: 85 })
        .toFile(fullOutPath);

    // Thumbnail
    await sharp(inputBuffer)
        .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
        .rotate()
        .jpeg({ quality: 80 })
        .toFile(thumbOutPath);

    return filename;
}

async function main() {
    console.log('Processing speaking images...\n');

    // Seed from the existing manifest rather than starting empty. This script
    // only knows about engagements present in FOLDER_MAP and in the local
    // ~/Documents/speaking tree; starting from {} meant any run silently deleted
    // every entry added by another route (e.g. scripts/site/images.ts, which the
    // Telegram agent uses).
    const manifest: Record<string, string[]> = fs.existsSync(MANIFEST_PATH)
        ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
        : {};
    const folders = fs.readdirSync(SOURCE_DIR);

    for (const folder of folders) {
        const folderPath = path.join(SOURCE_DIR, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const mapping = FOLDER_MAP[folder];
        if (!mapping) {
            console.log(`Skipping unmapped folder: ${folder}`);
            continue;
        }

        const { id, type } = mapping;
        const baseOut = type === 'speaking' ? SPEAKING_OUT : HACKATHON_OUT;
        const outputDir = path.join(baseOut, id);
        const thumbDir = path.join(outputDir, 'thumbs');

        fs.mkdirSync(outputDir, { recursive: true });
        fs.mkdirSync(thumbDir, { recursive: true });

        // Get image files, sorted by name
        const files = fs.readdirSync(folderPath)
            .filter(f => {
                // Skip files with double extensions like .HEIC.MOV
                const parts = f.split('.');
                if (parts.length > 2) {
                    const lastExt = '.' + parts[parts.length - 1].toLowerCase();
                    if (VIDEO_EXTENSIONS.includes(lastExt)) return false;
                }
                return isImageFile(f) && !isVideoFile(f);
            })
            .sort();

        if (files.length === 0) {
            console.log(`No images in: ${folder}`);
            continue;
        }

        console.log(`Processing ${folder} → ${id} (${files.length} images)`);

        const processedFiles: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(folderPath, files[i]);
            try {
                const filename = await processImage(filePath, outputDir, thumbDir, i + 1);
                processedFiles.push(filename);
                process.stdout.write('.');
            } catch (e) {
                console.error(`\n  Failed to process ${files[i]}: ${e}`);
            }
        }
        console.log(` done (${processedFiles.length}/${files.length})`);

        if (processedFiles.length > 0) {
            const prefix = type === 'speaking' ? '/speaking-images' : '/hackathon-images';
            manifest[id] = processedFiles.map(f => `${prefix}/${id}/${f}`);
        }
    }

    // Write manifest
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\nManifest written to ${MANIFEST_PATH}`);
    console.log(`Total engagements processed: ${Object.keys(manifest).length}`);
}

main().catch(console.error);
