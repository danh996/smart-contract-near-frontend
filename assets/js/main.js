var input_content = null;
var input_title = null;

import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";
import { initContract, login, logout, getBlogs, addBlog,
         deleteBlog, counterReset } from './near/utils'

function resetUI(){
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
}

// Animations


document.querySelector('#title').addEventListener('change', async  () => {
  input_title = document.querySelector('#title').value;
});
document.querySelector('#content').addEventListener('change', async  () => {
  input_content = document.querySelector('#content').value;
});



// Buttons - Interact with the Smart Contract
document.querySelector('#addBlog').addEventListener('click', async () => {
  resetUI();
  await addBlog(input_title, input_content, 1);
  await updateUI();
});


async function delete_blog(){

  $('.deleteBlog').on("click", async function(){
    var blog_id = $(this).attr('blog_id');
    resetUI();
    await deleteBlog(blog_id);
    await updateUI();
  })
}

// document.querySelector('#a').addEventListener('click', async  () => {
//   resetUI();
//   await counterReset();
//   await updateUI();
// });

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
  

  if(blogs != undefined){
    var innerText = '';

    for (var key of Object.keys(blogs)) {
      innerText += '<div class="col"><div class="card"><div class="card-body"><h5 class="card-title">' + blogs[key].title + '</h5><p class="card-text">'+ blogs[key].content +'</p><a href="#" class="btn btn-primary">Detail</a><button class="btn btn-danger deleteBlog" blog_id="'+ key +'">Delete</button></div></div></div>';
    }
    document.querySelector('.list-blog').innerHTML = innerText;
    delete_blog();
  }

}