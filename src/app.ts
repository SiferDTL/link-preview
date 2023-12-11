import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import {limiter} from './libs/limiter'
import { engine } from 'express-handlebars'
import PrevLinkRouter from './routes/link.routes'
import PublicRouter from './routes/public.routs'

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(limiter(15 * 60 * 1000, 1000));

app.use((req:any, res:any, next:any) => {
  if (req.headers.host.match(/^www/) !== null) {
    res.redirect(
      301,
      'http://' + req.headers.host.replace(/^www\./, '') + req.url,
    );
  } else {
    next();
  }
});
app.use(helmet());
app.use(logger(formatsLogger));
app.use(express.static('public'));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use((_req:any, res:any, next:any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', engine());


app.use('/', PublicRouter);
app.use('/api/prev-link', PrevLinkRouter);
app.use((_req:any, res:any,) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err:any, _req:any, res:any, _next:any,) => {
  res.status(500).json({ message: err.message });
});

export default app;