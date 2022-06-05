var input_content = null;
var input_title = null;

import "regenerator-runtime/runtime";
import { initContract, login, logout, getBlogs, addBlog,
         counterDecrement, counterReset } from './near/utils'

function resetUI(){
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
}

// Animations
document.querySelector('#c').addEventListener('click', () => {
  document.querySelector('#left').classList.toggle('eye');
});
document.querySelector('#b').addEventListener('click', () => {
  document.querySelector('#right').classList.toggle('eye');
});
document.querySelector('#d').addEventListener('click', () => {
  document.querySelector('.dot').classList.toggle('on');
});

document.querySelector('#title').addEventListener('change', async  () => {
  input_title = document.querySelector('#title').value;
});
document.querySelector('#content').addEventListener('change', async  () => {
  input_content = document.querySelector('#content').value;
});



// Buttons - Interact with the Smart Contract
document.querySelector('#addBlog').addEventListener('click', async () => {
  resetUI();
  console.log("input title is", input_title);
  console.log("input content is", input_content);
  await addBlog(input_title, input_content, 1);
  await updateUI();
});

document.querySelector('#minus').addEventListener('click', async  () => {
  resetUI();
  await counterDecrement();
  await updateUI();
});

document.querySelector('#a').addEventListener('click', async  () => {
  resetUI();
  await counterReset();
  await updateUI();
});

// Log in and log out users using NEAR Wallet
document.querySelector('.sign-in .btn').onclick = login;
document.querySelector('.sign-out .btn').onclick = logout;

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
                    .then(flow)
                    .catch(console.error)

function flow(){
  if (window.walletConnection.isSignedIn()){
    signedInFlow()
  }else{
    signedOutFlow()
  }
  updateUI()
}

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('.sign-in').style.display = 'block';
  document.querySelectorAll('.interact').forEach(button => button.disabled = true)
}

// Displaying the signed in flow container and display counter
async function signedInFlow() {
  document.querySelector('.sign-out').style.display = 'block';
  document.querySelectorAll('.interact').forEach(button => button.disabled = false)
}

async function updateUI(){
  let blogs = await getBlogs();
  document.querySelector('#show').classList.replace('loader','number');
  document.querySelector('#show').innerText = blogs === undefined ? 'calculating...' : blogs;
  document.querySelector('#left').classList.toggle('eye');

  if(blogs != undefined){
    var innerText = '';
    let blogArr = Object.keys(blogs).map((k) => blogs[k])

    for (var i = 0 ;i < blogArr.length; i++){
      innerText += '<div class="col"><div class="card"><div class="card-body"><h5 class="card-title">' + blogArr[i].title + '</h5><p class="card-text">'+ blogArr[i].content +'</p><a href="#" class="btn btn-primary">Detail</a></div></div></div>'
    }

    document.querySelector('.list-blog').innerHTML = innerText;
  }
}