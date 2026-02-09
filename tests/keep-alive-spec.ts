import { test, expect } from '@playwright/test';

test('Supabase Keep Alive: Add and Delete Post', async ({ page }) => {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  // Ensure secrets are available
  if (!email || !password) {
    console.error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD environment variables.');
    // Fail the test if secrets aren't set in GitHub
    throw new Error('Missing credentials'); 
  }

  console.log(`Navigating to ${siteUrl}/#/blog/login`);
  
  // 1. Go to Login Page (HashRouter aware)
  await page.goto(`${siteUrl}/#/blog/login`);

  // 2. Log in
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for redirect to admin dashboard
  // We look for the dashboard text or the URL change
  await expect(page).toHaveURL(/.*\/blog\/admin/, { timeout: 15000 });
  await expect(page.getByText('Dashboard')).toBeVisible();

  // 3. Create a Blog Entry
  console.log('Creating Keep Alive Post...');
  // Click "+ New Article" link
  await page.click('text=+ New Article');

  // Fill Editor
  const uniqueTitle = `Keep Alive ${Date.now()}`;
  await page.fill('input[type="text"]', uniqueTitle); // Title input
  await page.fill('textarea', 'System heartbeat content. This post should be deleted automatically.'); // Content textarea

  // Submit
  await page.click('text=Publish Post');

  // Wait for redirect back to admin and verify post appears
  await expect(page).toHaveURL(/.*\/blog\/admin/, { timeout: 15000 });
  await expect(page.getByText(uniqueTitle)).toBeVisible();

  // 4. Delete the Blog Entry
  console.log('Deleting Keep Alive Post...');
  
  // Find the row containing our unique title
  const row = page.locator('tr', { hasText: uniqueTitle });
  
  // Setup dialog handler to accept the "Are you sure?" confirmation
  page.on('dialog', dialog => dialog.accept());
  
  // Click the delete button in that specific row
  // The delete button is the second button in the actions cell, or we can find it by text "Delete"
  await row.getByRole('button', { name: 'Delete' }).click();

  // 5. Verify deletion
  await expect(page.getByText(uniqueTitle)).not.toBeVisible();
  
  console.log('Keep Alive Sequence Complete.');
});
