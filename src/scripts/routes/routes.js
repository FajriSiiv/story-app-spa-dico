import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-page';
import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail-story/detail-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  '/add': new AddPage(),
  '/story/detail': new DetailPage(),
  '/bookmarks': new BookmarkPage(),
};

export default routes;
