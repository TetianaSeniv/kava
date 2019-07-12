const url = 'https://api.myjson.com/bins/152f9j';

let data = [];
let sortedData = [];
let page = 0;
let pageSize = 10;

function onSortChange(event) {
  reset();
  sortData(event.value);
  renderPosts();
}

function onReset() {
  reset();
  renderPosts();
}

function reset() {
  page = 0;
  const postsContainer = document.querySelector('#posts');
  postsContainer.innerHTML = '';
}

function sortData(sortBy) {
  if (!sortBy) {
    return sortedData = data;
  }

  if (sortBy === 'date:desc') {
    sortedData = [...data].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    });
    return;
  }

  sortedData = [...data].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  });
}

function getPosts() {
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      const posts = res.data.map((item) => {
        const date = new Date(item.createdAt);
        return {
          title: item.title,
          description: item.description,
          image: item.image,
          tags: item.tags,
          createdAt: date,
          id: `post-${Math.abs(date.getTime())}`
        }
      });
      
      data = posts;
      sortedData = posts;
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
}

function renderPosts() {
  const postsContainer = document.querySelector('#posts');
  const firstIndex = page * pageSize;
  const lastIndex = (page + 1) * pageSize;
  const pagedData = sortedData.slice(firstIndex, lastIndex);
  const posts = createPosts(pagedData);
  postsContainer.insertAdjacentHTML('beforeend', posts);
}

function createPost(post) {
  return `
    <div class="article" id="${post.id}">
      <img src="${post.image}" alt="post image">
      <h2>${post.title}</h2>
      <p>${post.description}</p>
      <div class="statistic">
        <span>${post.createdAt.toDateString()}</span>
        <span>${post.tags}</span>
      </div>
      <button onclick="onDelete('${post.id}')">delete</button>
    </div>
  `;
}

function onDelete(id) {
  const article = document.getElementById(id);
  article.parentNode.removeChild(article);
  data = data.filter((item) => {
    return item.id !== id;
  });
}

function createPosts(posts) {
  return posts.reduce((acc, curr) => acc += createPost(curr), '')
}

function setupScrollListener() {
  const postsContainer = document.querySelector('#posts');
    window.addEventListener('scroll', (event) => {
      if (window.scrollY > postsContainer.clientHeight - window.innerHeight / 2) {
        if (page < data.length / pageSize -1) {
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