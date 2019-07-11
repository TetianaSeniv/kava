const url = 'https://api.myjson.com/bins/152f9j';

let data = [];
let page = 0;
let pageSize = 10;

function onSortChange(event) {
  console.log(event)
}

function getPosts() {
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      data = res.data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
}

function renderPosts() {
  const postsContainer = document.querySelector('#posts');
  const firstIndex = page * pageSize;
  const lastIndex = (page + 1) * pageSize;
  const pagedData = data.slice(firstIndex, lastIndex);
  const posts = createPosts(pagedData);
  postsContainer.insertAdjacentHTML('beforeend', posts);
}

function createPost(post) {
  return `
    <div class="article">
      <img src="${post.image}" alt="post image">
      <h2>${post.title}</h2>
      <p>${post.description}</p>
      <div class="statistic">
        <span>${post.createdAt}</span>
        <span>${post.tags}</span>
      </div>
    </div>
  `;
}


function createPosts(posts) {
  return posts.reduce((acc, curr) => acc += createPost(curr), '')
}

function setupScrollListener() {
  const postsContainer = document.querySelector('#posts');
    window.addEventListener('scroll', (event) => {
      if (window.scrollY > postsContainer.clientHeight - window.innerHeight / 2) {
        if (page < data.length / pageSize -1) {
          console.log('current page', page)
          page += 1;
          renderPosts();
        }
      }
    });
}

function init() {
  getPosts().then(() => {
    renderPosts();
    setupScrollListener();
  })
}

init();