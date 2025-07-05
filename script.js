// Track login state
let isLoggedIn = false;

// Toggle Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
}

document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);

// Sample friend data
const friends = [
  { id: 1, name: "Emma Johnson", age: 28, gender: "Female", interests: "Photography, hiking, cooking", avatar: "👩‍🦰" },
  { id: 2, name: "Liam Wilson", age: 32, gender: "Male", interests: "Gaming, movies, technology", avatar: "👨" },
  { id: 3, name: "Olivia Martinez", age: 24, gender: "Female", interests: "Painting, yoga, travel", avatar: "👩" },
  { id: 4, name: "Noah Thompson", age: 29, gender: "Male", interests: "Basketball, music production, reading", avatar: "👨‍🦱" },
  { id: 5, name: "Sophia Lee", age: 26, gender: "Female", interests: "Dancing, fashion design, volunteering", avatar: "👩‍🦱" },
  { id: 6, name: "Alex Chen", age: 31, gender: "Non-binary", interests: "Coding, board games, astronomy", avatar: "🧑" }
];

// Current page management
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active-page');
  });
  document.getElementById(pageId).classList.add('active-page');

  // If showing friend list, load the friends
  if (pageId === 'friendList') {
    renderFriends(friends);
  }

  // Scroll to top when changing pages
  window.scrollTo(0, 0);
}

// Render friends to the friend list
function renderFriends(friendsToRender) {
  const container = document.getElementById('friendsContainer');
  const noResults = document.getElementById('noResults');

  container.innerHTML = '';

  if (friendsToRender.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');

    friendsToRender.forEach(friend => {
      const friendCard = document.createElement('div');
      friendCard.className = 'bg-white rounded-xl shadow-lg overflow-hidden card';

      const genderColor = {
        'Male': 'bg-blue-100',
        'Female': 'bg-pink-100',
        'Non-binary': 'bg-purple-100'
      };

      friendCard.innerHTML = `
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="text-4xl mr-4">${friend.avatar}</div>
            <div>
              <h3 class="text-xl font-semibold">${friend.name}</h3>
              <div class="flex items-center mt-1">
                <span class="${genderColor[friend.gender] || 'bg-gray-100'} text-xs px-2 py-1 rounded-full">${friend.gender}</span>
                <span class="text-gray-500 text-sm ml-2">${friend.age} years</span>
              </div>
            </div>
          </div>
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Interests</h4>
            <p class="text-gray-700">${friend.interests}</p>
          </div>
          <button class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg btn-primary">Connect</button>
        </div>
      `;

      container.appendChild(friendCard);

      // Add event listener on the Connect button
      const connectBtn = friendCard.querySelector('button.btn-primary');
      connectBtn.addEventListener('click', () => {
        if (!isLoggedIn) {
          showPage('registrationForm');
        } else {
          alert(`You are connected with ${friend.name}!`);
        }
      });
    });
  }
}

// Filter friends based on search input
function filterFriends() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  const filteredFriends = friends.filter(friend => {
    return friend.name.toLowerCase().includes(searchTerm) ||
           friend.interests.toLowerCase().includes(searchTerm);
  });

  renderFriends(filteredFriends);
}

// Form validation and submission
function handleRegistration(event) {
  event.preventDefault();

  // Reset error messages
  document.querySelectorAll('[id$="Error"]').forEach(el => el.classList.add('hidden'));

  // Get form values
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value;
  const email = document.getElementById('email').value.trim();
  const gender = document.getElementById('gender').value;
  const interests = document.getElementById('interests').value.trim();

  // Validate form
  let isValid = true;

  if (!name) {
    document.getElementById('nameError').classList.remove('hidden');
    isValid = false;
  }

  if (!age || age < 13 || age > 120) {
    document.getElementById('ageError').classList.remove('hidden');
    isValid = false;
  }

  if (!email || !validateEmail(email)) {
    document.getElementById('emailError').classList.remove('hidden');
    isValid = false;
  }

  if (!gender) {
    document.getElementById('genderError').classList.remove('hidden');
    isValid = false;
  }

  if (!interests) {
    document.getElementById('interestsError').classList.remove('hidden');
    isValid = false;
  }

  if (isValid) {
    // Check if admin
    if (name.toLowerCase().includes('admin')) {
      isLoggedIn = true;  // Admin logs in
      showPage('registrationConfirmationAdmin');
    } else {
      // Add the new user to friends list
      const newFriend = {
        id: friends.length + 1,
        name: name,
        age: parseInt(age),
        gender: gender,
        interests: interests,
        avatar: getRandomAvatar()
      };

      friends.push(newFriend);
      isLoggedIn = true; // User logs in
      showPage('registrationConfirmation');
    }

    // Reset form
    document.getElementById('registerForm').reset();
  }
}

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Get random avatar emoji
function getRandomAvatar() {
  const avatars = ['👩', '👨', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', '👱‍♀️', '👱‍♂️', '🧑'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  showPage('homepage');
});
