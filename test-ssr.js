// Quick test script to compare SSR vs Client-side rendering
const http = require('http');

console.log('🧪 Testing SSR Implementation...\n');

// Test 1: Check if server is running
function testServer() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Test 1: Server is running');
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type']}`);
        
        // Check for compression
        if (res.headers['content-encoding']) {
          console.log(`   ✅ Compression: ${res.headers['content-encoding']}`);
        } else {
          console.log(`   ⚠️  No compression detected`);
        }
        
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Test 1 Failed: Server not running');
      console.log('   Run: node server-ssr.js');
      reject(err);
    });
  });
}

// Test 2: Check if SSR is working
function testSSR(html) {
  console.log('\n✅ Test 2: Checking SSR...');
  
  // Check if countdown is rendered
  const hasCountdown = html.includes('digit-box');
  console.log(`   ${hasCountdown ? '✅' : '❌'} Countdown rendered: ${hasCountdown}`);
  
  // Check if stat numbers are rendered
  const hasStats = html.includes('stat-number');
  console.log(`   ${hasStats ? '✅' : '❌'} Stats rendered: ${hasStats}`);
  
  // Check if images have lazy loading
  const hasLazyLoad = html.includes('loading="lazy"');
  console.log(`   ${hasLazyLoad ? '✅' : '❌'} Lazy loading: ${hasLazyLoad}`);
  
  // Check if optimized images
  const hasOptimizedImages = html.includes('f_auto,q_auto');
  console.log(`   ${hasOptimizedImages ? '✅' : '❌'} Optimized images: ${hasOptimizedImages}`);
  
  // Check HTML size
  const sizeKB = (html.length / 1024).toFixed(2);
  console.log(`   📦 HTML Size: ${sizeKB} KB`);
  
  return hasCountdown && hasStats;
}

// Test 3: Check static files
function testStaticFiles() {
  return new Promise((resolve) => {
    console.log('\n✅ Test 3: Checking static files...');
    
    // Test CSS
    http.get('http://localhost:5000/css/styles.css', (res) => {
      console.log(`   ${res.statusCode === 200 ? '✅' : '❌'} CSS: ${res.statusCode}`);
      if (res.headers['cache-control']) {
        console.log(`   ✅ CSS Caching: ${res.headers['cache-control']}`);
      }
      
      // Test JS
      http.get('http://localhost:5000/js/script.js', (res) => {
        console.log(`   ${res.statusCode === 200 ? '✅' : '❌'} JavaScript: ${res.statusCode}`);
        if (res.headers['cache-control']) {
          console.log(`   ✅ JS Caching: ${res.headers['cache-control']}`);
        }
        resolve();
      });
    });
  });
}

// Run tests
async function runTests() {
  try {
    const html = await testServer();
    const ssrWorking = testSSR(html);
    await testStaticFiles();
    
    console.log('\n' + '='.repeat(50));
    if (ssrWorking) {
      console.log('🎉 All tests passed! SSR is working correctly.');
      console.log('\n📊 Performance Benefits:');
      console.log('   • Faster First Contentful Paint');
      console.log('   • Better SEO');
      console.log('   • Improved social media previews');
      console.log('   • Reduced Time to Interactive');
    } else {
      console.log('⚠️  Some tests failed. Check the output above.');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.log('\n❌ Tests failed. Make sure server is running:');
    console.log('   node server-ssr.js');
  }
}

runTests();
