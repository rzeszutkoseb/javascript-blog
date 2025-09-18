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
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author';

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

function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (const article of articles){
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags') || '';
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ').filter(Boolean);
    /* START LOOP: for each tag */
    for (const tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
  }
  /* END LOOP: for every article: */
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = event.currentTarget;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  activeTagLinks.forEach(function(link){
    /* remove class active */
    link.classList.remove('active');
  });
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksSameHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  tagLinksSameHref.forEach(function(link){
    /* add class active */
    link.classList.add('active');
  });
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  tagLinks.forEach(function(link){
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  });
  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (const article of articles){

    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* get author from data-author attribute */
    const author = article.getAttribute('data-author') || '';

    /* create HTML of the link (single author per article) */
    const authorHTML = author ? 'by <a href="#author-' + author + '">' + author + '</a>' : '';

    /* insert HTML into the author wrapper */
    authorWrapper.innerHTML = authorHTML;
  }
  /* END LOOP: for every article: */
}

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = event.currentTarget;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  activeAuthorLinks.forEach(function(link){
    /* remove class active */
    link.classList.remove('active');
  });
  /* END LOOP: for each active author link */

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinksSameHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found author link */
  authorLinksSameHref.forEach(function(link){
    /* add class active */
    link.classList.add('active');
  });
  /* END LOOP: for each found author link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}
function addClickListenersToAuthors(){
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  authorLinks.forEach(function(link){
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  });
  /* END LOOP: for each link */
}

generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();