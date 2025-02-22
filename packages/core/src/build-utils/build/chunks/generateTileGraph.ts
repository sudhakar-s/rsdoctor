import { Plugin } from '@rsdoctor/types';
import path from 'path';
import fs from 'fs';
import { debug } from '@rsdoctor/utils/logger';
import { generateReport } from 'webpack-bundle-analyzer/lib/viewer';
import { RsdoctorOutputFolder } from '@rsdoctor/types/dist/constants';

export const TileGraphReportName = 'rsdoctor-tile-graph.html';

type IGenerateReportOpts = {
  reportFilename: string;
  reportTitle?: string;
  bundleDir?: string;
  openBrowser?: boolean;
};
async function generateJSONReportUtil(
  bundleStats: Plugin.BaseStats,
  opts: IGenerateReportOpts,
) {
  await generateReport(bundleStats, {
    ...opts,
    logger: {
      warn: () => {},
      info: () => {},
      error: (e: any) => {
        console.log(e);
      },
    },
  });
}

export async function generateTileGraph(
  bundleStats: Plugin.BaseStats,
  opts: IGenerateReportOpts,
  buildOutputPath: string,
) {
  try {
    const tileReportHtmlDir = path.join(buildOutputPath, RsdoctorOutputFolder);
    if (!fs.existsSync(tileReportHtmlDir)) {
      fs.mkdirSync(tileReportHtmlDir);
    }
    const { reportFilename } = opts;
    await generateJSONReportUtil(bundleStats, {
      ...opts,
      openBrowser: false,
      bundleDir: tileReportHtmlDir,
    });

    return path.join(tileReportHtmlDir, `${reportFilename}`);
  } catch (e) {
    debug(() => `Generate webpack-bundle-analyzer tile graph has error:${e}`);
    return null;
  }
}
