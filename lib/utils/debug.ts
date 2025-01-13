export const debugStorage = () => {
  try {
    const profile = localStorage.getItem('user_profile');
    console.log('LocalStorage user_profile:', profile);
    if (profile) {
      console.log('Parsed profile:', JSON.parse(profile));
    }
  } catch (error) {
    console.error('Debug storage error:', error);
  }
}; 