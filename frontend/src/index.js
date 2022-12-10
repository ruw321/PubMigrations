import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import MigrationsPage from './pages/MigrationsPage';
import ResearchersPage from './pages/ResearchersPage';
import BioEntitiesSearcherPage from './pages/BioEntitiesSearcherPage';
import PublicationsPage from './pages/PublicationsPage';
import InstitutionsPage from './pages/InstitutionsPage';
import CountriesPage from './pages/CountriesPage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
			path="/"
			render={() => (
				<HomePage />
			)}/>
        <Route exact
			path="/migrations"
			render={() => (
				<MigrationsPage />
			)}/>
        <Route exact
			path="/researchers"
			render={() => (
				<ResearchersPage />
			)}/>
        <Route exact
			path="/bioentities"
			render={() => (
				<BioEntitiesSearcherPage />
			)}/>
		<Route exact
			path="/publications"
			render={() => (
				<PublicationsPage />
			)}/>
		<Route exact
			path="/institutions"
			render={() => (
				<InstitutionsPage />
			)}/>
		<Route exact
			path="/countries"
			render={() => (
				<CountriesPage />
			)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

