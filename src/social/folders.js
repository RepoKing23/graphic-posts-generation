/**
 * Folder structure — the skill's `create-article-folder.ts`, as a function.
 *
 * Standalone posts would get their own folder; everything in this repo is
 * derive mode, because the poster is the source article and all three platform
 * posts are adaptations of it. So the layout mirrors that:
 *
 *   out/<id>-<slug>.png                    the source poster
 *   out/posts/<id>-<slug>/<platform>/      one folder per derived post
 *
 * One folder per platform, not per car, because the skill's database row is
 * per platform post: each folder is exactly one row's `output_folder`.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { OUT, ROOT } from '../paths.mjs';

export const POSTS = path.join(OUT, 'posts');

/** Absolute folder for one derived post, created if absent. */
export async function articleFolder(car, platform) {
  const dir = path.join(POSTS, `${car.id}-${car.slug}`, platform);
  await mkdir(dir, { recursive: true });
  return dir;
}

/** Repo-relative path, for the manifest and the .md front matter. */
export const relative = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');
