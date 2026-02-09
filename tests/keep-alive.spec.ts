import { test, expect } from '@playwright/test';

test('Supabase Keep Alive: Add and Delete Post', async ({ page }) => {
  // Ensure we don't have double slashes if env var has trailing slash
  const baseUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  // Ensure secrets are available
  if (!email || !password) {
    throw new Error('Missing TEST_USER_EMAIL or TEST_USER_PASSWORD environment variables.');
  }

  const loginUrl = `${baseUrl}/#/blog/login`;
  console.log(`Navigating to ${loginUrl}`);
  
  // 1. Go to Login Page
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

  // IMPORTANT: Wait for the app loading screen to go away
  // The app renders a div#loading-screen initially. We must wait for it to detach.
  try {
    await page.waitForSelector('#loading-screen', { state: 'detached', timeout: 10000 });
  } catch (e) {
    console.log('Loading screen did not appear or persisted too long, continuing...');
  }

  // 2. Log in
  // Using getByLabel which is more robust as it ensures accessibility connection
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect to admin dashboard
  await expect(page).toHaveURL(/.*\/blog\/admin/, { timeout: 20000 });
  await expect(page.getByText('Dashboard')).toBeVisible();

  // 3. Create a Blog Entry
  console.log('Creating Keep Alive Post...');
  // Use getByRole for links to ensure we are clicking the right navigation item
  await page.getByRole('link', { name: /new article/i }).click();

  // Wait for Editor to load
  await expect(page.getByRole('heading', { name: 'New Article' })).toBeVisible();

  const uniqueTitle = `Keep Alive ${Date.now()}`;
  
  // Use getByLabel now that we added IDs to Editor.tsx
  await page.getByLabel('Title').fill(uniqueTitle);
  await page.getByLabel('Content').fill('System heartbeat content. This post should be deleted automatically.');

  // Submit
  await page.getByRole('button', { name: /publish post/i }).click();

  // Wait for redirect back to admin and verify post appears
  await expect(page).toHaveURL(/.*\/blog\/admin/, { timeout: 20000 });
  
  // 4. Verify Post Exists
  // We explicitly wait for the row to appear to handle network latency
  const row = page.locator('tr', { hasText: uniqueTitle });
  await expect(row).toBeVisible();

  // 5. Delete the Blog Entry
  console.log('Deleting Keep Alive Post...');
  
  // Setup dialog handler to accept the "Are you sure?" confirmation
  page.on('dialog', dialog => dialog.accept());
  
  // Click the delete button in that specific row
  await row.getByRole('button', { name: 'Delete' }).click();

  // 6. Verify deletion
  await expect(row).not.toBeVisible();
  
  console.log('Keep Alive Sequence Complete.');
});
