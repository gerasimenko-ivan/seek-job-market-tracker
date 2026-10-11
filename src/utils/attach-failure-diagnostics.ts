import type { Page, TestInfo } from '@playwright/test';

interface AttachFailureDiagnostics {
    page: Page;
    testInfo: TestInfo;
}

export async function attachFailureDiagnostics(
    params: AttachFailureDiagnostics,
): Promise<void> {
    const { page, testInfo } = params;

    if (testInfo.status !== 'failed') {
        return;
    }

    try {
        const screenshot = await page.screenshot({
            path: testInfo.outputPath('failure.png'),
            fullPage: true,
        });

        await testInfo.attach('Failure screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    } catch (error) {
        console.warn('Could not capture failure screenshot:', error);
    }

    try {
        const html = await page.content();

        await testInfo.attach('DOM', {
            body: html,
            contentType: 'text/html',
        });
    } catch (error) {
        console.warn('Could not capture failure DOM:', error);
    }
}