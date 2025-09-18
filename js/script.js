'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
}

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
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optAuthorsListSelector = '.authors.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){
  console.log('generateTitleLinks(): start');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  /* for each article */
  for (const article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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


function calculateTagsParams(tags){
  const params = { min: 999999, max: 0 };
  for (const tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = (params.max - params.min) || 1;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
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
      const linkHTML = templates.tagLink({ tag: tag });
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags object (start from 1) */
        allTags[tag] = 1;
      } else {
        allTags[tag] = allTags[tag] + 1;
      }
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
  }
  /* END LOOP: for every article: */

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  const tagsParams = calculateTagsParams(allTags);
  for (const tag in allTags){
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);


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

  /* [NEW] obiekt zliczający autorów do prawej kolumny */
  let allAuthors = {};

  /* START LOOP: for every article: */
  for (const article of articles){

    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* get author from data-author attribute */
    const author = article.getAttribute('data-author') || '';

    /* create HTML of the link (single author per article) */
    authorWrapper.innerHTML = author ? templates.authorLink({ author }) : '';
    /* insert HTML into the author wrapper */

    /* [NEW] zlicz autora do prawej kolumny */
    if(!allAuthors[author]){
      allAuthors[author] = 1;
    } else {
      allAuthors[author] = allAuthors[author] + 1;
    }
  }
  /* END LOOP: for every article: */

  const authorsList = document.querySelector(optAuthorsListSelector);
  const allAuthorsData = { authors: [] };

  for (const author in allAuthors){
  allAuthorsData.authors.push({
    author: author,
    count: allAuthors[author],
  });
}

authorsList.innerHTML = templates.authorListLink(allAuthorsData);
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