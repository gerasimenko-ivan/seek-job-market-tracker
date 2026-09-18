import { Page } from '@playwright/test';

export interface ScreenshotParams {
    page: Page;
    name: string;
}

export async function takeScreenshot(param: ScreenshotParams): Promise<void> {
    const { page, name } = param;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    await page.screenshot({
        path: `screenshots/${timestamp}-${name}.png`,
    });
}
