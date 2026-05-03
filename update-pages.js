const fs = require('fs');
const path = require('path');
const files = ['health','jobs','travel','maps','media','mail','office','calendar','shop','workspace'];
const appDir = path.join(__dirname, 'src', 'app');

for (const f of files) {
  const fp = path.join(appDir, f, 'page.tsx');
  if (!fs.existsSync(fp)) continue;
  let c = fs.readFileSync(fp, 'utf8');
  // Update header
  c = c.replace(/className="flex items-center gap-3 cs-panel p-4 rounded-md"/g, 'className="cs-header animate-fadeInUp"');
  // Update sections
  c = c.replace(/cs-panel p-4 rounded-md border border-white\/10/g, 'cs-card p-4');
  c = c.replace(/cs-panel p-4 rounded-md/g, 'cs-card p-4');
  c = c.replace(/cs-panel rounded-xl/g, 'cs-card');
  c = c.replace(/cs-panel rounded-md/g, 'cs-card');
  // Update colors
  c = c.replace(/text-cs-orange/g, 't-accent');
  c = c.replace(/bg-\[#1a1a1a\]/g, 'bg-panel-solid');
  c = c.replace(/bg-\[#151515\]/g, 'bg-panel-solid');
  c = c.replace(/bg-\[#181818\]/g, 'bg-panel-solid');
  c = c.replace(/border border-white\/10/g, '');
  c = c.replace(/border border-white\/15/g, '');
  c = c.replace(/text-white\/60/g, 't-secondary');
  c = c.replace(/text-white\/50/g, 't-secondary');
  c = c.replace(/text-white\/40/g, 't-tertiary');
  c = c.replace(/text-white\/70/g, 't-secondary');
  c = c.replace(/text-white\/80/g, 't-primary');
  c = c.replace(/text-white\/85/g, 't-primary');
  // Update roundness
  c = c.replace(/rounded-md/g, 'rounded-xl');
  // Update outer container
  c = c.replace(/min-h-\[100dvh\] max-w-md mx-auto p-4 flex flex-col gap-4/g, 'min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom');
  c = c.replace(/min-h-\[100dvh\] p-4 max-w-md mx-auto flex flex-col gap-4/g, 'min-h-[100dvh] max-w-md mx-auto flex flex-col gap-3 px-3 pt-3 pb-24 safe-bottom');
  // Update inputs
  c = c.replace(/bg-\[#1a1a1a\] border border-white\/10 rounded-xl p-2 text-sm/g, 'cs-input !py-2.5 !text-xs');
  c = c.replace(/bg-\[#1a1a1a\] rounded-xl p-3/g, 'rounded-xl p-3');
  // Button updates
  c = c.replace(/cs-btn rounded-xl/g, 'cs-btn rounded-2xl');
  
  fs.writeFileSync(fp, c, 'utf8');
  console.log('Updated:', f);
}
