'use strict';

function titleClickHandler(event){
  console.log('titleClickHandler event:', event);
  console.log('event.target =', event.target);               
  console.log('event.currentTarget =', event.currentTarget);

  event.preventDefault();

  const clickedElement = event.currentTarget;

  /* remove class 'active' from all article links  */

  document.querySelectorAll('.titles a.active').forEach(a => a.classList.remove('active'));

  /* add class 'active' to the clicked link */

    clickedElement.classList.add('active');


  /* remove class 'active' from all articles */

    document.querySelectorAll('.posts .post.active').forEach(p => p.classList.remove('active'));


  /* get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href'); // np. "#article-2"


  /* find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);


  /* add class 'active' to the correct article */

    if (targetArticle) targetArticle.classList.add('active');

}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}