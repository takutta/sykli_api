const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }
  
  module.exports = {
    dummy
  }

 const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  else if (blogs.length === 1) {
    return blogs[0].likes
  }
  else {
    return blogs.reduce((sum, blog) => {
      return sum + blog.likes
    },0);
  }
};

const favoriteBlog = (blogs) => {
  const blogWithMaxLikes = blogs.reduce((maxBlog, currentBlog) => {
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
  });
  const { title, author, likes } = blogWithMaxLikes;
  const result = { title, author, likes };
  return result
};

// const mostBlogs = (blogs) => {
//   const sortedCounts = _.chain(blogs)
//     .countBy('author')
//     .toPairs()
//     .orderBy(([author, count]) => count, 'desc')
//     .value();

//   return {
//     author: sortedCounts[0][0],
//     blogs: sortedCounts[0][1]
//   };
// };

const mostBlogs = (blogs) => {
  const authorWithMostBlogs = _.countBy(blogs, 'author');
  const sortedCounts = _.orderBy(
    Object.entries(authorWithMostBlogs),
    ([, count]) => count,
    'desc'
  );
  const [author, blogsCount] = sortedCounts[0];

  return {
    author,
    blogs: blogsCount
  };
};




const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, 'author');
  const authorLikesSum = _.mapValues(authorLikes, (group) => _.sumBy(group, 'likes'));
  const authorLikesPairs = _.toPairs(authorLikesSum)
  const sortedLikes = _.orderBy(authorLikesPairs, ([, likes]) => likes, 'desc');
  const [author, likes] = sortedLikes[0];

  return { author, likes };
};

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
