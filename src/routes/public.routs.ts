import express from 'express'
const router = express.Router();


router.get('/', (_req:any, res:any,) => {
  res.render('home', { cssFileName: 'home', title: 'Home' });
});

router.get('/redirect', (_req:any, res:any,) => {
  res.render('redirect', { cssFileName: 'redirect', title: 'Redirect' });
});

export default router;
