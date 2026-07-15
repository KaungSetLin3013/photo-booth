// CONFIG — REPLACE THESE WITH YOUR SUPABASE DETAILS
const SUPABASE_URL = 'https://lkzcuhuxyporcgedbbuo.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_Os2lqYitPAzbVmXrl0ZlTg_JHbg7v5M';
const PLACEHOLDER_URL = 'YOUR_SUPABASE_URL';
const PLACEHOLDER_KEY = 'YOUR_SUPABASE_ANON_KEY';
const BUCKET_NAME = 'photos';
const TABLE_NAME = 'photos';
let ADMIN_PASSWORD = null;
let uploaderName = localStorage.getItem('uploaderName') || '';
let PHOTO_LIMIT = null; // loaded from DB
let devicePhotoCount = 0;

// Generate or retrieve a persistent device ID
function getDeviceId() {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('device_id', id);
  }
  return id;
}
const DEVICE_ID = getDeviceId();
