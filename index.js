(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  // Search
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  // Pagination
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  // Cutover
  const cutover = document.getElementById("cutover");
  // Judge card or list
  let key = false
  // 共用的變數，預設為第一頁
  let page = 1

  // display all card
  function displayDataList(data) {
    let htmlContent = ''
    if (key === false) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class = "btn btn-info btn-add-favorite" data-id ="${item.id}" > + </button>
            </div>
          </div>
        </div>
        `
      })
    } else if (key === true) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="container">
          <div class="row">
            <div class="col-9">
              <h5>${item.title}</h5>
            </div>
            <div class="col-3 card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class = "btn btn-info btn-add-favorite" data-id ="${item.id}" > + </button>
            </div>
          </div>
        </div>
        `
      })
    }
    dataPanel.innerHTML = htmlContent;
  }

  // display pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
    `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  // display modal
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url)
      .then(response => {
        const data = response.data.results
        console.log(data)

        // insert data into modal ui
        modalTitle.textContent = data.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at : ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // get data by Axois
  axios.get(INDEX_URL) // change here
    .then((response) => {
      data.push(...response.data.results)
      console.log(data)
      // displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch(err => console.log(err))

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    page = event.target.dataset.page;
    if (event.target.tagName === 'A') {
      getPageData(page)
    }
  })

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to cutover
  cutover.addEventListener('click', (event) => {
    console.log(event.target)
    if (event.target.matches("#btn-list")) {
      key = true
      getPageData(page)
    } else if (event.target.matches("#btn-card")) {
      key = false
      getPageData(page);
    }
  })
})();