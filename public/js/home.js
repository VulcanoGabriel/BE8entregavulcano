document.getElementById("btnPrev").onclick = () => {
  const prevPage = document.getElementById("prevPage").value

  const limit = document.getElementById("limit").value

  const query = document.getElementById("query").value

  const url = `/?page=${prevPage}&limit=${limit}&query=${query}`

  document.location.href = url

}

document.getElementById("btnNext").onclick = () => {
  const prevPage = document.getElementById("nextPage").value

  const limit = document.getElementById("limit").value

  const query = document.getElementById("query").value

  const url = `/?page=${prevPage}&limit=${limit}&query=${query}`

  document.location.href = url

}

document.getElementById("btnPage").onclick = () => {

  const pagina = document.getElementById("page").value

  const limit = document.getElementById("limit").value


  const query = document.getElementById("query").value

  const url = `/?page=${pagina}&limit=${limit}&query=${query}`

  document.location.href = url

}

