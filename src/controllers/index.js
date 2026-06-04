

const indexPage = async (req, res) => {
    const title = 'Home';
    res.render('home', {
        title,
        isLoggedIn: res.locals.isLoggedIn
    });
}

export { indexPage };