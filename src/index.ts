import { dom } from '@fortawesome/fontawesome-svg-core';
import 'normalize.css';
import { App } from './app';
import './styles.scss';

dom.watch();

const host = document.getElementById('app')!;

App.create(host);
