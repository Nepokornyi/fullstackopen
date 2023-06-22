const dummy = (data) => {
    if(data){
        return 1
    }
}

const allLikes = (data) => {
    return data.reduce((allLikes, blog) => allLikes + blog.likes, 0)
}

const favoriteBlog = (data) => {
    return data.reduce((max, blog) => {
        return (blog.likes > max.likes) ? blog : max;
    }, data[0]);
}

const mostBlogs = (data) => {
    const authorCount = {};

    data.forEach(blog => {
        if (authorCount[blog.author]) {
            authorCount[blog.author]++;
        }
        else {
            authorCount[blog.author] = 1;
        }
    });

    const mostBlogsAuthor = Object.keys(authorCount).reduce((max, author) => {
        return authorCount[author] > authorCount[max] ? author : max;
    }, Object.keys(authorCount)[0])

    return {
        author: mostBlogsAuthor,
        blogs: authorCount[mostBlogsAuthor]
    }
}

const mostLikes = (data) => {
    let authorWithMostLikes = '';
    let mostLikedPost = 0;
    let authorLikesCount = {};

    data.forEach(blog => {
        if (authorLikesCount[blog.author]) {
            authorLikesCount[blog.author] += blog.likes
        }
        else {
            authorLikesCount[blog.author] = blog.likes
        }

        if(blog.likes > mostLikedPost) {
            mostLikedPost = blog.likes;
            authorWithMostLikes = blog.author;
        }
    });


    return {
        author: authorWithMostLikes,
        likes: authorLikesCount[authorWithMostLikes]
    }
}

module.exports = { dummy, allLikes, favoriteBlog, mostBlogs, mostLikes };