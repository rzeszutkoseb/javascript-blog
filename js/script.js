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

  const articleSelector = clickedElement.getAttribute('href'); 


  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);


  /* add class 'active' to the correct article */

  if (targetArticle) targetArticle.classList.add('active');

}
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks(){
  console.log('generateTitleLinks(): start');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector);
  let html = '';

  /* for each article */
  for (const article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log('linkHTML:', linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = titleList.querySelectorAll('a');
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }

  console.log('generateTitleLinks(): done');

}

generateTitleLinks();