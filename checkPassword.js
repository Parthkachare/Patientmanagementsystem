const bcrypt = require('bcryptjs');

const hashedPassword = '$2b$10$cG06fjbIlyGYmDnOzJ36/uWfNpocOufKB/9dwQEYoICPEPL5E8KEy';
const originalPassword = 'admin123';  // The password you want to test

bcrypt.compare(originalPassword, hashedPassword, function(err, result) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  if (result) {
    console.log('✅ Password matches!');
  } else {
    console.log('❌ Password does NOT match.');
  }
});
